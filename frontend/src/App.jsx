import React from 'react';
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Project from './Project';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
// import PrivateRoute from './utils/PrivateRoute'
// import Header from './components/Header';

function App() {
  return (
    <Router>
        {/* <Header/> */}
        <Routes>
          <Route  element={<Project />} path="/" exact/>
          <Route path="/:projectId" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </Router>
  );
}

export default App;
