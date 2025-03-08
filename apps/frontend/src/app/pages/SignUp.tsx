import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp: React.FC = () => {
  const navigate = useNavigate(); 

  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

   // State for validation errors
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field icons
  const UserIcon = User;
  const EmailIcon = Mail;
  const LockIcon = Lock;

  // Email validation function
  const validateEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    return "";
  };

  // Password validation function
  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters, include one uppercase letter, one number, and one special character.";
    }
    return "";
  };

  // Handle input change and validate email on-the-fly
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      const emailError = await validateEmail(value);
      setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    let newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    // Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      valid = false;
    }

    // Email Validation
    const emailError = await validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      valid = false;
    }

    // Password Validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      valid = false;
    }

    // Confirm Password Validation (Matches Password)
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return; // Stop submission if validation fails

    try {
        const response = await fetch("http://localhost:3000/api/v1/auth/signup", { // Send signup request to backend API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPass: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "User already exists.") { // Handle existing user error from backend
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "An account with this email already exists.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: data.error || "Sign up failed. Please try again.",
          }));
        }
      } else {
        alert(data.message); // Show success message
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: "An error occurred. Please try again later.", // Update the general error state to display a user-friendly message
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2A00B7] to-[#42006C]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png" // Originally used Wouessi logo locally for testing
            alt="Wouessi Logo"
            className="w-32 h-auto object-contain"
          />
        </div>
          
        <h2 className="text-2xl font-bold text-center text-[#2A00B7] mb-4">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:outline-none ${
                errors.fullName
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-purple-600"
              }`}
              required // Field cannot be empty
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative">
            <EmailIcon className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-purple-600"
              }`}
              required // Field entry must respect email format John@Doe.com
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <LockIcon className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                if (e.target.dataset.touched === "true") {
                  setFormData({ ...formData, password: "" }); // Reset password field if user leave and comes back to modify it
                  e.target.removeAttribute("data-touched");
                } else {
                  setFormData({ ...formData, password: e.target.value });
                }
              }}
              onFocus={(e) => { // Tracks whether the input field has been interacted with
                if (!formData.password) {
                  e.target.removeAttribute("data-touched");
                } else {
                  e.target.setAttribute("data-touched", "true");
                }
              }}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg bg-gray-100 focus:outline-none ${
                errors.password
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-purple-600"
              }`}
              required
            />
            <button
              type="button" // Ensures this button does NOT submit the form
              onClick={() => setShowPassword(!showPassword)} // Toggles password visibility
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            > 
              {showPassword ? <FaEyeSlash /> : <FaEye />} 
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <LockIcon className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showConfirmPassword ? "text" : "password"} // Toggle between visible text and hidden password
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => {
                if (e.target.dataset.touched === "true") {
                  setFormData({ ...formData, confirmPassword: "" }); // Reset password field if user leave and comes back to modify it
                  e.target.removeAttribute("data-touched");
                } else {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                }
              }}
              onFocus={(e) => { // Tracks whether the input field has been interacted with
                if (!formData.confirmPassword) {
                  e.target.removeAttribute("data-touched");
                } else {
                  e.target.setAttribute("data-touched", "true");
                }
              }}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg bg-gray-100 focus:outline-none ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-purple-600"
              }`}
              required
            />
            <button
              type="button" // Ensures this button does NOT submit the form
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggles password visibility
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Create Account Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit" // Submits the form when clicked
              className="w-full bg-[#2A00B7] text-white px-4 py-3 rounded-lg hover:bg-[#20008A] transition duration-200"
            >
              Create Account
            </button>
          </div>

          {/* General API Error Message (Displays for "User already exists.") */}
          {errors.general && (
            <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>
            )}

          {/* Already have an account? */}
          <div className="text-sm text-gray-600 text-left mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2A00B7] font-bold hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;