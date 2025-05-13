import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// Get all books for the current user
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.userId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new book
router.post('/', async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      userId: req.userId
    });
    res.status(201).json(book);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update a book's status
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized' });
    }
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 