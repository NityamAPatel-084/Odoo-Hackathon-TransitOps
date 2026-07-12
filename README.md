

# Transitops

This contains everything you need to run your app locally.



## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   thankyou!


## 🔒 Enterprise Security Features

- **Application-Level Encryption (ALE)** — Driver PII is encrypted at rest using `aes-256-cbc`.
- **Role-Based Access Control (RBAC)** — Strict least-privilege middleware securing all endpoints.
- **Zod Payload Validation** — Complete runtime type-safety protecting against SQL Injection.
- **Network Hardening** — Configured with Helmet HTTP headers, strict CORS, and Rate Limiting.

