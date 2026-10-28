// ============================================================
//  FormCheck — Comprehensive Test Suite
//  Uses Node.js built-in test runner (node --test)
// ============================================================

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
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
  validateForm,
} = require("../src/validators");

// =============== isRequired ===============

describe("isRequired", () => {
  it("fails on null", () => {
    assert.equal(isRequired(null).valid, false);
  });
  it("fails on undefined", () => {
    assert.equal(isRequired(undefined).valid, false);
  });
  it("fails on empty string", () => {
    assert.equal(isRequired("").valid, false);
  });
  it("fails on whitespace", () => {
    assert.equal(isRequired("   ").valid, false);
  });
  it("passes on valid string", () => {
    assert.equal(isRequired("hello").valid, true);
  });
  it("passes on number 0", () => {
    assert.equal(isRequired(0).valid, true);
  });
  it("uses custom field name in message", () => {
    const r = isRequired("", "Full Name");
    assert.ok(r.message.includes("Full Name"));
  });
});

// =============== isEmail ===============

describe("isEmail", () => {
  const valid = [
    "user@example.com",
    "name.surname@company.co.uk",
    "user+tag@gmail.com",
    "test123@sub.domain.org",
    "a@b.co",
  ];
  const invalid = [
    "",
    "plaintext",
    "@no-user.com",
    "user@",
    "user@.com",
    "user@ space.com",
    "user@domain",
    "user@domain..com",
  ];

  valid.forEach((email) => {
    it(`accepts ${email}`, () => {
      assert.equal(isEmail(email).valid, true);
    });
  });

  invalid.forEach((email) => {
    it(`rejects "${email}"`, () => {
      assert.equal(isEmail(email).valid, false);
    });
  });
});

// =============== isPassword ===============

describe("isPassword", () => {
  it("passes with strong password", () => {
    assert.equal(isPassword("MyP@ssw0rd!").valid, true);
  });
  it("fails when too short", () => {
    assert.equal(isPassword("Ab1!").valid, false);
  });
  it("fails without uppercase", () => {
    assert.equal(isPassword("myp@ssw0rd!").valid, false);
  });
  it("fails without lowercase", () => {
    assert.equal(isPassword("MYP@SSW0RD!").valid, false);
  });
  it("fails without number", () => {
    assert.equal(isPassword("MyP@ssword!").valid, false);
  });
  it("fails without special char", () => {
    assert.equal(isPassword("MyPassw0rd").valid, false);
  });
  it("respects custom minLength", () => {
    assert.equal(isPassword("Ab1!Ab1!", { minLength: 12 }).valid, false);
  });
  it("allows disabling uppercase requirement", () => {
    assert.equal(
      isPassword("myp@ssw0rd!", { requireUppercase: false }).valid,
      true
    );
  });
  it("fails on empty", () => {
    assert.equal(isPassword("").valid, false);
  });
});

// =============== passwordStrength ===============

describe("passwordStrength", () => {
  it("returns 0 for empty", () => {
    assert.equal(passwordStrength("").score, 0);
  });
  it("returns low score for weak password", () => {
    const s = passwordStrength("abc");
    assert.ok(s.score <= 1);
  });
  it("returns high score for strong password", () => {
    const s = passwordStrength("MyStr0ng!Pass#2024");
    assert.ok(s.score >= 4);
  });
  it("has percent field", () => {
    const s = passwordStrength("Test");
    assert.ok(typeof s.percent === "number");
  });
});

// =============== isPhone ===============

describe("isPhone", () => {
  it("accepts international format", () => {
    assert.equal(isPhone("+1 (555) 123-4567").valid, true);
  });
  it("accepts Indian number", () => {
    assert.equal(isPhone("+91 98765 43210").valid, true);
  });
  it("accepts plain digits", () => {
    assert.equal(isPhone("5551234567").valid, true);
  });
  it("rejects too short", () => {
    assert.equal(isPhone("12345").valid, false);
  });
  it("rejects letters", () => {
    assert.equal(isPhone("abcdefghij").valid, false);
  });
  it("strict mode rejects formatting", () => {
    assert.equal(isPhone("(555) 123-4567", { strict: true }).valid, false);
  });
  it("strict mode accepts plain digits", () => {
    assert.equal(isPhone("+15551234567", { strict: true }).valid, true);
  });
});

// =============== isURL ===============

describe("isURL", () => {
  it("accepts http URL", () => {
    assert.equal(isURL("http://example.com").valid, true);
  });
  it("accepts https URL", () => {
    assert.equal(isURL("https://www.google.com/search?q=test").valid, true);
  });
  it("rejects no protocol", () => {
    assert.equal(isURL("example.com").valid, false);
  });
  it("rejects random string", () => {
    assert.equal(isURL("not a url").valid, false);
  });
});

// =============== isUsername ===============

describe("isUsername", () => {
  it("accepts valid username", () => {
    assert.equal(isUsername("john_doe-99").valid, true);
  });
  it("rejects too short", () => {
    assert.equal(isUsername("ab").valid, false);
  });
  it("rejects special chars", () => {
    assert.equal(isUsername("user@name!").valid, false);
  });
  it("respects custom minLength", () => {
    assert.equal(isUsername("ab", { minLength: 2 }).valid, true);
  });
  it("respects custom maxLength", () => {
    assert.equal(
      isUsername("a".repeat(31), { maxLength: 30 }).valid,
      false
    );
  });
});

// =============== minLength / maxLength ===============

describe("minLength", () => {
  it("passes when long enough", () => {
    assert.equal(minLength("hello", 3).valid, true);
  });
  it("fails when too short", () => {
    assert.equal(minLength("hi", 3).valid, false);
  });
});

describe("maxLength", () => {
  it("passes when short enough", () => {
    assert.equal(maxLength("hi", 10).valid, true);
  });
  it("fails when too long", () => {
    assert.equal(maxLength("hello world", 5).valid, false);
  });
  it("passes on null", () => {
    assert.equal(maxLength(null, 5).valid, true);
  });
});

// =============== isNumber ===============

describe("isNumber", () => {
  it("accepts valid number", () => {
    assert.equal(isNumber(42).valid, true);
  });
  it("accepts numeric string", () => {
    assert.equal(isNumber("3.14").valid, true);
  });
  it("rejects non-number", () => {
    assert.equal(isNumber("abc").valid, false);
  });
  it("respects min", () => {
    assert.equal(isNumber(5, { min: 10 }).valid, false);
  });
  it("respects max", () => {
    assert.equal(isNumber(50, { max: 10 }).valid, false);
  });
  it("integer mode rejects float", () => {
    assert.equal(isNumber(3.5, { integer: true }).valid, false);
  });
  it("integer mode accepts int", () => {
    assert.equal(isNumber(3, { integer: true }).valid, true);
  });
});

// =============== isOneOf ===============

describe("isOneOf", () => {
  it("passes when value is in list", () => {
    assert.equal(isOneOf("admin", ["admin", "user", "guest"]).valid, true);
  });
  it("fails when value not in list", () => {
    assert.equal(isOneOf("hacker", ["admin", "user"]).valid, false);
  });
});

// =============== matches ===============

describe("matches", () => {
  it("passes when values match", () => {
    assert.equal(matches("abc123", "abc123").valid, true);
  });
  it("fails when values differ", () => {
    assert.equal(matches("abc", "xyz").valid, false);
  });
});

// =============== isDate ===============

describe("isDate", () => {
  it("accepts valid date", () => {
    assert.equal(isDate("2024-06-15").valid, true);
  });
  it("rejects invalid format", () => {
    assert.equal(isDate("15/06/2024").valid, false);
  });
  it("rejects impossible date (Feb 30)", () => {
    assert.equal(isDate("2024-02-30").valid, false);
  });
  it("respects minDate", () => {
    assert.equal(isDate("2020-01-01", { minDate: "2022-01-01" }).valid, false);
  });
  it("respects maxDate", () => {
    assert.equal(isDate("2025-12-31", { maxDate: "2024-12-31" }).valid, false);
  });
});

// =============== isAge ===============

describe("isAge", () => {
  it("rejects underage", () => {
    const recent = new Date();
    recent.setFullYear(recent.getFullYear() - 10);
    const dob = recent.toISOString().split("T")[0];
    assert.equal(isAge(dob, { min: 18 }).valid, false);
  });
  it("accepts valid age", () => {
    const older = new Date();
    older.setFullYear(older.getFullYear() - 25);
    const dob = older.toISOString().split("T")[0];
    assert.equal(isAge(dob, { min: 18 }).valid, true);
  });
});

// =============== matchesPattern ===============

describe("matchesPattern", () => {
  it("passes with matching pattern", () => {
    assert.equal(matchesPattern("ABC-1234", /^[A-Z]{3}-\d{4}$/).valid, true);
  });
  it("fails with non-matching pattern", () => {
    assert.equal(matchesPattern("abc-12", /^[A-Z]{3}-\d{4}$/).valid, false);
  });
  it("uses custom error message", () => {
    const r = matchesPattern("bad", /^\d+$/, "Code", "Must be digits only");
    assert.ok(r.message.includes("Must be digits only"));
  });
});

// =============== isCreditCard ===============

describe("isCreditCard", () => {
  it("accepts valid Visa test number", () => {
    // Standard Luhn-valid test card
    assert.equal(isCreditCard("4111111111111111").valid, true);
  });
  it("accepts with spaces", () => {
    assert.equal(isCreditCard("4111 1111 1111 1111").valid, true);
  });
  it("rejects invalid number", () => {
    assert.equal(isCreditCard("1234567890123456").valid, false);
  });
});

// =============== isPanCard ===============

describe("isPanCard", () => {
  it("accepts valid PAN", () => {
    assert.equal(isPanCard("ABCDE1234F").valid, true);
  });
  it("rejects invalid PAN", () => {
    assert.equal(isPanCard("12345ABCDE").valid, false);
  });
});

// =============== isAadhaar ===============

describe("isAadhaar", () => {
  it("accepts 12 digits", () => {
    assert.equal(isAadhaar("123456789012").valid, true);
  });
  it("accepts grouped format", () => {
    assert.equal(isAadhaar("1234 5678 9012").valid, true);
  });
  it("rejects 11 digits", () => {
    assert.equal(isAadhaar("12345678901").valid, false);
  });
});

// =============== isZipCode ===============

describe("isZipCode", () => {
  it("accepts 5-digit zip", () => {
    assert.equal(isZipCode("90210").valid, true);
  });
  it("accepts ZIP+4", () => {
    assert.equal(isZipCode("90210-1234").valid, true);
  });
  it("rejects invalid zip", () => {
    assert.equal(isZipCode("ABCDE").valid, false);
  });
});

// =============== isPinCode ===============

describe("isPinCode", () => {
  it("accepts valid Indian PIN", () => {
    assert.equal(isPinCode("110001").valid, true);
  });
  it("rejects PIN starting with 0", () => {
    assert.equal(isPinCode("010001").valid, false);
  });
});

// =============== isIPv4 ===============

describe("isIPv4", () => {
  it("accepts valid IP", () => {
    assert.equal(isIPv4("192.168.1.1").valid, true);
  });
  it("rejects out of range", () => {
    assert.equal(isIPv4("256.1.1.1").valid, false);
  });
  it("rejects non-IP", () => {
    assert.equal(isIPv4("abc.def.ghi.jkl").valid, false);
  });
});

// =============== isHexColor ===============

describe("isHexColor", () => {
  it("accepts #RGB", () => {
    assert.equal(isHexColor("#fff").valid, true);
  });
  it("accepts #RRGGBB", () => {
    assert.equal(isHexColor("#1a2b3c").valid, true);
  });
  it("rejects invalid", () => {
    assert.equal(isHexColor("#gggggg").valid, false);
  });
});

// =============== noHTML ===============

describe("noHTML", () => {
  it("passes clean text", () => {
    assert.equal(noHTML("Hello world").valid, true);
  });
  it("rejects HTML tags", () => {
    assert.equal(noHTML("<script>alert('xss')</script>").valid, false);
  });
  it("rejects img tags", () => {
    assert.equal(noHTML('<img src="x" onerror="alert(1)">').valid, false);
  });
  it("passes null", () => {
    assert.equal(noHTML(null).valid, true);
  });
});

// =============== isSlug ===============

describe("isSlug", () => {
  it("accepts valid slug", () => {
    assert.equal(isSlug("my-awesome-post").valid, true);
  });
  it("rejects uppercase", () => {
    assert.equal(isSlug("My-Post").valid, false);
  });
  it("rejects spaces", () => {
    assert.equal(isSlug("my post").valid, false);
  });
});

// =============== validateForm ===============

describe("validateForm", () => {
  const schema = {
    email: { type: "email", required: true, label: "Email" },
    password: {
      type: "password",
      required: true,
      label: "Password",
      options: { minLength: 8 },
    },
    confirmPassword: {
      type: "match",
      matchField: "password",
      required: true,
      label: "Confirm Password",
    },
    username: {
      type: "username",
      required: true,
      options: { minLength: 3, maxLength: 20 },
    },
    phone: { type: "phone", required: false, label: "Phone" },
    website: { type: "url", required: false },
    age: { type: "number", required: true, options: { min: 18, max: 120 } },
    bio: { type: "string", max: 200, noHTML: true, label: "Bio" },
  };

  it("validates a correct form", () => {
    const data = {
      email: "user@example.com",
      password: "MyStr0ng!Pass",
      confirmPassword: "MyStr0ng!Pass",
      username: "john_doe",
      phone: "+1 555-123-4567",
      website: "https://example.com",
      age: 25,
      bio: "Hello, I am a developer.",
    };

    const r = validateForm(data, schema);
    assert.equal(r.isValid, true);
    assert.deepEqual(r.errors, {});
  });

  it("catches multiple errors", () => {
    const data = {
      email: "not-an-email",
      password: "weak",
      confirmPassword: "different",
      username: "ab",
      age: 15,
      bio: '<script>alert("xss")</script>',
    };

    const r = validateForm(data, schema);
    assert.equal(r.isValid, false);
    assert.ok(r.errors.email);
    assert.ok(r.errors.password);
    assert.ok(r.errors.confirmPassword);
    assert.ok(r.errors.username);
    assert.ok(r.errors.age);
    assert.ok(r.errors.bio);
  });

  it("skips optional empty fields", () => {
    const data = {
      email: "user@example.com",
      password: "MyStr0ng!Pass",
      confirmPassword: "MyStr0ng!Pass",
      username: "john_doe",
      phone: "",
      website: "",
      age: 25,
      bio: "",
    };

    const r = validateForm(data, schema);
    assert.equal(r.isValid, true);
  });

  it("catches required empty fields", () => {
    const data = {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      age: "",
    };

    const r = validateForm(data, schema);
    assert.equal(r.isValid, false);
    assert.ok(r.errors.email);
    assert.ok(r.errors.password);
  });
});

console.log("🧪 All tests defined. Running...\n");
