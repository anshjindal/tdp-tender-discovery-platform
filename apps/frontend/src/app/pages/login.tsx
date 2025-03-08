import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', data);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        console.log('Login successful', response.data);
        window.location.href = '/dashboard';
        
      }
    } catch (error) {
      console.error('Login failed', error);
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

        {/* Login Button */}
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Login
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
    </div>
  );
};

export default Login;