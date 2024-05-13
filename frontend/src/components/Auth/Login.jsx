import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      navigate('/home');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <br />
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username"
           value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <p className="redirect-link">Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
  };

  export default Login;