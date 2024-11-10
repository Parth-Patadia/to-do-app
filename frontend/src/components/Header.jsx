import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ user, logout }) {
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          TaskMaster
        </Link>
        <nav>
          {user ? (
            <div className="user-nav">
              <span>Welcome, {user.name}</span>
              <button onClick={onLogout} className="btn btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-nav">
              <Link to="/login" className="btn btn-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-register">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header; 