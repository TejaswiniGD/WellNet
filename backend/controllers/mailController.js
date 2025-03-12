const Patient = require('../models/Patient');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendThankYou = async (req, res) => {
  try{
    const { id } = req.params;

    const patient = await Patient.findById(id).populate('prescriptions', 'medicines');
    if(!patient) return res.status(404).json({msg: "Patient not found"});

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: "Thank You For Choosing Our Hospital",
      text: `Dear ${patient.firstName} \nThank you for visiting Our Hospital \nBelow Are the Medicines You should buy in Pharmacy:  ${patient.prescriptions
        .flatMap(prescription => prescription.medicines)
        .join('\n')}`
      
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send("Error sending email");
      }
      console.log('Email sent:', info.response);
    });

    res.json(patient);
  }catch(error){
    res.status(500).send('Server Error');
  }
}
