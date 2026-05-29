import { GoogleGenerativeAI } from '@google/generative-ai';
import { uploadFileToS3 }
from "../services/s3Service.js";
// Helper to initialize Gemini Client with dynamic key fallback
const getGenAIClient = (req) => {
  const apiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API Key is missing. Please configure GEMINI_API_KEY in the backend .env or supply it in settings.');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Helper to convert buffer to generative part
const bufferToGenerativePart = (buffer, mimeType) => {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
};

// @desc    Upload document and extract details
// @route   POST /api/upload/document
// @access  Private
export const uploadAndExtractDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a travel ticket or booking file' });
    }

    const { buffer, mimetype, originalname } = req.file;
    let s3Url = null;
    if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY && process.env.AWS_BUCKET_NAME) {
      try {
        s3Url = await uploadFileToS3(req.file);
        console.log("S3 URL:", s3Url);
      } catch (s3Err) {
        console.warn("Failed to upload to S3 (continuing anyway):", s3Err.message);
      }
    } else {
      console.log("S3 credentials not configured. Skipping S3 upload.");
    }

    // Check supported mime types
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedMimeTypes.includes(mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF and Images (PNG, JPG, JPEG) are supported.',
      });
    }

    let client;
    try {
      client = getGenAIClient(req);
    } catch (keyErr) {
      return res.status(401).json({ success: false, message: keyErr.message, keyMissing: true });
    }

    // Prepare content parts for Gemini
    const filePart = bufferToGenerativePart(buffer, mimetype);
    
    const prompt = `
Extract all travel booking information from the provided document.
Identify if it is a flight, hotel, train, car rental, or other booking.
Extract details such as:
- Category (must be one of: 'flight', 'hotel', 'train', 'car_rental', 'other')
- Title (e.g., 'Flight to Paris', 'Hotel Ritz Paris')
- Confirmation Number (e.g., confirmation code or booking reference)
- Start Date (in YYYY-MM-DD format if found, otherwise omit or estimate)
- End Date (in YYYY-MM-DD format if found, or same as Start Date if single day)
- Start Time (in HH:MM format if found, e.g. '14:30')
- End Time (in HH:MM format if found, e.g. '18:45')
- Origin (e.g., departure city or airport code, e.g. 'New York (JFK)' for flights, or blank if not applicable)
- Destination (e.g., arrival city, airport code, or hotel name/address)
- Provider (e.g., 'Air France', 'Marriott', 'Eurostar')
- Notes (any other details like flight number, train number, seat, check-in instructions, baggage allowance, price, or description)

Return the extracted information ONLY as a JSON object matching this schema:
{
  "category": "flight" | "hotel" | "train" | "car_rental" | "other",
  "title": "string",
  "confirmationNumber": "string",
  "startDate": "YYYY-MM-DD or null",
  "endDate": "YYYY-MM-DD or null",
  "startTime": "string",
  "endTime": "string",
  "origin": "string",
  "destination": "string",
  "provider": "string",
  "notes": "string"
}

If certain information is not in the ticket, put empty string "" or null for dates.
Ensure the output is clean JSON. Do not include markdown formatting or backticks. Just return the JSON string.
`;

    // Retrieve model
    const model = client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    console.log(`Sending file "${originalname}" to Gemini for parsing...`);
    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const textOutput = response.text();

    console.log('Successfully received extraction response from Gemini.');
    
    // Parse the JSON output from Gemini
    let extractedData;
    try {
      extractedData = JSON.parse(textOutput.trim());
      // Append file references so they get passed with the booking object automatically
      if (s3Url) {
        extractedData.fileUrl = s3Url;
        extractedData.fileName = originalname;
      }
    } catch (parseErr) {
      console.error('Failed to parse Gemini output as JSON. Output:', textOutput);
      return res.status(500).json({
        success: false,
        message: 'Could not structure the ticket details. Please try uploading again or fill details manually.',
        raw: textOutput,
      });
    }

    return res.json({
      success: true,
      message: 'Ticket details successfully extracted!',
      filename: originalname,
      fileUrl:s3Url,
      booking: extractedData,
    });
  } catch (error) {
    console.error('Document Extraction Error:', error.message);
    const isQuota = error.message.includes('429') || 
                    error.message.toLowerCase().includes('quota') || 
                    error.message.toLowerCase().includes('limit');
    
    if (isQuota) {
      return res.status(429).json({
        success: false,
        isQuotaExceeded: true,
        message: 'The shared server API key has reached its Google free-tier rate limit.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to connect to the AI engine: ' + error.message,
    });
  }
};
