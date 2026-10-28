# FormCheck JS

> 🛡️ A powerful, zero-dependency form validation library for **React**, **Node.js**, and **vanilla JavaScript**.

[![npm version](https://img.shields.io/npm/v/formcheck-js.svg)](https://www.npmjs.com/package/formcheck-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Stop writing the same validation logic over and over. **FormCheck** gives you **25+ ready-to-use validators** and a powerful **schema-based form validation** system — all in a tiny, dependency-free package.

---

## ✨ Features

- ✅ **25+ Built-in Validators** — email, password, phone, URL, credit card, and more
- 🔒 **Password Strength Meter** — score from 0-5 with human-readable labels
- 📋 **Schema-Based Validation** — validate entire forms with one function call
- 🌍 **International Support** — phone numbers, Indian PAN/Aadhaar, US ZIP codes, Indian PIN codes
- 🛡️ **XSS Protection** — built-in HTML/script tag detection
- 📦 **Zero Dependencies** — nothing else to install
- 🔀 **CJS + ESM** — works everywhere (Node.js, React, Next.js, Vite, Webpack)
- 📘 **TypeScript Ready** — full type definitions included
- ⚡ **Tiny & Fast** — under 10KB minified

---

## 📦 Installation

```bash
npm install formcheck-js
```

```bash
yarn add formcheck-js
```

```bash
pnpm add formcheck-js
```

---

## 🚀 Quick Start

### Individual Validators

```javascript
const { isEmail, isPassword, isPhone, isRequired } = require("formcheck-js");

// Check email
const email = isEmail("user@example.com");
console.log(email);
// { valid: true, message: "Email is valid." }

// Check password strength
const password = isPassword("MyP@ss123");
console.log(password);
// { valid: true, message: "Password is strong." }

// Check phone number
const phone = isPhone("+91 98765 43210");
console.log(phone);
// { valid: true, message: "Phone number is valid." }

// Check required field
const name = isRequired("", "Full Name");
console.log(name);
// { valid: false, message: "Full Name is required." }
```

### ES Module Import

```javascript
import { isEmail, isPassword, validateForm } from "formcheck-js";
```

---

## 📋 Schema-Based Form Validation

Validate an entire form with one function call. Perfect for registration forms, checkout pages, and more.

```javascript
const { validateForm } = require("formcheck-js");

// Define your validation rules
const schema = {
  email:    { type: "email",    required: true, label: "Email Address" },
  password: { type: "password", required: true, options: { minLength: 8 } },
  confirmPassword: {
    type: "match",
    matchField: "password",
    required: true,
    label: "Confirm Password",
  },
  username: { type: "username", required: true, options: { minLength: 3, maxLength: 20 } },
  phone:    { type: "phone",    required: false },
  website:  { type: "url",      required: false },
  age:      { type: "number",   required: true, options: { min: 18, max: 120 } },
  bio:      { type: "string",   max: 500, noHTML: true, label: "Bio" },
};

// Your form data
const formData = {
  email: "john@example.com",
  password: "MyStr0ng!Pass",
  confirmPassword: "MyStr0ng!Pass",
  username: "john_doe",
  phone: "+1 555-123-4567",
  website: "https://johndoe.com",
  age: 25,
  bio: "I love coding!",
};

const result = validateForm(formData, schema);

console.log(result.isValid);  // true
console.log(result.errors);   // {} (empty — no errors)
console.log(result.results);  // detailed result for each field
```

### When Validation Fails

```javascript
const badData = {
  email: "not-an-email",
  password: "weak",
  confirmPassword: "doesnt-match",
  username: "ab",
  age: 15,
  bio: '<script>alert("xss")</script>',
};

const result = validateForm(badData, schema);

console.log(result.isValid);  // false
console.log(result.errors);
// {
//   email: "Email Address is not a valid email address.",
//   password: "Password must contain at least 8 characters, an uppercase letter, a special character.",
//   confirmPassword: "Confirm Password does not match password.",
//   username: "username must be at least 3 characters.",
//   age: "age must be at least 18.",
//   bio: "Bio must not contain HTML tags."
// }
```

---

## 🔧 All Validators

### Core Validators

| Function | Description | Example |
|----------|-------------|---------|
| `isRequired(value, fieldName?)` | Checks for empty/null/undefined | `isRequired("", "Name")` |
| `isEmail(value, fieldName?)` | Validates email format | `isEmail("a@b.com")` |
| `isPassword(value, options?, fieldName?)` | Validates password strength | `isPassword("MyP@ss1")` |
| `passwordStrength(value)` | Returns strength score (0-5) | `passwordStrength("Test1!")` |
| `isPhone(value, options?, fieldName?)` | Validates phone number | `isPhone("+1 555-1234")` |
| `isURL(value, fieldName?)` | Validates URL format | `isURL("https://x.com")` |
| `isUsername(value, options?, fieldName?)` | Alphanumeric + _ - | `isUsername("user_1")` |

### String & Number Validators

| Function | Description | Example |
|----------|-------------|---------|
| `minLength(value, min, fieldName?)` | Minimum character count | `minLength("hi", 3)` |
| `maxLength(value, max, fieldName?)` | Maximum character count | `maxLength("hello", 10)` |
| `isNumber(value, options?, fieldName?)` | Number with range/integer check | `isNumber(42, { min: 1 })` |
| `isOneOf(value, allowed, fieldName?)` | Value in allowed list | `isOneOf("admin", ["admin","user"])` |
| `matches(value, compare, fieldName?)` | Two values match | `matches("abc", "abc")` |

### Date & Age Validators

| Function | Description | Example |
|----------|-------------|---------|
| `isDate(value, options?, fieldName?)` | YYYY-MM-DD with range check | `isDate("2024-06-15")` |
| `isAge(value, options?, fieldName?)` | Age from birth date | `isAge("2000-01-01", { min: 18 })` |

### Document & Identity Validators

| Function | Description | Example |
|----------|-------------|---------|
| `isCreditCard(value, fieldName?)` | Luhn algorithm validation | `isCreditCard("4111111111111111")` |
| `isPanCard(value, fieldName?)` | Indian PAN format | `isPanCard("ABCDE1234F")` |
| `isAadhaar(value, fieldName?)` | Indian Aadhaar (12 digits) | `isAadhaar("1234 5678 9012")` |
| `isZipCode(value, fieldName?)` | US ZIP code (5 or 5+4) | `isZipCode("90210")` |
| `isPinCode(value, fieldName?)` | Indian PIN code (6 digits) | `isPinCode("110001")` |

### Utility Validators

| Function | Description | Example |
|----------|-------------|---------|
| `isIPv4(value, fieldName?)` | IPv4 address format | `isIPv4("192.168.1.1")` |
| `isHexColor(value, fieldName?)` | Hex color (#RGB/#RRGGBB) | `isHexColor("#ff0000")` |
| `noHTML(value, fieldName?)` | Rejects HTML/script tags | `noHTML("<b>bold</b>")` |
| `isSlug(value, fieldName?)` | URL slug format | `isSlug("my-post-title")` |
| `matchesPattern(value, regex, fieldName?, errorMsg?)` | Custom regex | `matchesPattern("ABC-1234", /^[A-Z]{3}-\d{4}$/)` |

---

## ⚙️ Options Reference

### Password Options

```javascript
isPassword("MyPass123!", {
  minLength: 8,           // default: 8
  maxLength: 128,         // default: 128
  requireUppercase: true, // default: true
  requireLowercase: true, // default: true
  requireNumber: true,    // default: true
  requireSpecial: true,   // default: true
});
```

### Password Strength

```javascript
const strength = passwordStrength("MyStr0ng!Pass");
// {
//   score: 5,
//   label: "Very Strong",
//   percent: 100
// }

// Labels: "Empty" | "Very Weak" | "Weak" | "Fair" | "Good" | "Strong" | "Very Strong"
```

### Phone Options

```javascript
isPhone("+15551234567", { strict: true });  // digits only, no formatting
isPhone("+1 (555) 123-4567");              // allows formatting by default
```

### Number Options

```javascript
isNumber(42, {
  min: 1,           // minimum value
  max: 100,         // maximum value
  integer: true,    // must be a whole number
});
```

### Date Options

```javascript
isDate("2024-06-15", {
  minDate: "2020-01-01",  // earliest allowed date
  maxDate: "2030-12-31",  // latest allowed date
});
```

---

## ⚛️ React Example

```jsx
import { useState } from "react";
import { validateForm } from "formcheck-js";

const schema = {
  email:    { type: "email",    required: true, label: "Email" },
  password: { type: "password", required: true, label: "Password" },
  name:     { type: "string",   required: true, min: 2, max: 50, label: "Name" },
};

function RegistrationForm() {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateForm(formData, schema);

    if (result.isValid) {
      console.log("Form is valid! Submitting...", formData);
      setErrors({});
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="name" placeholder="Name" onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div>
        <input name="email" placeholder="Email" onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
```

---

## 🖥️ Node.js / Express Example

```javascript
const express = require("express");
const { validateForm } = require("formcheck-js");

const app = express();
app.use(express.json());

const registrationSchema = {
  email:    { type: "email",    required: true },
  password: { type: "password", required: true, options: { minLength: 8 } },
  username: { type: "username", required: true, options: { minLength: 3 } },
  phone:    { type: "phone",    required: true },
};

app.post("/api/register", (req, res) => {
  const result = validateForm(req.body, registrationSchema);

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      errors: result.errors,
    });
  }

  // Proceed with registration...
  res.json({ success: true, message: "Registration successful!" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## 🗂️ Schema Rule Types

Use these `type` values in your validation schema:

| Type | Description | Extra Fields |
|------|-------------|--------------|
| `"string"` | Basic string (with optional min/max/noHTML) | `min`, `max`, `noHTML` |
| `"email"` | Email address | — |
| `"password"` | Password with strength rules | `options: { minLength, requireUppercase, ... }` |
| `"phone"` | Phone number | `options: { strict }` |
| `"url"` | URL with protocol | — |
| `"username"` | Alphanumeric + underscores + hyphens | `options: { minLength, maxLength }` |
| `"number"` | Numeric value | `options: { min, max, integer }` |
| `"date"` | Date in YYYY-MM-DD | `options: { minDate, maxDate }` |
| `"age"` | Age calculated from birth date | `options: { min, max }` |
| `"match"` | Must match another field | `matchField`, `matchLabel` |
| `"oneOf"` | Must be in allowed list | `allowed: [...]` |
| `"creditCard"` | Luhn-validated card number | — |
| `"pan"` | Indian PAN card | — |
| `"aadhaar"` | Indian Aadhaar number | — |
| `"zip"` | US ZIP code | — |
| `"pinCode"` | Indian PIN code | — |
| `"ipv4"` | IPv4 address | — |
| `"hexColor"` | Hex color code | — |
| `"slug"` | URL slug | — |
| `"pattern"` | Custom regex | `pattern`, `errorMessage` |

---

## 📤 Return Format

Every individual validator returns:

```javascript
{
  valid: true | false,
  message: "Human-readable message"
}
```

`validateForm()` returns:

```javascript
{
  isValid: true | false,
  errors: {
    fieldName: "Error message",  // only for invalid fields
  },
  results: {
    fieldName: { valid: true | false, message: "..." },  // for ALL fields
  }
}
```

---

## 📘 TypeScript

Full type definitions are included. Just import and go:

```typescript
import { isEmail, validateForm, type ValidationResult, type FormSchema } from "formcheck-js";

const result: ValidationResult = isEmail("test@example.com");

const schema: FormSchema = {
  email: { type: "email", required: true },
};
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push to branch (`git push origin feature/awesome`)
5. Open a Pull Request

---

## 📄 License

[MIT](./LICENSE) — use it freely in personal and commercial projects.

---

## 🙋 FAQ

**Q: Does it work with React / Next.js / Vue?**
A: Yes! It's framework-agnostic pure JavaScript. Works everywhere.

**Q: Does it have any dependencies?**
A: Zero. Nothing else to install.

**Q: Can I use it on the server (Node.js)?**
A: Absolutely. Works in Node.js, Express, Fastify, and any server framework.

**Q: Is it TypeScript compatible?**
A: Yes — full `.d.ts` type definitions are included.

---

Made with ❤️ for developers who hate writing validation logic from scratch.
