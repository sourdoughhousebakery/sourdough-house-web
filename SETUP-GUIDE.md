# 🍞 Sourdough House Bakery — Setup Guide

Everything you need to get your website live, your domain connected, and your email working.

---

## Part 1: Create a Vercel Account & Deploy Your Website

Vercel is where your website lives on the internet. It's free for personal sites and automatically makes your site fast and secure.

### Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**
2. Sign up using **GitHub** (easiest option) — if you don't have a GitHub account, create one at [github.com](https://github.com) first
3. Once signed in, you'll see your Vercel dashboard

### Step 2: Deploy Your Website

You'll get your website files as a folder. Here's how to get them online:

1. In your Vercel dashboard, click **"Add New..." → Project**
2. Click **"Import Git Repository"** — if you're new, you'll need to push your code to GitHub first (see below)

**Option A: Using GitHub (Recommended)**

1. Go to [github.com](https://github.com) and create a new repository called `sourdough-house-bakery`
2. Upload all the website files (you can drag & drop them in the GitHub web interface)
3. Back in Vercel, click **Import** on your new repository
4. Leave all settings as default and click **Deploy**
5. Wait ~60 seconds — your site is live! 🎉

Vercel will give you a URL like `sourdough-house-bakery.vercel.app`

**Option B: Using Vercel CLI (if Matt is helping you)**

If Matt is deploying for you, he can run:
```bash
# Install Vercel CLI
npm i -g vercel

# Go to the website folder
cd versions/v3-playful

# Deploy (follow the prompts)
vercel
```

### Step 3: Every Time You Want to Update

If you're using GitHub:
- Push changes to GitHub
- Vercel auto-deploys within seconds

If Matt is managing it, he'll handle this for you.

---

## Part 2: Connect Your Custom Domain

Right now your site is at something like `sourdough-house-bakery.vercel.app`. You want it at `sourdoughhouse.com` (or whatever domain you choose).

### Step 1: Buy a Domain (if you don't have one)

Good domain registrars:
- **[Namecheap](https://namecheap.com)** — Best prices, free WHOIS privacy
- **[Porkbun](https://porkbun.com)** — Great prices, free privacy, nice interface
- **[Google Domains](https://domains.google.com)** — Simple but now redirects to Squarespace

Look for: `sourdoughhouse.com`, `sourdoughhousebakery.com`, `sourdoughhousebakery.net`, etc.

### Step 2: Add Your Domain to Vercel

1. In your Vercel dashboard, go to your project → **Settings → Domains**
2. Type in your domain (e.g., `sourdoughhouse.com`) and click **Add**
3. Vercel will show you DNS records you need to add

### Step 3: Configure DNS at Your Domain Registrar

Go to your domain registrar (Namecheap, Porkbun, etc.) and add these DNS records:

**For the apex domain (e.g., `sourdoughhouse.com`):**

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |

**For the www subdomain (e.g., `www.sourdoughhouse.com`):**

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | `cname.vercel-dns.com` |

**Important notes:**
- If your registrar has an "A record" for `@` already pointing somewhere, **replace it** (don't add a second one)
- DNS changes can take up to 48 hours to propagate (usually 5-30 minutes)
- Vercel auto-provisions SSL — your site will be HTTPS automatically

### Step 4: Verify

1. Back in Vercel → Settings → Domains, your domain should show **"Valid Configuration"** (may take a few minutes)
2. Once verified, visit your domain in a browser — your site should load!
3. Vercel automatically redirects `www.yourdomain.com` → `yourdomain.com`

---

## Part 3: Set Up Google Workspace for Email

This gives you a professional email like `hello@sourdoughhouse.com` instead of a personal Gmail address.

### Step 1: Sign Up for Google Workspace

1. Go to [workspace.google.com](https://workspace.google.com)
2. Click **"Get Started"** or **"Free Trial"**
3. Choose a plan:
   - **Business Starter** ($7.20/mo) — 30GB storage, enough for a bakery
   - **Business Standard** ($14.40/mo) — 2TB storage, more video meetings
4. Enter your business info:
   - Business name: **Sourdough House Bakery**
   - Number of employees: **1** (just you for now)
5. Create your admin account, e.g.:
   - `jennifer@sourdoughhouse.com` (or whatever your name is)
   - Or `hello@sourdoughhouse.com` as your main contact

### Step 2: Verify Domain Ownership

Google will ask you to prove you own the domain. They'll give you a **TXT record** to add:

1. Copy the TXT record value Google gives you
2. Go to your domain registrar's DNS settings (same place you added Vercel records)
3. Add this record:

| Type | Name | Value |
|------|------|-------|
| TXT | `@` | `google-site-verification=XXXXXXXXXX` (the value Google gives you) |

4. Click **"Verify"** in Google Workspace
5. It may take a few minutes to verify

### Step 3: Add MX Records for Email

So emails actually arrive at your Google Workspace inbox, add these MX records at your domain registrar:

| Type | Name | Priority | Value |
|------|------|----------|-------|
| MX | `@` | 1 | `ASPMX.L.GOOGLE.COM` |
| MX | `@` | 5 | `ALT1.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 5 | `ALT2.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 10 | `ALT3.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 10 | `ALT4.ASPMX.L.GOOGLE.COM` |

**Remove any existing MX records** from your registrar first (especially if your registrar set up default ones).

### Step 4: Set Up Your Inbox

1. Go to [mail.google.com](https://mail.google.com) and sign in with your new address
2. Send a test email to yourself
3. Set up email on your phone:
   - iPhone: Settings → Mail → Accounts → Add Account → Google
   - Android: It usually auto-adds

### Step 5: Create Additional Email Aliases (Optional)

In Google Workspace Admin Console, you can add aliases like:
- `orders@sourdoughhouse.com` → forwards to your main inbox
- `info@sourdoughhouse.com` → forwards to your main inbox

These don't cost extra — they're just nicknames for your existing account.

---

## Part 4: Update Your Website's Hotplate Link

Once you've set up your Hotplate storefront, you need to tell your website where to send people.

### Find Your Hotplate Slug

1. Log into Hotplate
2. Go to your storefront settings
3. Your public URL will look like: `https://www.hotplate.com/your-slug-here`
4. Copy that slug (the part after `.com/`)

### Update the Website

Tell Matt your Hotplate slug and he'll update the website config. There's one line that needs to change:

```javascript
const CHEF_ID = 'your-slug-here';
```

And all the order links will also point to: `https://www.hotplate.com/your-slug-here`

---

## Quick Reference: All Your DNS Records

Once you're done, your domain's DNS should look like this:

| Type | Name | Priority | Value | Purpose |
|------|------|----------|-------|---------|
| A | `@` | — | `76.76.21.21` | Website (Vercel) |
| CNAME | `www` | — | `cname.vercel-dns.com` | WWW redirect |
| TXT | `@` | — | `google-site-verification=...` | Google verification |
| MX | `@` | 1 | `ASPMX.L.GOOGLE.COM` | Email (Google) |
| MX | `@` | 5 | `ALT1.ASPMX.L.GOOGLE.COM` | Email backup |
| MX | `@` | 5 | `ALT2.ASPMX.L.GOOGLE.COM` | Email backup |
| MX | `@` | 10 | `ALT3.ASPMX.L.GOOGLE.COM` | Email backup |
| MX | `@` | 10 | `ALT4.ASPMX.L.GOOGLE.COM` | Email backup |

---

## Checklist

- [ ] Vercel account created
- [ ] Website deployed to Vercel
- [ ] Domain purchased
- [ ] Domain added to Vercel
- [ ] DNS A record pointing to Vercel
- [ ] DNS CNAME for www pointing to Vercel
- [ ] Site loads at custom domain with HTTPS ✅
- [ ] Google Workspace account created
- [ ] Domain verified with Google
- [ ] Google TXT record added to DNS
- [ ] MX records added to DNS
- [ ] Email working (send yourself a test)
- [ ] Hotplate storefront URL given to Matt
- [ ] Website Hotplate links updated

---

## Need Help?

- **Vercel docs:** [vercel.com/docs](https://vercel.com/docs)
- **Google Workspace setup:** [support.google.com/a](https://support.google.com/a/)
- **DNS help:** Most registrars have live chat support — they'll walk you through adding records
- **Matt:** Always available for the technical stuff 🎉

---

*Last updated: May 2025*