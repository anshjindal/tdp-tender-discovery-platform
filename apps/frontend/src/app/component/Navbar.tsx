// Navbar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar: React.FC = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Reset the auth state to logged out.
    setAuth({
      isAuthenticated: false,
      user: {
        email: "",
        name: "",
      },
    });
    // Optionally remove the token if stored
    localStorage.removeItem("access_token");
    navigate('/');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #ccc',
      }}
    >
      <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        Wouessi
      </h1>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* New Search Tenders Link */}
        <button 
          onClick={() => navigate('/tendersearch')} 
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Search Tenders
        </button>

        {auth.isAuthenticated ? (
          <>
            <span>Welcome, {auth.user.name || auth.user.email}</span>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '0.5rem 1rem' }}
          >
            Signin/Signup
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
