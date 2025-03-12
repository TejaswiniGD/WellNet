const express = require('express');
const router = express.Router();
const Patients = require('../models/Patient');
const Prescription = require('../models/Prescription');

router.get('/:patientId', async (req, res) => {
  try{
    const {patientId} = req.params;
    const patients = await Patients.findById(patientId).populate('prescriptions');
    if(!patients){
      return res.status(404).json({msg: 'patients not found'});
    }

    const prescription = await Prescription.findOne({patient: patientId});
    if(!prescription) return res.status(404).json({msg: "Prescription not found"});

    res.json({patients, prescription});
  }catch(error){
    console.log(error.message);
    res.status(500).json({msg : "Server Error"});
  }
});

module.exports = router;