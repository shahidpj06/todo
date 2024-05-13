import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/', { username, email, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      navigate('/');
    } catch (error) {
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
      <p className="redirect-link">Already have an account? <Link to="/">Login here</Link></p>
    </div>
  );
};


  export default Signup;