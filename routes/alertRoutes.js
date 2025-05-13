const express = require('express');
const router = express.Router();
const { getAlertsForUser, markAlertAsRead } = require('../controllers/alertController');

router.get('/', getAlertsForUser);
router.patch('/:id/read', markAlertAsRead);

module.exports = router;
