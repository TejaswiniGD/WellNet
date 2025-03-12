const express = require('express');
const router = express.Router();
const Pricing = require('../models/Pricing');

router.post('/', async (req, res) => {
  const { serviceName, price } = req.body;

  try {
    let pricing = await Pricing.findOne({ serviceName });
    if (pricing) {
      return res.status(400).json({ msg: 'Service name already exists' });
    }
    pricing = new Pricing({
      serviceName,
      price,
    });

    await pricing.save();
    res.json(pricing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
