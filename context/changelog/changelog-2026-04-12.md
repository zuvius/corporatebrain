# Changelog - April 12, 2026

## Auth.js Login Investigation and Fixes

### Files Read / Analyzed

- `@c:\Users\seoho\Documents\Corporate Brain\components\auth\signin-form.tsx:1-149` - Reviewed client credentials login flow and redirect handling
- `@c:\Users\seoho\Documents\Corporate Brain\lib\auth\config.ts:1-91` - Reviewed Auth.js credentials provider, JWT callback, and session callback behavior
- `@c:\Users\seoho\Documents\Corporate Brain\middleware.ts:1-29` - Reviewed protected-route session cookie detection
- `@c:\Users\seoho\Documents\Corporate Brain\app\(app)\app\page.tsx:1-35` - Reviewed `/app` redirect guard requiring `session.user.tenantId`
- `@c:\Users\seoho\Documents\Corporate Brain\lib\db\queries.ts:1-120` - Verified tenant/user lookup methods used by auth
- `@c:\Users\seoho\Documents\Corporate Brain\db\seeds\index.ts:1-220` - Verified seeded tenant slug and seeded user credentials

### Files Modified

- `@c:\Users\seoho\Documents\Corporate Brain\components\auth\signin-form.tsx:22-39` - Passed `tenantSlug: "acme"` in credentials sign-in call and added temporary debug visibility for the returned result
- `@c:\Users\seoho\Documents\Corporate Brain\lib\auth\config.ts:6-6` - Added `getUserById` import for fallback session hydration
- `@c:\Users\seoho\Documents\Corporate Brain\lib\auth\config.ts:71-86` - Added JWT fallback to hydrate `token.role` and `token.tenantId` from DB when custom fields are missing
- `@c:\Users\seoho\Documents\Corporate Brain\middleware.ts:7-13` - Removed false-positive `next-auth.callback-url` auth detection and added support for both `authjs.*` and `next-auth.*` session cookie names
- `@c:\Users\seoho\Documents\Corporate Brain\.env:7-7` - Aligned `AUTH_URL` with active local dev port
- `@c:\Users\seoho\Documents\Corporate Brain\.windsurf\memory\active-context.md:3-9` - Updated current focus and blocker state for auth debugging

### Root Cause Findings

- Credentials POST was succeeding, but authenticated navigation was still returning to `/auth/signin`
- `@c:\Users\seoho\Documents\Corporate Brain\app\(app)\app\page.tsx:8-12` redirects when `session.user.tenantId` is missing
- Middleware was only checking `next-auth.*` cookies, while Auth.js v5 setups may use `authjs.*` session cookies
- Middleware was previously treating `next-auth.callback-url` as an auth signal even though it is not a session cookie
- Custom JWT fields (`role`, `tenantId`) needed a fallback hydration path from the database for reliability

### Verification Performed

- Verified tenant and seeded users exist in the database and are attached to the `acme` tenant
- Confirmed local auth flow returns to `/auth/signin` after POST, indicating session recognition failure rather than a missing route

### Expected Outcome

- Valid credentials should now establish a session recognized by middleware
- `/app` should no longer redirect back to `/auth/signin` due to missing `tenantId` in session state
