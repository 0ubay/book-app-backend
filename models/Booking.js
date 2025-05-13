import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date();
      },
      message: 'Booking date must be in the future'
    }
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
    minlength: [3, 'Topic must be at least 3 characters long'],
    maxlength: [200, 'Topic cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
});

// Add index for efficient querying
bookingSchema.index({ date: 1, status: 1 });

// Add instance method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const bookingDate = new Date(this.date);
  const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);
  return hoursDifference >= 24;
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking; 