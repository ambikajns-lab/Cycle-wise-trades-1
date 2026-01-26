
How to use the confirmation templates

Files
- `confirmation.html` — HTML email (styled, mobile-friendly). Uses Supabase template variable `{{ .ConfirmationURL }}` for the confirmation link.
- `confirmation.txt` — plain-text fallback using `{{ .ConfirmationURL }}`.

How to install in Supabase
1. Open your Supabase project → Auth → Templates → Confirmation email.
2. Paste the contents of `confirmation.html` into the HTML editor.
3. Paste the contents of `confirmation.txt` into the plain-text editor / fallback field.
4. Save the template.
5. Ensure your Supabase project settings include your app's origin as a valid redirect URL (see below).
6. Test by signing up a new email — the confirmation link should redirect to `/login` in your app (we set `emailRedirectTo` to `${window.location.origin}/login` in the app).

Required Supabase settings for local development
- In the Supabase dashboard go to Auth → Settings (or Redirect URLs) and add your local app origin, e.g. `http://localhost:8081` (or the Vite URL you see in your terminal) to the allowed Redirect URLs. This allows Supabase to redirect users back to your app after they click the confirmation link.

Environment variables your app needs
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Notes
- The templates already use `{{ .ConfirmationURL }}` which Supabase replaces with a one-time confirmation link that includes the configured redirect (`emailRedirectTo`) if provided by the app during sign-up.
- We configured the app to pass `emailRedirectTo: <origin>/login` when signing up, so after users confirm they should land on your `/login` page.
- If you prefer Supabase to handle redirects differently, adjust `emailRedirectTo` or Supabase settings accordingly.

