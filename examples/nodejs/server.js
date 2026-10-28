// =============================================
//  FormCheck JS — Node.js + Express Example
//  A real registration API server
// =============================================
//
//  Setup:
//    npm install express
//    node server.js
//
//  Test:
//    POST http://localhost:3000/api/register

const express = require("express");
const path    = require("path");

// Load FormCheck from local dist (after publish: require("formcheck-js"))
const {
  validateForm,
  isEmail,
  isPassword,
  isPhone,
  isUsername,
} = require("../../dist/index.cjs.js");

const app  = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================
//  Validation Schema
// =============================================
const registerSchema = {
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
    label: "Email",
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

// =============================================
//  Routes
// =============================================

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "FormCheck JS — Node.js Example Server",
    routes: {
      "POST /api/register": "Register a new user",
      "POST /api/login":    "Login validation",
      "POST /api/contact":  "Contact form validation",
    },
  });
});

// Register route
app.post("/api/register", (req, res) => {
  const formData = req.body;

  // Validate entire form at once
  const result = validateForm(formData, registerSchema);

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please fix the errors.",
      errors: result.errors,
    });
  }

  // Form is valid — here you would save to database
  res.status(201).json({
    success: true,
    message: `Welcome, ${formData.name}! Your account has been created.`,
    user: {
      name:     formData.name,
      email:    formData.email,
      username: formData.username,
    },
  });
});

// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const emailCheck    = isEmail(email, "Email");
  const passwordCheck = isPassword(password, { minLength: 8 }, "Password");

  if (!emailCheck.valid) {
    return res.status(400).json({ success: false, error: emailCheck.message });
  }
  if (!passwordCheck.valid) {
    return res.status(400).json({ success: false, error: passwordCheck.message });
  }

  // Validation passed — check DB here
  res.json({ success: true, message: "Login successful!" });
});

// Contact form route
app.post("/api/contact", (req, res) => {
  const contactSchema = {
    name:    { type: "string",  required: true, min: 2, label: "Name" },
    email:   { type: "email",   required: true, label: "Email" },
    phone:   { type: "phone",   required: false, label: "Phone" },
    message: { type: "string",  required: true, min: 10, max: 1000, noHTML: true, label: "Message" },
  };

  const result = validateForm(req.body, contactSchema);

  if (!result.isValid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }

  res.json({ success: true, message: "Message received! We will contact you soon." });
});

// =============================================
//  Start Server
// =============================================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/api/register`);
  console.log(`   POST http://localhost:${PORT}/api/login`);
  console.log(`   POST http://localhost:${PORT}/api/contact`);
});
