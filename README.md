# Joseph Edrick E. Mirasol | Mobile App & Full-Stack Developer

A premium, highly interactive portfolio built with React and Vite, featuring a custom cinematic glass-morphism UI and a locally restricted Content Management System (CMS) powered by Supabase.

## 🚀 Features

*   **Cinematic UI/UX:** Custom CSS glass-morphism, ambient radial lighting, and tactile hover physics.
*   **Dynamic Hero Section:** Database-driven typewriter effect and conditional rendering for 10 distinct social/contact links.
*   **Local-Only Admin CMS:** A built-in dashboard restricted to local development (`import.meta.env.DEV`) for secure, real-time CRUD operations.
*   **Cloud File Management:** Direct integration with Supabase Storage for instantaneous resume and certificate uploads.
*   **Responsive Design:** Fluid typography and mobile-first layouts.

## 🛠️ Tech Stack

*   **Frontend:** React (TypeScript), Vite, Custom CSS
*   **Backend / Database:** Supabase (PostgreSQL), Supabase Storage
*   **Deployment:** Vercel

---

## 💻 Local Development & Setup

### 1. Clone & Install
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your Supabase keys (ensure this file is in your `.gitignore`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Database Setup
Run the following SQL script in your Supabase SQL Editor to generate the required tables and bypass Row Level Security for the local CMS:

```sql
-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  github_link TEXT,
  live_link TEXT,
  sort_order INTEGER DEFAULT 99
);

-- Create Experience Table
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  role_title TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 99
);

-- Create Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  file_link TEXT,
  sort_order INTEGER DEFAULT 99
);

-- Create About Section Table
CREATE TABLE IF NOT EXISTS about_section (
  id SERIAL PRIMARY KEY,
  content TEXT,
  resume_link TEXT
);
INSERT INTO about_section (id, content, resume_link) 
SELECT 1, 'Default bio...', '' WHERE NOT EXISTS (SELECT 1 FROM about_section WHERE id = 1);

-- Create Hero Section Table
CREATE TABLE IF NOT EXISTS hero_section (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  typing_text TEXT[] DEFAULT '{}',
  github_link TEXT, linkedin_link TEXT, facebook_link TEXT, 
  twitter_link TEXT, instagram_link TEXT, youtube_link TEXT, 
  tiktok_link TEXT, discord_link TEXT, dribbble_link TEXT, email_link TEXT
);
INSERT INTO hero_section (id, name) 
SELECT 1, 'Joseph Edrick E. Mirasol' WHERE NOT EXISTS (SELECT 1 FROM hero_section WHERE id = 1);

-- Disable RLS for Local Admin Access
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE experience DISABLE ROW LEVEL SECURITY;
ALTER TABLE certifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE about_section DISABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section DISABLE ROW LEVEL SECURITY;
```

### 4. Supabase Storage Setup
To enable file uploads from the Admin dashboard:
1. Go to **Storage** in your Supabase dashboard.
2. Create two new buckets: **`resumes`** and **`certificates`**.
3. Ensure both buckets are set to **Public**.
4. Add an **INSERT** policy under *Policies* for both buckets to allow file uploads.

### 5. Run the Application
```bash
npm run dev
```
*Access the local-only Admin CMS by navigating to `http://localhost:5173/admin`.*