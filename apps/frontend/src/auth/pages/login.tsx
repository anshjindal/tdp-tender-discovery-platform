import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../components/AuthContext';
import {loginAPI} from '../../api/api';

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false); // Track login state

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true); // Start loading
    
    try {
      const res = await loginAPI(data.email, data.password);
      console.log("Login response:", res);
      
      if (res.data && res.data.access_token) {
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.data.user.email,
            name: res.data.user.name || res.data.user.email, 
          },
        });
  
        toast.success("Login Successful!");
        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error("Login failed. Invalid response from server.");
        console.error("Login failed - invalid response:", res);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.status === 403) {
        toast.error("Too many failed login attempts. Try again later.");
      } else {
        toast.error(error.response?.data?.message || "An error occurred during login.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

        {/* Email Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="Enter your email"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            placeholder="Enter your password"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {errors.password && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.password.message}</p>}
        </div>

        {/* Login Button with Loading State */}
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot Password Link */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link to="/forgot-reset-password" style={{ textDecoration: 'underline', color: '#007bff' }}>
            Forgot Password?
          </Link>
        </div>

        {/* Sign Up Link */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'underline', color: '#007bff' }}>
              Sign up
            </Link>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
