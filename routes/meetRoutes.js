const express = require('express');
const router = express.Router();
const {
  createMeet,
  getMeets,
  bookMeet
} = require('../controllers/meetController');

router.post('/', createMeet);
router.get('/', getMeets);
router.post('/book/:id', bookMeet);

module.exports = router;
