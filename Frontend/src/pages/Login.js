
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/login.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if(email === 'admin@gmail.com'){
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', formData);
        console.log(res.data.token)
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } catch (err) {
        toast.error('Invalid Credentials', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error(err.response.data);
      }
    }else{
      try{
        const res = await axios.post('http://localhost:5000/api/emp/auth/login', formData);
        localStorage.setItem('token', res.data.token);
        console.log(res.data.token);
        localStorage.setItem('userId', res.data.id);
        const role = res.data.role;
        console.log(role);
        if(role === 'Testing'){
          navigate('/testing/dashboard');
        }else if(role === 'receptionist'){
          navigate('/receptionist-dashboard')
        }else{
          navigate('/doctor-dashboard');
        }
      }catch (err) {
        console.error(err.response.data);
        toast.error('Invalid Credentials', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };
  return (
    <div className="container">
      <ToastContainer />
      <div className="card">
      <form onSubmit={onSubmit}>
      <h2>Login</h2>
      <input className='inputL' type="email" name="email" value={email} onChange={onChange} required placeholder='Enter your email'/><br />
      <input className='inputL' type="password" name="password" value={password} onChange={onChange} required placeholder='Enter your password'/><br />
      <button className='btnL' type="submit">Login</button>
      <p>Don't have an account? <span onClick={goToRegister}>Signup</span></p>
    </form>
      </div>
    </div>
  );
};

export default Login;
