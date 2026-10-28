// ============================================================
//  FormCheck — TypeScript Definitions
// ============================================================

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export interface PasswordStrengthResult {
  score: number;
  label: "Empty" | "Very Weak" | "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  percent: number;
}

export interface PasswordOptions {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
  specialChars?: string;
}

export interface PhoneOptions {
  strict?: boolean;
}

export interface UsernameOptions {
  minLength?: number;
  maxLength?: number;
}

export interface NumberOptions {
  min?: number;
  max?: number;
  integer?: boolean;
}

export interface DateOptions {
  minDate?: string;
  maxDate?: string;
}

export interface AgeOptions {
  min?: number;
  max?: number;
}

export interface SchemaRule {
  type:
    | "string"
    | "email"
    | "password"
    | "phone"
    | "url"
    | "username"
    | "number"
    | "date"
    | "age"
    | "match"
    | "oneOf"
    | "creditCard"
    | "pan"
    | "aadhaar"
    | "zip"
    | "pinCode"
    | "ipv4"
    | "hexColor"
    | "slug"
    | "pattern";
  required?: boolean;
  label?: string;
  min?: number;
  max?: number;
  noHTML?: boolean;
  options?: PasswordOptions | PhoneOptions | UsernameOptions | NumberOptions | DateOptions | AgeOptions;
  matchField?: string;
  matchLabel?: string;
  allowed?: any[];
  pattern?: RegExp | string;
  errorMessage?: string;
}

export interface FormSchema {
  [field: string]: SchemaRule;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: { [field: string]: string };
  results: { [field: string]: ValidationResult };
}

export interface Patterns {
  email: RegExp;
  phone: RegExp;
  phoneStrict: RegExp;
  url: RegExp;
  username: RegExp;
  alpha: RegExp;
  numeric: RegExp;
  alphanumeric: RegExp;
  panCard: RegExp;
  aadhaar: RegExp;
  zipUS: RegExp;
  pinCodeIndia: RegExp;
  ipv4: RegExp;
  hexColor: RegExp;
  dateISO: RegExp;
  creditCard: RegExp;
  slug: RegExp;
}

// Individual validators
export function isRequired(value: any, fieldName?: string): ValidationResult;
export function isEmail(value: any, fieldName?: string): ValidationResult;
export function isPassword(value: any, options?: PasswordOptions, fieldName?: string): ValidationResult;
export function passwordStrength(value: any): PasswordStrengthResult;
export function isPhone(value: any, options?: PhoneOptions, fieldName?: string): ValidationResult;
export function isURL(value: any, fieldName?: string): ValidationResult;
export function isUsername(value: any, options?: UsernameOptions, fieldName?: string): ValidationResult;
export function minLength(value: any, min: number, fieldName?: string): ValidationResult;
export function maxLength(value: any, max: number, fieldName?: string): ValidationResult;
export function isNumber(value: any, options?: NumberOptions, fieldName?: string): ValidationResult;
export function isOneOf(value: any, allowedValues: any[], fieldName?: string): ValidationResult;
export function matches(value: any, compareValue: any, fieldName?: string, compareName?: string): ValidationResult;
export function isDate(value: any, options?: DateOptions, fieldName?: string): ValidationResult;
export function isAge(value: any, options?: AgeOptions, fieldName?: string): ValidationResult;
export function matchesPattern(value: any, pattern: RegExp | string, fieldName?: string, errorMsg?: string): ValidationResult;
export function isCreditCard(value: any, fieldName?: string): ValidationResult;
export function isPanCard(value: any, fieldName?: string): ValidationResult;
export function isAadhaar(value: any, fieldName?: string): ValidationResult;
export function isZipCode(value: any, fieldName?: string): ValidationResult;
export function isPinCode(value: any, fieldName?: string): ValidationResult;
export function isIPv4(value: any, fieldName?: string): ValidationResult;
export function isHexColor(value: any, fieldName?: string): ValidationResult;
export function noHTML(value: any, fieldName?: string): ValidationResult;
export function isSlug(value: any, fieldName?: string): ValidationResult;

// Schema-based validation
export function validateForm(formData: Record<string, any>, schema: FormSchema): FormValidationResult;

// Regex patterns
export const PATTERNS: Patterns;

// Default export
declare const FormCheck: {
  isRequired: typeof isRequired;
  isEmail: typeof isEmail;
  isPassword: typeof isPassword;
  passwordStrength: typeof passwordStrength;
  isPhone: typeof isPhone;
  isURL: typeof isURL;
  isUsername: typeof isUsername;
  minLength: typeof minLength;
  maxLength: typeof maxLength;
  isNumber: typeof isNumber;
  isOneOf: typeof isOneOf;
  matches: typeof matches;
  isDate: typeof isDate;
  isAge: typeof isAge;
  matchesPattern: typeof matchesPattern;
  isCreditCard: typeof isCreditCard;
  isPanCard: typeof isPanCard;
  isAadhaar: typeof isAadhaar;
  isZipCode: typeof isZipCode;
  isPinCode: typeof isPinCode;
  isIPv4: typeof isIPv4;
  isHexColor: typeof isHexColor;
  noHTML: typeof noHTML;
  isSlug: typeof isSlug;
  validateForm: typeof validateForm;
  PATTERNS: Patterns;
};

export default FormCheck;
