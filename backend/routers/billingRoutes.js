const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const Pricing = require('../models/Pricing');

router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).populate('prescriptions');
    console.log(patient);
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    const prescription = await Prescription.findOne({ patient: patientId });
    if (!prescription) return res.status(404).json({ msg: 'Prescription not found' });

    const pricing = await Pricing.find({
      serviceName: { $in: prescription.tests }
    });

    const total = pricing.reduce((sum, item) => sum + item.price, 0);

    res.json({
      patient,
      prescription,
      pricing,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
