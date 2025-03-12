import React, { useState, useEffect } from 'react';
import MainLayout from './MainLayout';
import AddEmployeeDialog from './addEmployeeDialog';
import { useNavigate } from 'react-router-dom';
import "../style/addEmp.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const Plans = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);    // to add employees  for true open the add employee table , false cancel button
  const [employees, setEmployees] = useState([]);

  const handleOpen = () => setIsOpen(true);    // dialog box
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        await axios.get('http://localhost:5000/api/users', {
          headers: { 'x-auth-token': token },
        });

      } catch (err) {
        console.error(err.message);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);  //to check admin valid or not

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/emp/get');
      setEmployees(response.data);
    } catch (error) {
      console.log('Error fetching employees:', error);
    }
  };

  

  useEffect(() => {
    fetchEmployees();  // to fetch on loading components
  }, []);  

  return (
    <MainLayout>
      <div className='add-emp'>
        <div className="dialog-button">
          <h4>Add Employees</h4>
          <button className='add-employees' onClick={handleOpen}>
            <i className="bi bi-plus-lg"></i> Add
          </button>
        </div>

        <div className="display-emp">
          <span className='emp'>Active Employees</span>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Email</th>
                <th>Phone</th> 
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee._id}>
                  <td>{employee.firstName}</td>
                  <td>{employee.role}</td>
                  <td>{employee.gender}</td>
                  <td>Available</td>
                  <td>{employee.email}</td>
                  <td>{employee.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddEmployeeDialog 
        isOpen={isOpen} 
        handleClose={handleClose} 
        onEmployeeAdded={fetchEmployees} 
      />
    </MainLayout>
  );
};

export default Plans;
