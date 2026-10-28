// ============================================================
//  FormCheck — Core Validation Functions
//  Zero-dependency form validation for JS / Node / React
// ============================================================

// --------------- REGEX PATTERNS ---------------

const PATTERNS = {
  // RFC 5322 simplified — covers 99.9 % of real-world emails
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/,

  // International phone: optional +, then 7-15 digits (spaces / dashes / dots / parens allowed)
  phone: /^\+?[\d\s\-().]{7,20}$/,

  // Strict digits-only phone (no formatting)
  phoneStrict: /^\+?\d{7,15}$/,

  // URL with protocol
  url: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,63}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,

  // Alphanumeric + underscores/hyphens
  username: /^[a-zA-Z0-9_-]+$/,

  // Only letters (including Unicode)
  alpha: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+$/,

  // Only digits
  numeric: /^\d+$/,

  // Letters and digits
  alphanumeric: /^[a-zA-Z0-9]+$/,

  // Indian PAN card
  panCard: /^[A-Z]{5}\d{4}[A-Z]$/,

  // Indian Aadhaar (12 digits, optionally grouped by 4)
  aadhaar: /^\d{4}\s?\d{4}\s?\d{4}$/,

  // US ZIP code (5 digits or 5+4)
  zipUS: /^\d{5}(-\d{4})?$/,

  // Indian PIN code (6 digits, first digit 1-9)
  pinCodeIndia: /^[1-9]\d{5}$/,

  // IPv4
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,

  // Hex color (#RGB or #RRGGBB)
  hexColor: /^#(?:[0-9a-fA-F]{3}){1,2}$/,

  // Date in YYYY-MM-DD
  dateISO: /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,

  // Credit card (basic Luhn-eligible lengths 13-19 digits)
  creditCard: /^\d{13,19}$/,

  // Slug (lowercase, digits, hyphens)
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// --------------- HELPER: Build a result object ---------------

function result(valid, message) {
  return { valid, message };
}

// ============================================================
//  INDIVIDUAL VALIDATORS
//  Each returns { valid: boolean, message: string }
// ============================================================

/**
 * Check if a value is not empty (null, undefined, empty string, whitespace-only).
 */
function isRequired(value, fieldName = "This field") {
  if (value === null || value === undefined || String(value).trim() === "") {
    return result(false, `${fieldName} is required.`);
  }
  return result(true, `${fieldName} looks good.`);
}

/**
 * Validate an email address.
 */
function isEmail(value, fieldName = "Email") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.email.test(String(value).trim())) {
    return result(false, `${fieldName} is not a valid email address.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate password strength.
 *
 * Options (all optional):
 *  - minLength        (default 8)
 *  - maxLength        (default 128)
 *  - requireUppercase (default true)
 *  - requireLowercase (default true)
 *  - requireNumber    (default true)
 *  - requireSpecial   (default true)
 *  - specialChars     (default "!@#$%^&*()_+-=[]{}|;':\",./<>?`~")
 */
function isPassword(value, options = {}, fieldName = "Password") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = true,
    specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~",
  } = options;

  const val = String(value);
  const errors = [];

  if (val.length < minLength) errors.push(`at least ${minLength} characters`);
  if (val.length > maxLength) errors.push(`at most ${maxLength} characters`);
  if (requireUppercase && !/[A-Z]/.test(val)) errors.push("an uppercase letter");
  if (requireLowercase && !/[a-z]/.test(val)) errors.push("a lowercase letter");
  if (requireNumber && !/\d/.test(val)) errors.push("a number");
  if (requireSpecial) {
    const escaped = specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    if (!new RegExp(`[${escaped}]`).test(val)) {
      errors.push("a special character");
    }
  }

  if (errors.length > 0) {
    return result(false, `${fieldName} must contain ${errors.join(", ")}.`);
  }
  return result(true, `${fieldName} is strong.`);
}

/**
 * Return a password strength score (0-5) and label.
 */
function passwordStrength(value) {
  if (!value || String(value).trim() === "") {
    return { score: 0, label: "Empty", percent: 0 };
  }
  const val = String(value);
  let score = 0;

  if (val.length >= 8) score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^a-zA-Z0-9]/.test(val)) score++;

  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  return {
    score,
    label: labels[score],
    percent: Math.round((score / 5) * 100),
  };
}

/**
 * Validate a phone number (international-friendly).
 */
function isPhone(value, options = {}, fieldName = "Phone number") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  const { strict = false } = options;
  const pattern = strict ? PATTERNS.phoneStrict : PATTERNS.phone;

  if (!pattern.test(String(value).trim())) {
    return result(false, `${fieldName} is not a valid phone number.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate a URL.
 */
function isURL(value, fieldName = "URL") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.url.test(String(value).trim())) {
    return result(false, `${fieldName} is not a valid URL.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate a username (alphanumeric, underscores, hyphens).
 */
function isUsername(value, options = {}, fieldName = "Username") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  const { minLength = 3, maxLength = 30 } = options;
  const val = String(value).trim();

  if (val.length < minLength) {
    return result(false, `${fieldName} must be at least ${minLength} characters.`);
  }
  if (val.length > maxLength) {
    return result(false, `${fieldName} must be at most ${maxLength} characters.`);
  }
  if (!PATTERNS.username.test(val)) {
    return result(
      false,
      `${fieldName} can only contain letters, numbers, underscores, and hyphens.`
    );
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate minimum length.
 */
function minLength(value, min, fieldName = "This field") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (String(value).length < min) {
    return result(false, `${fieldName} must be at least ${min} characters.`);
  }
  return result(true, `${fieldName} meets the minimum length.`);
}

/**
 * Validate maximum length.
 */
function maxLength(value, max, fieldName = "This field") {
  if (value !== null && value !== undefined && String(value).length > max) {
    return result(false, `${fieldName} must be at most ${max} characters.`);
  }
  return result(true, `${fieldName} is within the allowed length.`);
}

/**
 * Validate that a value is a number within an optional range.
 */
function isNumber(value, options = {}, fieldName = "This field") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  const num = Number(value);
  if (isNaN(num)) {
    return result(false, `${fieldName} must be a valid number.`);
  }

  const { min, max, integer = false } = options;

  if (integer && !Number.isInteger(num)) {
    return result(false, `${fieldName} must be a whole number.`);
  }
  if (min !== undefined && num < min) {
    return result(false, `${fieldName} must be at least ${min}.`);
  }
  if (max !== undefined && num > max) {
    return result(false, `${fieldName} must be at most ${max}.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate that a value is within a list of allowed values.
 */
function isOneOf(value, allowedValues, fieldName = "This field") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!Array.isArray(allowedValues) || !allowedValues.includes(value)) {
    return result(
      false,
      `${fieldName} must be one of: ${allowedValues.join(", ")}.`
    );
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate that two values match (e.g., password confirmation).
 */
function matches(value, compareValue, fieldName = "This field", compareName = "the other field") {
  if (value !== compareValue) {
    return result(false, `${fieldName} does not match ${compareName}.`);
  }
  return result(true, `${fieldName} matches.`);
}

/**
 * Validate a date string (YYYY-MM-DD) and optionally check ranges.
 */
function isDate(value, options = {}, fieldName = "Date") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  const val = String(value).trim();
  if (!PATTERNS.dateISO.test(val)) {
    return result(false, `${fieldName} must be in YYYY-MM-DD format.`);
  }

  const date = new Date(val + "T00:00:00");
  if (isNaN(date.getTime())) {
    return result(false, `${fieldName} is not a valid date.`);
  }

  // Verify the parsed date matches input (catches things like Feb 30)
  const [y, m, d] = val.split("-").map(Number);
  if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) {
    return result(false, `${fieldName} is not a valid date.`);
  }

  const { minDate, maxDate } = options;
  if (minDate && date < new Date(minDate + "T00:00:00")) {
    return result(false, `${fieldName} must be on or after ${minDate}.`);
  }
  if (maxDate && date > new Date(maxDate + "T00:00:00")) {
    return result(false, `${fieldName} must be on or before ${maxDate}.`);
  }

  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate age from a birth date (YYYY-MM-DD).
 */
function isAge(value, options = {}, fieldName = "Age") {
  const dateCheck = isDate(value, {}, fieldName);
  if (!dateCheck.valid) return dateCheck;

  const { min = 0, max = 150 } = options;
  const birth = new Date(String(value).trim() + "T00:00:00");
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < min) {
    return result(false, `You must be at least ${min} years old.`);
  }
  if (age > max) {
    return result(false, `Age cannot be more than ${max} years.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate against a custom regex pattern.
 */
function matchesPattern(value, pattern, fieldName = "This field", errorMsg) {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  if (!regex.test(String(value).trim())) {
    return result(false, errorMsg || `${fieldName} format is invalid.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate a credit card number using the Luhn algorithm.
 */
function isCreditCard(value, fieldName = "Card number") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  const val = String(value).replace(/[\s-]/g, "");
  if (!PATTERNS.creditCard.test(val)) {
    return result(false, `${fieldName} must be 13-19 digits.`);
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  for (let i = val.length - 1; i >= 0; i--) {
    let digit = parseInt(val[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return result(false, `${fieldName} is not a valid card number.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate an Indian PAN card number.
 */
function isPanCard(value, fieldName = "PAN") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.panCard.test(String(value).trim().toUpperCase())) {
    return result(false, `${fieldName} is not a valid PAN card number.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate an Indian Aadhaar number.
 */
function isAadhaar(value, fieldName = "Aadhaar") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.aadhaar.test(String(value).trim())) {
    return result(false, `${fieldName} is not a valid Aadhaar number.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate a US ZIP code.
 */
function isZipCode(value, fieldName = "ZIP code") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.zipUS.test(String(value).trim())) {
    return result(false, `${fieldName} is not a valid ZIP code.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate an Indian PIN code.
 */
function isPinCode(value, fieldName = "PIN code") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.pinCodeIndia.test(String(value).trim())) {
    return result(false, `${fieldName} is not a valid PIN code.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate an IPv4 address.
 */
function isIPv4(value, fieldName = "IP address") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.ipv4.test(String(value).trim())) {
    return result(false, `${fieldName} is not a valid IPv4 address.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate a hex color code.
 */
function isHexColor(value, fieldName = "Color") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.hexColor.test(String(value).trim())) {
    return result(false, `${fieldName} is not a valid hex color.`);
  }
  return result(true, `${fieldName} is valid.`);
}

/**
 * Validate that value contains no HTML/script tags (XSS prevention).
 */
function noHTML(value, fieldName = "This field") {
  if (value === null || value === undefined) return result(true, `${fieldName} is clean.`);
  if (/<[^>]*>/g.test(String(value))) {
    return result(false, `${fieldName} must not contain HTML tags.`);
  }
  return result(true, `${fieldName} is clean.`);
}

/**
 * Validate a slug (lowercase-letters, digits, hyphens).
 */
function isSlug(value, fieldName = "Slug") {
  const req = isRequired(value, fieldName);
  if (!req.valid) return req;

  if (!PATTERNS.slug.test(String(value).trim())) {
    return result(
      false,
      `${fieldName} can only contain lowercase letters, numbers, and hyphens.`
    );
  }
  return result(true, `${fieldName} is valid.`);
}

// ============================================================
//  SCHEMA-BASED VALIDATION
//  Validate a whole form at once with a rules schema.
// ============================================================

/**
 * Validate an entire form object against a schema.
 *
 * Schema format:
 *  {
 *    email:    { type: 'email', required: true, label: 'Email Address' },
 *    password: { type: 'password', required: true, options: { minLength: 10 } },
 *    age:      { type: 'number', options: { min: 18, max: 100 } },
 *    name:     { type: 'string', required: true, min: 2, max: 50 },
 *    confirm:  { type: 'match', matchField: 'password', label: 'Confirm Password' },
 *    website:  { type: 'url' },
 *    phone:    { type: 'phone' },
 *    username: { type: 'username', options: { minLength: 3, maxLength: 20 } },
 *    bio:      { type: 'string', max: 500, noHTML: true },
 *    dob:      { type: 'date', options: { maxDate: '2010-01-01' } },
 *    ageCheck: { type: 'age', options: { min: 18 } },
 *    terms:    { type: 'oneOf', allowed: [true, 'yes'], label: 'Terms' },
 *    card:     { type: 'creditCard' },
 *    pan:      { type: 'pan' },
 *    aadhaar:  { type: 'aadhaar' },
 *    zip:      { type: 'zip' },
 *    pin:      { type: 'pinCode' },
 *    ip:       { type: 'ipv4' },
 *    color:    { type: 'hexColor' },
 *    slug:     { type: 'slug' },
 *    custom:   { type: 'pattern', pattern: /^[A-Z]{3}-\d{4}$/, errorMessage: 'Invalid code' },
 *  }
 */
function validateForm(formData, schema) {
  const errors = {};
  const results = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];
    const label = rules.label || field;
    let fieldResult;

    // --- Required check ---
    if (rules.required) {
      const req = isRequired(value, label);
      if (!req.valid) {
        errors[field] = req.message;
        results[field] = req;
        isValid = false;
        continue;
      }
    } else if (value === null || value === undefined || String(value).trim() === "") {
      // Not required and empty → skip further checks
      results[field] = result(true, `${label} is optional and was left empty.`);
      continue;
    }

    // --- Type-specific validation ---
    switch (rules.type) {
      case "email":
        fieldResult = isEmail(value, label);
        break;

      case "password":
        fieldResult = isPassword(value, rules.options || {}, label);
        break;

      case "phone":
        fieldResult = isPhone(value, rules.options || {}, label);
        break;

      case "url":
        fieldResult = isURL(value, label);
        break;

      case "username":
        fieldResult = isUsername(value, rules.options || {}, label);
        break;

      case "number":
        fieldResult = isNumber(value, rules.options || {}, label);
        break;

      case "date":
        fieldResult = isDate(value, rules.options || {}, label);
        break;

      case "age":
        fieldResult = isAge(value, rules.options || {}, label);
        break;

      case "match":
        fieldResult = matches(value, formData[rules.matchField], label, rules.matchLabel || rules.matchField);
        break;

      case "oneOf":
        fieldResult = isOneOf(value, rules.allowed || [], label);
        break;

      case "creditCard":
        fieldResult = isCreditCard(value, label);
        break;

      case "pan":
        fieldResult = isPanCard(value, label);
        break;

      case "aadhaar":
        fieldResult = isAadhaar(value, label);
        break;

      case "zip":
        fieldResult = isZipCode(value, label);
        break;

      case "pinCode":
        fieldResult = isPinCode(value, label);
        break;

      case "ipv4":
        fieldResult = isIPv4(value, label);
        break;

      case "hexColor":
        fieldResult = isHexColor(value, label);
        break;

      case "slug":
        fieldResult = isSlug(value, label);
        break;

      case "pattern":
        fieldResult = matchesPattern(value, rules.pattern, label, rules.errorMessage);
        break;

      case "string":
      default:
        fieldResult = result(true, `${label} is valid.`);
        break;
    }

    // --- Additional constraints for "string" or any type ---
    if (fieldResult.valid && rules.min) {
      fieldResult = minLength(value, rules.min, label);
    }
    if (fieldResult.valid && rules.max) {
      fieldResult = maxLength(value, rules.max, label);
    }
    if (fieldResult.valid && rules.noHTML) {
      fieldResult = noHTML(value, label);
    }

    results[field] = fieldResult;
    if (!fieldResult.valid) {
      errors[field] = fieldResult.message;
      isValid = false;
    }
  }

  return { isValid, errors, results };
}

// ============================================================
//  EXPORTS
// ============================================================

module.exports = {
  // Individual validators
  isRequired,
  isEmail,
  isPassword,
  passwordStrength,
  isPhone,
  isURL,
  isUsername,
  minLength,
  maxLength,
  isNumber,
  isOneOf,
  matches,
  isDate,
  isAge,
  matchesPattern,
  isCreditCard,
  isPanCard,
  isAadhaar,
  isZipCode,
  isPinCode,
  isIPv4,
  isHexColor,
  noHTML,
  isSlug,

  // Schema-based validation
  validateForm,

  // Regex patterns (for advanced users)
  PATTERNS,
};
