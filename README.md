# MBA Admission Lead Manager (no Node.js version)

Plain HTML + JavaScript. No installation, no build step, no Node.js. Data is stored in Supabase (PostgreSQL), so it stays saved across refreshes, logins and devices.

Files: `index.html` (the app), `app.js` (all logic), `config.js` (your Supabase keys), `schema.sql` (database).
You need an internet connection (the page loads Tailwind, Supabase and Excel libraries from CDNs).

## 1. Create the database (10 minutes, free)
1. Sign up at https://supabase.com and create a project.
2. Open **SQL Editor -> New query**, paste all of `schema.sql`, click **Run**.
3. **Project Settings -> API**: copy the **Project URL** and the **anon public** key. Never use the `service_role` key.
4. Optional while setting up: **Authentication -> Providers -> Email**, turn off "Confirm email".

## 2. Connect the app
Open `config.js` in Notepad, replace the two placeholder values with your URL and anon key, and save.

## 3. Run it
Option A (quickest): double-click `index.html`. If your browser blocks login or data on a `file://` page, use Option B.
Option B (recommended): host it online with Netlify Drop (below), or run `python -m http.server 8000` in this folder (Python only, no Node) and open http://localhost:8000.

Click **Create an account**. The first account becomes Admin. Later accounts are Counsellors (manage them under Users).

## 4. Put it online for free (no coding)
1. Go to https://app.netlify.com/drop and drag this whole folder onto the page. You get a link like `https://something.netlify.app`.
2. In Supabase -> **Authentication -> URL Configuration**, set Site URL to that link.
Alternatives: Cloudflare Pages, GitHub Pages, Vercel (drag-and-drop or Git).
The anon key in `config.js` is public by design; data is protected by the Row Level Security rules in `schema.sql`.

## Roles
Admin: all leads, users, delete, reassign. Counsellor: only leads assigned to them (enforced by the database), cannot delete.

## Test checklist
1. Add a lead with two exams and academic details; open its profile.
2. Refresh, then open the site on your phone: the lead is still there.
3. Edit it; set a next follow-up; check the Follow-ups page.
4. Add another lead with the same mobile: duplicate warning appears.
5. Leads page: search, each filter, header sorting, pagination.
6. Follow-ups -> Record outcome -> schedule next; see history on the profile.
7. Import/Export: download template, import with preview, then export to Excel and CSV.
8. Create a counsellor, assign a lead to them, confirm they only see that lead.
9. As Admin, delete a lead (confirmation appears).
