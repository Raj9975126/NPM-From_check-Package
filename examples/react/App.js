// =============================================
//  FormCheck JS — React Example
//  Registration Form with live validation
//
//  Setup (Create React App):
//    npx create-react-app my-app
//    cd my-app
//    npm install formcheck-js
//    Replace src/App.js with this file
//    npm start
// =============================================

import { useState } from "react";
import { validateForm, passwordStrength } from "formcheck-js";

// Validation schema
const schema = {
  name: {
    type: "string",
    required: true,
    min: 2,
    max: 50,
    label: "Full Name",
  },
  email: {
    type: "email",
    required: true,
    label: "Email Address",
  },
  phone: {
    type: "phone",
    required: true,
    label: "Phone Number",
  },
  username: {
    type: "username",
    required: true,
    options: { minLength: 3, maxLength: 20 },
    label: "Username",
  },
  password: {
    type: "password",
    required: true,
    options: { minLength: 8 },
    label: "Password",
  },
  confirmPassword: {
    type: "match",
    matchField: "password",
    required: true,
    label: "Confirm Password",
  },
  age: {
    type: "number",
    required: true,
    options: { min: 18, max: 120, integer: true },
    label: "Age",
  },
  website: {
    type: "url",
    required: false,
    label: "Website",
  },
};

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
    website: "",
  });

  const [errors, setErrors]     = useState({});
  const [success, setSuccess]   = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: "", percent: 0 });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live password strength
    if (name === "password") {
      setStrength(passwordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateForm(formData, schema);

    if (!result.isValid) {
      setErrors(result.errors);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
    }
  };

  // Strength bar color
  const strengthColors = ["#ccc", "#e53e3e", "#ed8936", "#ecc94b", "#48bb78", "#38a169"];
  const strengthColor  = strengthColors[strength.score];

  return (
    <div className="app">
      <div className="card">
        <h1>📋 Register</h1>
        <p className="subtitle">Create your account</p>

        {success && (
          <div className="success-banner">
            ✅ Account created successfully! Welcome aboard.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="john_doe"
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              className={errors.password ? "input-error" : ""}
            />
            {/* Strength Bar */}
            {formData.password && (
              <div className="strength-wrapper">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{ width: strength.percent + "%", background: strengthColor }}
                  />
                </div>
                <span className="strength-label" style={{ color: strengthColor }}>
                  Strength: {strength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          {/* Age */}
          <div className="form-group">
            <label>Age</label>
            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Must be 18+"
              className={errors.age ? "input-error" : ""}
            />
            {errors.age && <span className="error">{errors.age}</span>}
          </div>

          {/* Website (Optional) */}
          <div className="form-group">
            <label>Website <span className="optional">(optional)</span></label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yoursite.com"
              className={errors.website ? "input-error" : ""}
            />
            {errors.website && <span className="error">{errors.website}</span>}
          </div>

          <button type="submit" className="btn">
            Create Account
          </button>

        </form>
      </div>
    </div>
  );
}
