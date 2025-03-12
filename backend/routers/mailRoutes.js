const express = require('express');
const { sendThankYou } = require('../controllers/mailController');
const router = express.Router();

router.get('/thankyou/:id', sendThankYou);

module.exports = router;