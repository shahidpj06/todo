import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import LogoutModal from './Auth/LogoutModal';


const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
  };


  return ( 
    <>
      <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          Todo
        </Link>
        <div className="navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link" id='logout_button' onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
     {/* {isModalOpen && (
        <LogoutModal id="logoutModal" onClose={closeModal} onConfirm={handleLogout} />
      )} */}
    <br />
    </>
  );
};

export default Navbar;