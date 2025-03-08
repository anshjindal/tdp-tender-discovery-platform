import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ForgotResetPassword: React.FC = () => {
  // Tries to obtain tokens from the route
  const { token: routeToken } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Token storage
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');

  // For forms and messages
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // extract tokens from url hash if necessary.
  useEffect(() => {
    if (routeToken) {
      setAccessToken(routeToken);
      // In case refresh token is in the hash, extract it:
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const refresh = params.get('refresh_token');
        if (refresh) setRefreshToken(refresh);
      }
    } else if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access = params.get('access_token');
      const refresh = params.get('refresh_token');
      if (access) setAccessToken(access);
      if (refresh) setRefreshToken(refresh);
    }
  }, [routeToken]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/v1/auth/forgot-password', { email });
      setMessage('Password reset link has been sent to your email.');
    } catch (error: any) {
      console.error('Forgot Password Error:', error.response?.data || error.message);
      setMessage('Error: Unable to send reset email.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    if (!accessToken || !refreshToken) {
      setMessage('Reset tokens are missing. Please use the link in your email.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:3000/api/v1/auth/reset-password',
        { newPassword: password, refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Password has been reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      console.error('Reset Password Error:', error.response?.data || error.message);
      setMessage('Error: Unable to reset password.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {(!accessToken || !refreshToken) ? (
        // Forgot Password Form
        <form
          onSubmit={handleForgotPassword}
          style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          {message && (
            <p style={{ marginTop: '10px', textAlign: 'center', color: message.includes('Error') ? 'red' : 'green' }}>
              {message}
            </p>
          )}
        </form>
      ) : (
        // Reset Password Form
        <form
          onSubmit={handleResetPassword}
          style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {message && (
            <p style={{ marginTop: '10px', textAlign: 'center', color: message.includes('Error') ? 'red' : 'green' }}>
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default ForgotResetPassword;
