import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo">✓</div>
          <span className="navbar-name">TaskFlow</span>
        </div>

        <div className="navbar-right">
          <span className="navbar-welcome">
            Welcome, <strong>{user?.name || 'User'}</strong>
          </span>
          <button className="btn-logout" onClick={logoutUser}>
            <span>⎋</span> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
