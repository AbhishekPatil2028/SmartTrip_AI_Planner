import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['flight', 'hotel', 'train', 'car_rental', 'other'],
    default: 'other',
  },
  title: { type: String, default: 'Reservation' },
  confirmationNumber: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  origin: { type: String, default: '' },
  destination: { type: String, default: '' },
  provider: { type: String, default: '' },
  notes: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  fileName: { type: String, default: '' },
});

const activitySchema = new mongoose.Schema({
  timeSlot: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening'],
    required: true,
  },
  activityTitle: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  category: { type: String, default: 'sightseeing' },
  bookingRefIndex: { type: Number }, // Optional index reference to the parent bookings array
});

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: Date },
  activities: [activitySchema],
});

const packingItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  category: { type: String, default: 'General' },
  essential: { type: Boolean, default: false },
  packed: { type: Boolean, default: false },
});

const tipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a trip title'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    summary: {
      type: String,
      default: '',
    },
    estimatedBudget: {
      type: String,
      default: '',
    },
    bookings: [bookingSchema],
    days: [daySchema],
    packingList: [packingItemSchema],
    tips: [tipSchema],
    isShared: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
    uploadedFiles:[
      {
        fileUrl:String,
        fileName:String,
        fileType:String
      }
    ]
  },
  {
    timestamps: true,
  },
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

export default Itinerary;
