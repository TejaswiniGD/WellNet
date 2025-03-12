import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import axios from 'axios';
import "../style/dialog.css";

const AddEmployeeDialog = ({ isOpen, handleClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    role: ''
  });

  useEffect(() => {                    //after submit the field should be empty 
    if (isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        gender: '',
        role: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/emp/auth/register', formData);
      console.log('Employee added:', response.data);
      onEmployeeAdded(); // Callback to refresh the employee list 
      handleClose();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleDialogClose = () => {             //after close the field must be empty
    handleClose();
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      gender: '',
      role: ''
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleDialogClose}>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="Oncologist">Oncologist</MenuItem>
              <MenuItem value="Pediatrician">Pediatrician</MenuItem>
              <MenuItem value="Dermatologist">Dermatologist</MenuItem>
              <MenuItem value="Psychiatrist">Psychiatrist</MenuItem>
              <MenuItem value="Physicians">Physicians</MenuItem>
              <MenuItem value="Testing">Testing</MenuItem>
              <MenuItem value="receptionist">Receptionist</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;
