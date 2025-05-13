import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Get all bookings with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, date, email } = req.query;
    const query = {};

    if (status) query.status = status;
    if (date) query.date = { $gte: new Date(date) };
    if (email) query.email = email.toLowerCase();

    const bookings = await Booking.find(query)
      .sort({ date: 1 })
      .select('-__v');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: error.message 
    });
  }
});

// Get a specific booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).select('-__v');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching booking',
      error: error.message 
    });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { name, email, date, topic, notes } = req.body;

    // Check for existing booking on the same date
    const existingBooking = await Booking.findOne({
      date: new Date(date),
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'This time slot is already booked' 
      });
    }

    const booking = new Booking({
      name,
      email,
      date: new Date(date),
      topic,
      notes
    });

    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message 
    });
  }
});

// Update a booking
router.patch('/:id', async (req, res) => {
  try {
    const { name, email, date, topic, notes, status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If updating date, check for conflicts
    if (date && date !== booking.date.toISOString()) {
      const existingBooking = await Booking.findOne({
        _id: { $ne: req.params.id },
        date: new Date(date),
        status: { $ne: 'cancelled' }
      });

      if (existingBooking) {
        return res.status(400).json({ 
          message: 'This time slot is already booked' 
        });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { name, email, date, topic, notes, status },
      { new: true, runValidators: true }
    );

    res.json(updatedBooking);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error updating booking',
      error: error.message 
    });
  }
});

// Cancel a booking
router.post('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({ 
        message: 'Booking cannot be cancelled less than 24 hours before the appointment' 
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error cancelling booking',
      error: error.message 
    });
  }
});

export default router; 