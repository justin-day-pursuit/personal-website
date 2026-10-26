# Justin's Resume Story Website

A personal portfolio and interactive resume website built with **Astro**, **TypeScript**, and **Plain CSS**, optimized for zero-config deployment on **Vercel**.

---

## 🚀 Quick Start for Developers

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
# -> Opens at http://localhost:4321

# 3. Type check project
npm run check

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```text
resume-story-site/
├── public/                       # Publicly accessible static assets
│   ├── favicon.svg               # Site browser tab icon
│   ├── jdayres.pdf               # Downloadable resume PDF
│   └── profilePic.jpeg           # Profile picture
│
├── src/
│   ├── components/               # Modular page sections
│   │   ├── StickyNav.astro       # Top navigation bar & theme toggle
│   │   ├── Header.astro          # Hero headline & subtitle
│   │   ├── About.astro           # Bio narrative, photo, and resume link
│   │   ├── Projects.astro        # Projects grid and cards
│   │   ├── MoreOnMe.astro        # Expandable trait cards
│   │   ├── Contact.astro         # Direct message inquiry form
│   │   ├── Footer.astro          # Social links, email, and copyright
│   │   └── ToTopButton.astro     # Smooth scroll-to-top floating button
│   │
│   ├── layouts/
│   │   └── Layout.astro          # Base HTML page template, fonts, analytics
│   │
│   ├── pages/
│   │   └── index.astro           # Homepage assembling all components
│   │
│   ├── scripts/                  # TypeScript client behaviors
│   │   ├── navigation.ts         # Smooth scrolling & sticky nav state
│   │   ├── theme.ts              # Light / Dark mode toggle & persistence
│   │   ├── traits.ts             # Hover preview & click lock for trait cards
│   │   └── contact.ts            # Form validation & asynchronous email sending
│   │
│   └── styles/
│       └── global.css            # 100% Plain CSS styling & design variables
│
├── astro.config.mjs              # Astro configuration with Vercel adapter
├── tsconfig.json                 # TypeScript strict configuration
└── package.json                  # Scripts and dependencies
```

---

## 🛠️ Non-Tech Admin Maintenance Guide

You do **not** need advanced programming knowledge to keep this website updated. Here is how to make common updates:

### 1. How to Update Your Resume (PDF)
1. Export your updated resume as a PDF file.
2. Name it exactly `jdayres.pdf`.
3. Drag and drop it into the `public/` folder, replacing the existing file.
4. That's it! All links on the site will instantly point to your new resume.

### 2. How to Update Your Profile Picture
1. Choose your new profile image and name it `profilePic.jpeg`.
2. Place it inside the `public/` folder, replacing the old file.
3. If you want to use a different filename or format (like `.png`), open `src/components/About.astro` and change `src="/profilePic.jpeg"` to your new file name.

### 3. How to Edit Your Bio or Story
- Open `src/components/About.astro`.
- You will see standard `<p>...</p>` paragraph tags.
- Simply edit the text between those tags and save the file.

### 4. How to Add or Edit Projects
- Open `src/components/Projects.astro`.
- Each project is wrapped in an `<article class="project-card">` block.
- To edit an existing project, replace the title, description, or external link (`href="https://..."`).
- To add a new project, copy an entire `<article class="project-card">` block and paste it directly underneath.

### 5. How to Edit "More On Me" Trait Cards
- Open `src/components/MoreOnMe.astro`.
- Trait cards are numbered (`data-trait="1"`, `data-trait="2"`, etc.).
- Update the heading in `<h3 class="trait-title">` or the story text inside `<div class="trait-inner">`.

### 6. How to Change Contact Email or Social Media Links
- **Contact Form Recipient**: Open `src/components/Contact.astro` and find `data-recipient="justin.day@pursuit.org"`. Replace with your preferred inbox.
- **Footer Email & Socials**: Open `src/components/Footer.astro` and update the email `mailto:` link, LinkedIn link, or GitHub link.

### 7. How to Change Colors or Fonts
- Open `src/styles/global.css`.
- Colors and fonts are clearly defined at the very top inside `:root` (for Light Mode) and `.theme-dark` (for Dark Mode).
- Change hex values (e.g., `--accent: #60a5fa;`) to your desired colors.

---

## ☁️ Deploying to Vercel

This repository is pre-configured with `@astrojs/vercel` and standard static output.

### Option 1: Automatic Deployments via GitHub (Recommended)
1. Push your changes to your GitHub repository (`main` branch).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** -> **"Project"** and select `resume-story-site`.
4. Vercel will automatically detect **Astro** as the framework.
5. Click **Deploy**. Vercel will build and deploy the site in seconds, and redeploy automatically whenever you push new commits.

### Option 2: Deploying via Vercel CLI
```bash
npm i -g vercel
vercel
```
