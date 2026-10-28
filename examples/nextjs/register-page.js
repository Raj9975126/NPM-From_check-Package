// =============================================
//  FormCheck JS — Next.js Example
//  Registration Page with Server + Client validation
//
//  Setup:
//    npx create-next-app@latest my-app
//    cd my-app
//    npm install formcheck-js
//    Copy this file to: app/register/page.js  (Next.js 13+ App Router)
//    OR pages/register.js  (Next.js Pages Router)
//    npm run dev
// =============================================

"use client"; // Required for Next.js App Router (client-side interactivity)

import { useState } from "react";
import { validateForm, passwordStrength } from "formcheck-js";

// Validation Schema
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
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
  });

  const [errors, setErrors]     = useState({});
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: "", percent: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setStrength(passwordStrength(value));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation first
    const result = validateForm(formData, schema);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    // Then send to Next.js API route
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setErrors({});
        setSuccess(true);
      } else {
        setErrors(data.errors || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ["#ccc", "#e53e3e", "#ed8936", "#ecc94b", "#48bb78", "#38a169"];
  const strengthColor  = strengthColors[strength.score];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📋 Register</h1>
        <p style={styles.subtitle}>Create your account</p>

        {success && (
          <div style={styles.successBanner}>
            ✅ Account created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {[
            { name: "name",            label: "Full Name",       type: "text",     placeholder: "Enter your name" },
            { name: "email",           label: "Email Address",   type: "email",    placeholder: "you@example.com" },
            { name: "phone",           label: "Phone Number",    type: "tel",      placeholder: "+91 98765 43210" },
            { name: "username",        label: "Username",        type: "text",     placeholder: "john_doe" },
            { name: "age",             label: "Age (18+)",       type: "number",   placeholder: "e.g. 25" },
          ].map((field) => (
            <div key={field.name} style={styles.formGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={{
                  ...styles.input,
                  borderColor: errors[field.name] ? "#e53e3e" : "#ddd",
                }}
              />
              {errors[field.name] && (
                <span style={styles.error}>{errors[field.name]}</span>
              )}
            </div>
          ))}

          {/* Password with strength meter */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              style={{
                ...styles.input,
                borderColor: errors.password ? "#e53e3e" : "#ddd",
              }}
            />
            {formData.password && (
              <div style={{ marginTop: 8 }}>
                <div style={styles.strengthBar}>
                  <div style={{ ...styles.strengthFill, width: strength.percent + "%", background: strengthColor }} />
                </div>
                <span style={{ ...styles.strengthLabel, color: strengthColor }}>
                  Strength: {strength.label}
                </span>
              </div>
            )}
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              style={{
                ...styles.input,
                borderColor: errors.confirmPassword ? "#e53e3e" : "#ddd",
              }}
            />
            {errors.confirmPassword && (
              <span style={styles.error}>{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>
      </div>
    </div>
  );
}

// Inline styles (no CSS file needed)
const styles = {
  page: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px 36px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "480px",
  },
  heading: { fontSize: "26px", color: "#1a1a2e", marginBottom: "6px" },
  subtitle: { color: "#888", fontSize: "14px", marginBottom: "28px" },
  formGroup: { marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#444", marginBottom: "6px" },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#333",
    outline: "none",
    background: "#fafafa",
    boxSizing: "border-box",
  },
  error: { display: "block", fontSize: "12px", color: "#e53e3e", marginTop: "5px" },
  strengthBar: { height: "5px", background: "#eee", borderRadius: "10px", overflow: "hidden" },
  strengthFill: { height: "100%", borderRadius: "10px", transition: "width 0.3s, background 0.3s" },
  strengthLabel: { fontSize: "11px", fontWeight: 600, display: "block", marginTop: "4px" },
  btn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
  successBanner: {
    background: "#f0fff4",
    border: "1.5px solid #c3e6cb",
    color: "#28a745",
    fontSize: "14px",
    fontWeight: 600,
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },
};
