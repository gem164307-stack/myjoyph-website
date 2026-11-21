# MyJoyPH — New Standalone Website

This is a NEW, self-contained project. It does not import, link to, or require files from any previous MyJoyPH project.

## Project contents
- `index.html` — public food website and live menu
- `admin.html` — separate owner login and menu editor
- `css/site.css` — all styles
- `js/config.js` — supplied Supabase URL and publishable key plus business settings
- `js/client.js` — public menu reader
- `js/admin.js` — owner authentication, add/edit/delete, photo upload
- `supabase/schema.sql` — dedicated `menu_items` and `site_admins` tables, RLS policies, and dedicated storage bucket

## Setup

### A. Configure business information
Edit `js/config.js`:
- `BUSINESS_ADDRESS`: complete address shown on the website and used for Google Maps directions.
- `FACEBOOK_URL`: your exact Facebook page URL.

Your Supabase project URL and publishable key are prefilled from your message. The publishable/anon key is intended for browser use. Never put a service-role or secret key in frontend code.

### B. Create the new website's Supabase objects
1. Open https://supabase.com/dashboard/project/wfuokohhwnvoeibumhdw
2. Go to SQL Editor.
3. Run the complete `supabase/schema.sql` script.
4. This project uses its own table names (`menu_items`, `site_admins`) and storage bucket (`myjoyph-menu-photos`). It is independent of the earlier starter's names. It does not delete or alter unrelated tables.

### C. Create an owner login
1. Go to Supabase Authentication → Users and create the owner account.
2. Copy the user's UUID.
3. In SQL Editor, run this with the real UUID:
   ```sql
   insert into public.site_admins(user_id)
   values ('OWNER-AUTH-USER-UUID');
   ```
Only accounts listed in `site_admins` can manage this site's menu. Do not enable public admin registration.

### D. Preview and publish
Run the folder with VS Code Live Server or another static HTTP server. Do not open the pages with `file://`.
- Customer site: `index.html`
- Owner dashboard: `admin.html`

Upload the entire folder to a static host (Netlify, Vercel, or your hosting provider) to publish. The admin page is separate at `/admin.html`.

## Important
This is the code and setup package; it is not deployed or connected until you run the SQL and create the owner account. Test sign-in, menu add/edit/delete, and photo uploads before going live. Replace the sample hero image with your own approved brand photo if desired.
