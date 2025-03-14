const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Employees', EmployeeSchema);
