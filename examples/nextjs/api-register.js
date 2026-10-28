// =============================================
//  FormCheck JS — Next.js API Route Example
//  Server-side validation using FormCheck
//
//  File location in your Next.js project:
//  -> pages/api/register.js   (Pages Router)
//  -> app/api/register/route.js  (App Router)
// =============================================

import { validateForm } from "formcheck-js";

// For Next.js Pages Router (pages/api/register.js)
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const schema = {
    name:            { type: "string",   required: true, min: 2, max: 50, label: "Full Name" },
    email:           { type: "email",    required: true, label: "Email" },
    phone:           { type: "phone",    required: true, label: "Phone" },
    username:        { type: "username", required: true, options: { minLength: 3 }, label: "Username" },
    password:        { type: "password", required: true, options: { minLength: 8 }, label: "Password" },
    confirmPassword: { type: "match",    matchField: "password", required: true, label: "Confirm Password" },
    age:             { type: "number",   required: true, options: { min: 18 }, label: "Age" },
  };

  // Server-side validation with FormCheck
  const result = validateForm(req.body, schema);

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.errors,
    });
  }

  // All valid — save to database here
  const { name, email, username } = req.body;

  res.status(201).json({
    success: true,
    message: `Welcome ${name}! Account created.`,
    user: { name, email, username },
  });
}

// -----------------------------------------------
// For Next.js App Router (app/api/register/route.js)
// Use this instead of the above:
// -----------------------------------------------
//
// import { validateForm } from "formcheck-js";
//
// export async function POST(request) {
//   const body = await request.json();
//   const result = validateForm(body, schema);
//
//   if (!result.isValid) {
//     return Response.json({ success: false, errors: result.errors }, { status: 400 });
//   }
//
//   return Response.json({ success: true, message: "Account created!" }, { status: 201 });
// }
