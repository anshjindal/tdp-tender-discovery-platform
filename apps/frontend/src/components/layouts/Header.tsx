import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/components/AuthContext';    

const Header: React.FC = () => {
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '12px',
      }} className="bg-white text-black  text-xl font-bold"
    >
      <div className="relative bg-white border border-gray rounded-lg p-0.5 w-1/4">
        <div className="absolute inset-y-0 start-0 flex items-center ms-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input type="search" id="default-search" className="block w-full font-normal text-gray-900 p-1 ps-10 text-[14px]  bg-white focus:outline-none" placeholder="Search for tenders" required />
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

        {auth.isAuthenticated ? (
          <>
            <span style={{ paddingLeft: '1rem' }}>Welcome, {auth.user.name || auth.user.email}</span>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '0.5rem 1rem' }}
          >
            Signin | Signup
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;