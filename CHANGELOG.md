# FormCheck JS — Changelog

## [1.0.0] — 2024-XX-XX

### 🎉 Initial Release

#### Validators
- `isRequired` — checks for empty/null/undefined values
- `isEmail` — RFC 5322 simplified email validation
- `isPassword` — configurable password strength rules
- `passwordStrength` — returns a 0-5 strength score with labels
- `isPhone` — international phone number validation (with strict mode)
- `isURL` — URL validation with protocol check
- `isUsername` — alphanumeric + underscores + hyphens
- `minLength` / `maxLength` — character count constraints
- `isNumber` — numeric validation with min/max/integer options
- `isOneOf` — value-in-list validation
- `matches` — two-value comparison (password confirm, etc.)
- `isDate` — YYYY-MM-DD format with range checks
- `isAge` — age calculation from birth date
- `matchesPattern` — custom regex validation
- `isCreditCard` — Luhn algorithm card validation
- `isPanCard` — Indian PAN card format
- `isAadhaar` — Indian Aadhaar number
- `isZipCode` — US ZIP code (5 or 5+4)
- `isPinCode` — Indian PIN code
- `isIPv4` — IPv4 address validation
- `isHexColor` — hex color code (#RGB / #RRGGBB)
- `noHTML` — XSS prevention (rejects HTML/script tags)
- `isSlug` — URL slug format

#### Schema Validation
- `validateForm` — validate entire forms with a single schema object

#### Package
- Zero dependencies
- CommonJS + ESM dual builds
- Full TypeScript definitions
- Node.js 14+ support
