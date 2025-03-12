const Patients = require('../models/Patient')

exports.showPrescription = async (req, res) => {
  try{
    const PatientId = req.params.id; 
    const patient = await Patients.findById(PatientId).populate('prescriptions').exec(); // populate to populate that id and exce for execution

    console.log(patient);

    if(!patient){
      return res.status(404).json({msg: 'Patient Not Found'});
    }

    res.json(patient);
  }catch(error){
    console.log(error.message);
    res.status(500).json({msg: 'Internal Server Error'});
  }
}