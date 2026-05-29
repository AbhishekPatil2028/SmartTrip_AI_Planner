import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import Itinerary from '../models/Itinerary.js';

// Helper to initialize Gemini Client with dynamic key fallback
const getGenAIClient = (req) => {
  const apiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API Key is missing. Please configure GEMINI_API_KEY in the backend .env or supply it in settings.');
  }
  return new GoogleGenerativeAI(apiKey);
};

// @desc    Generate a new AI-powered itinerary
// @route   POST /api/itineraries/generate
// @access  Private
export const generateItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, bookings } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide destination, start date, and end date.' });
    }

    let client;
    try {
      client = getGenAIClient(req);
    } catch (keyErr) {
      return res.status(401).json({ success: false, message: keyErr.message, keyMissing: true });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    console.log(`Generating a ${durationDays}-day itinerary for "${destination}"...`);

    const prompt = `
Generate a highly detailed, professional, and visually engaging day-by-day travel itinerary.
Destination: ${destination}
Start Date: ${startDate}
End Date: ${endDate}
Total Days: ${durationDays}
Extracted Bookings: ${JSON.stringify(bookings, null, 2)}

Requirements:
1. Generate an itinerary covering all ${durationDays} days from ${startDate} to ${endDate}.
2. Ensure you seamlessly integrate all the "Extracted Bookings" on their correct dates and times. For example, if there is a hotel check-in booking on the start date, place it under Day 1's activities. If there is a flight departure, list it under the appropriate day and time slot.
3. For each day, organize activities into three time slots: "Morning", "Afternoon", and "Evening".
4. Add interesting, relevant activities based on the destination (sightseeing, food, local spots).
5. Generate a smart packing list tailored to the destination, season (based on dates), and activities.
6. Generate 3-5 high-value travel tips (local transport, customs, food recommendations).
7. Estimate a total budget range for this trip.

Return the response ONLY as a JSON object matching this structure:
{
  "title": "string (e.g., Paris Art & Culinary Escape)",
  "destination": "string (e.g., Paris, France)",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "summary": "string (an engaging 2-3 sentence overview of the trip)",
  "estimatedBudget": "string (e.g., $1,800 - $2,500)",
  "days": [
    {
      "dayNumber": number,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "timeSlot": "Morning" | "Afternoon" | "Evening",
          "activityTitle": "string",
          "description": "string (detailed, engaging details about this activity)",
          "location": "string (physical address or name of place)",
          "category": "string (e.g., flight, hotel, train, sightseeing, dining, transit, relaxation)",
          "bookingRefIndex": number (if this activity corresponds directly to one of the extracted bookings, provide its index in the "Extracted Bookings" array, starting at 0. Otherwise omit or pass null)
        }
      ]
    }
  ],
  "packingList": [
    {
      "item": "string",
      "category": "string (e.g., Clothing, Electronics, Toiletries, Documents)",
      "essential": boolean
    }
  ],
  "tips": [
    {
      "title": "string",
      "content": "string"
    }
  ]
}

Ensure the output is clean JSON. Do not include markdown formatting or backticks. Just return the JSON string.
`;

    // Retrieve model
    const model = client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textOutput = response.text();

    // Parse the JSON output from Gemini
    let generatedData;
    try {
      generatedData = JSON.parse(textOutput.trim());
    } catch (parseErr) {
      console.error('Failed to parse itinerary JSON. Output:', textOutput);
      return res.status(500).json({
        success: false,
        message: 'Could not structure the generated itinerary. Please try again.',
        raw: textOutput,
      });
    }

    // Prepare Mongoose object
    const itinerary = new Itinerary({
      user: req.user._id,
      title: generatedData.title || `Trip to ${destination}`,
      destination: generatedData.destination || destination,
      startDate: new Date(generatedData.startDate || startDate),
      endDate: new Date(generatedData.endDate || endDate),
      summary: generatedData.summary || '',
      estimatedBudget: generatedData.estimatedBudget || '',
      bookings: bookings || [],
      uploadedFiles: (bookings || [])
        .filter((b) => b.fileUrl)
        .map((b) => ({
          fileUrl: b.fileUrl,
          fileName: b.fileName || b.title || 'Uploaded Document',
          fileType: b.category || 'other',
        })),
      days: generatedData.days || [],
      packingList: (generatedData.packingList || []).map((item) => ({
        ...item,
        packed: false,
      })),
      tips: generatedData.tips || [],
      isShared: false,
      shareId: crypto.randomUUID(),
    });

    const savedItinerary = await itinerary.save();
    console.log('Successfully saved AI itinerary to MongoDB.');

    return res.status(201).json({
      success: true,
      message: 'Itinerary generated successfully!',
      itinerary: savedItinerary,
    });
  } catch (error) {
    console.error('Itinerary Generation Error:', error.message);
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
      message: 'Failed to generate itinerary: ' + error.message,
    });
  }
};

// @desc    Get all itineraries for logged in user
// @route   GET /api/itineraries
// @access  Private
export const getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: itineraries.length, itineraries });
  } catch (error) {
    console.error('Fetch Itineraries Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching itineraries' });
  }
};

// @desc    Get detailed itinerary by ID
// @route   GET /api/itineraries/:id
// @access  Private
export const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check ownership
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: this is not your itinerary' });
    }

    return res.json({ success: true, itinerary });
  } catch (error) {
    console.error('Fetch Itinerary ID Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching itinerary details' });
  }
};

// @desc    Delete itinerary
// @route   DELETE /api/itineraries/:id
// @access  Private
export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check ownership
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: this is not your itinerary' });
    }

    await itinerary.deleteOne();
    return res.json({ success: true, message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Delete Itinerary Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting itinerary' });
  }
};

// @desc    Toggle share status (returns shareId)
// @route   PATCH /api/itineraries/:id/share
// @access  Private
export const toggleShareItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check ownership
    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    itinerary.isShared = !itinerary.isShared;
    if (itinerary.isShared && !itinerary.shareId) {
      itinerary.shareId = crypto.randomUUID();
    }

    const updatedItinerary = await itinerary.save();
    return res.json({
      success: true,
      message: `Itinerary sharing is now ${updatedItinerary.isShared ? 'Enabled' : 'Disabled'}`,
      isShared: updatedItinerary.isShared,
      shareId: updatedItinerary.shareId,
    });
  } catch (error) {
    console.error('Share Toggle Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating sharing status' });
  }
};

// @desc    Get shared itinerary publicly (requires no Auth!)
// @route   GET /api/itineraries/shared/:shareId
// @access  Public
export const getSharedItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ shareId: req.params.shareId });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Shared itinerary not found' });
    }

    if (!itinerary.isShared) {
      return res.status(403).json({ success: false, message: 'This itinerary is no longer public' });
    }

    return res.json({ success: true, itinerary });
  } catch (error) {
    console.error('Fetch Shared Itinerary Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving shared itinerary' });
  }
};

// @desc    Import/Clone a shared itinerary into user account
// @route   POST /api/itineraries/shared/:shareId/import
// @access  Private
export const importSharedItinerary = async (req, res) => {
  try {
    const sharedItinerary = await Itinerary.findOne({ shareId: req.params.shareId });

    if (!sharedItinerary) {
      return res.status(404).json({ success: false, message: 'Shared itinerary not found' });
    }

    if (!sharedItinerary.isShared) {
      return res.status(403).json({ success: false, message: 'This itinerary is no longer public and cannot be imported' });
    }

    // Clone the itinerary details for the logged in user
    const clonedItinerary = new Itinerary({
      user: req.user._id,
      title: `${sharedItinerary.title} (Cloned)`,
      destination: sharedItinerary.destination,
      startDate: sharedItinerary.startDate,
      endDate: sharedItinerary.endDate,
      summary: sharedItinerary.summary,
      estimatedBudget: sharedItinerary.estimatedBudget,
      bookings: sharedItinerary.bookings.map((booking) => ({
        category: booking.category,
        title: booking.title,
        confirmationNumber: booking.confirmationNumber,
        startDate: booking.startDate,
        endDate: booking.endDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        origin: booking.origin,
        destination: booking.destination,
        provider: booking.provider,
        notes: booking.notes,
      })),
      days: sharedItinerary.days.map((day) => ({
        dayNumber: day.dayNumber,
        date: day.date,
        activities: day.activities.map((activity) => ({
          timeSlot: activity.timeSlot,
          activityTitle: activity.activityTitle,
          description: activity.description,
          location: activity.location,
          category: activity.category,
          bookingRefIndex: activity.bookingRefIndex,
        })),
      })),
      packingList: sharedItinerary.packingList.map((item) => ({
        item: item.item,
        category: item.category,
        essential: item.essential,
        packed: false, // Reset packed status
      })),
      tips: sharedItinerary.tips.map((tip) => ({
        title: tip.title,
        content: tip.content,
      })),
      isShared: false,
      shareId: crypto.randomUUID(),
    });

    const savedItinerary = await clonedItinerary.save();
    return res.status(201).json({
      success: true,
      message: 'Itinerary successfully copied into your account!',
      itinerary: savedItinerary,
    });
  } catch (error) {
    console.error('Import Itinerary Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error copying the shared itinerary' });
  }
};
