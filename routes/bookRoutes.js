const express = require('express');
const router = express.Router();
const {
  getToReadList,
  getFinishedBooks,
  addBook,
  markAsFinished,
  removeBook
} = require('../controllers/bookController');

router.get('/to-read', getToReadList);
router.get('/finished', getFinishedBooks);
router.post('/', addBook);
router.patch('/finish/:id', markAsFinished);
router.delete('/:id', removeBook);

module.exports = router;
