// =============================================
//  FormCheck JS — Plain HTML + CSS + JS Example
//  No framework needed. Works in any browser.
// =============================================

// FormCheck is loaded via <script> tag in index.html
// All functions are available as window.FormCheck or directly
const {
  isRequired,
  isEmail,
  isPassword,
  passwordStrength,
  isPhone,
  isURL,
  isUsername,
  isNumber,
  matches,
} = window; // loaded from dist/index.cjs.js via script tag

// ---- Helper: show/hide error messages ----
function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + "Error");
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) {
    inputEl.classList.remove("valid");
    inputEl.classList.add("invalid");
  }
}

function showSuccess(fieldId) {
  const errorEl = document.getElementById(fieldId + "Error");
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = "";
  if (inputEl) {
    inputEl.classList.remove("invalid");
    inputEl.classList.add("valid");
  }
}

// ---- Password strength meter (live) ----
document.getElementById("password").addEventListener("input", function () {
  const val = this.value;
  const strength = passwordStrength(val);

  const fill = document.getElementById("strengthFill");
  const label = document.getElementById("strengthLabel");

  // Color based on score
  const colors = ["#ccc", "#e53e3e", "#ed8936", "#ecc94b", "#48bb78", "#38a169"];
  fill.style.width = strength.percent + "%";
  fill.style.background = colors[strength.score];
  label.textContent = val ? "Strength: " + strength.label : "";
  label.style.color = colors[strength.score];
});

// ---- Full form validation on submit ----
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name     = document.getElementById("name").value;
  const email    = document.getElementById("email").value;
  const phone    = document.getElementById("phone").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirm  = document.getElementById("confirmPassword").value;
  const age      = document.getElementById("age").value;
  const website  = document.getElementById("website").value;

  let allValid = true;

  // Validate Full Name
  const nameCheck = isRequired(name, "Full Name");
  if (!nameCheck.valid) { showError("name", nameCheck.message); allValid = false; }
  else { showSuccess("name"); }

  // Validate Email
  const emailCheck = isEmail(email, "Email");
  if (!emailCheck.valid) { showError("email", emailCheck.message); allValid = false; }
  else { showSuccess("email"); }

  // Validate Phone
  const phoneCheck = isPhone(phone, {}, "Phone");
  if (!phoneCheck.valid) { showError("phone", phoneCheck.message); allValid = false; }
  else { showSuccess("phone"); }

  // Validate Username
  const usernameCheck = isUsername(username, { minLength: 3, maxLength: 20 }, "Username");
  if (!usernameCheck.valid) { showError("username", usernameCheck.message); allValid = false; }
  else { showSuccess("username"); }

  // Validate Password
  const passwordCheck = isPassword(password, { minLength: 8 }, "Password");
  if (!passwordCheck.valid) { showError("password", passwordCheck.message); allValid = false; }
  else { showSuccess("password"); }

  // Validate Confirm Password
  const confirmCheck = matches(confirm, password, "Confirm Password", "Password");
  if (!confirmCheck.valid) { showError("confirmPassword", confirmCheck.message); allValid = false; }
  else { showSuccess("confirmPassword"); }

  // Validate Age
  const ageCheck = isNumber(age, { min: 18, max: 120, integer: true }, "Age");
  if (!ageCheck.valid) { showError("age", ageCheck.message); allValid = false; }
  else { showSuccess("age"); }

  // Validate Website (optional — skip if empty)
  if (website.trim() !== "") {
    const websiteCheck = isURL(website, "Website");
    if (!websiteCheck.valid) { showError("website", websiteCheck.message); allValid = false; }
    else { showSuccess("website"); }
  } else {
    showSuccess("website");
  }

  // If all fields valid — show success
  if (allValid) {
    document.getElementById("successMsg").classList.add("show");
    setTimeout(() => {
      document.getElementById("successMsg").classList.remove("show");
    }, 4000);
  }
});
