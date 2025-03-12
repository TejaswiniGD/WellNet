// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="container">
      <div className="card">
      <form onSubmit={onSubmit}>
      <h2>Register</h2>
      <input type="text" name="name" value={name} onChange={onChange} required  placeholder='Enter your name'/> <br />
      <input type="email" name="email" value={email} onChange={onChange} required placeholder='Enter your email'/><br />
      <input type="password" name="password" value={password} onChange={onChange} required placeholder='Create Password'/><br />
      <button className="btnr" type="submit">Register</button>
    </form>
      </div>
    </div>
  );
};

export default Register;
