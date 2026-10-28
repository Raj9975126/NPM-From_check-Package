// ============================================================
//  Build script — creates CJS + ESM bundles, copies .d.ts
//  No external build tools needed.
// ============================================================

const fs = require("fs");
const path = require("path");

const DIST = path.resolve(__dirname, "..", "dist");
const SRC = path.resolve(__dirname, "..", "src");

// Ensure dist/ exists
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

// ---- Read source files ----
const validatorsCode = fs.readFileSync(path.join(SRC, "validators.js"), "utf8");

// ---- CommonJS bundle ----
// Just copy the source as-is (it already uses module.exports)
const cjsBundle = `// FormCheck — CommonJS build
// https://github.com/your-username/formcheck-js

${validatorsCode}
`;

fs.writeFileSync(path.join(DIST, "index.cjs.js"), cjsBundle);

// ---- ESM bundle ----
// Transform module.exports into named exports + default export
let esmCode = validatorsCode;

// Remove the module.exports block and replace with ESM exports
const exportsBlockRegex = /module\.exports\s*=\s*\{[\s\S]*?\};/;
esmCode = esmCode.replace(exportsBlockRegex, "");

// Build export list by extracting the function names
const functionNames = [
  "isRequired",
  "isEmail",
  "isPassword",
  "passwordStrength",
  "isPhone",
  "isURL",
  "isUsername",
  "minLength",
  "maxLength",
  "isNumber",
  "isOneOf",
  "matches",
  "isDate",
  "isAge",
  "matchesPattern",
  "isCreditCard",
  "isPanCard",
  "isAadhaar",
  "isZipCode",
  "isPinCode",
  "isIPv4",
  "isHexColor",
  "noHTML",
  "isSlug",
  "validateForm",
  "PATTERNS",
];

const esmExports = `
export {
  ${functionNames.join(",\n  ")}
};

export default {
  ${functionNames.join(",\n  ")}
};
`;

const esmBundle = `// FormCheck — ESM build
// https://github.com/your-username/formcheck-js

${esmCode}
${esmExports}
`;

fs.writeFileSync(path.join(DIST, "index.esm.js"), esmBundle);

// ---- Copy TypeScript definitions ----
const dtsSource = path.resolve(__dirname, "..", "index.d.ts");
if (fs.existsSync(dtsSource)) {
  fs.copyFileSync(dtsSource, path.join(DIST, "index.d.ts"));
}

console.log("✅ Build complete!");
console.log("   dist/index.cjs.js  (CommonJS)");
console.log("   dist/index.esm.js  (ESM)");
console.log("   dist/index.d.ts    (TypeScript)");
