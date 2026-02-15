# 🔒 Cryptozy — Private Backend Roadmap (You & Me Only)

> **How we work:**
> - You say **"tell me"** → I explain only
> - You say **"I want you" / "do it"** → I code it into the website

---

## 🏗️ TECH STACK (Confirmed)

| Layer | Service | Role |
|-------|---------|------|
| **Code** | GitHub | Repository, version control, CI/CD trigger |
| **Frontend** | Vercel | Hosts the React app, serverless API routes |
| **Backend** | Supabase | PostgreSQL database, Auth, Edge Functions, Storage |
| **Payments** | FaucetPay | Sends crypto to users |
| **Anti-Bot** | hCaptcha | Captcha protection + earns you money |

### Why This Stack Is Great:
- **No server to manage** — Vercel + Supabase are fully managed
- **Auto-deploy** — Push to GitHub → Vercel deploys automatically
- **PostgreSQL > MongoDB** for financial data (better integrity, relations)
- **Supabase Auth** = login/register with zero custom code
- **Row Level Security** = users can only see their own data
- **Free tiers** are very generous for starting out

---

## 📋 STATUS TRACKER

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | GitHub repo | ⬜ Waiting on you | Create repo, push code |
| 2 | Supabase project | ⬜ Waiting on you | You give me: Project URL + Anon Key |
| 3 | Vercel project | ⬜ Waiting on you | Connect to GitHub repo |
| 4 | Supabase Auth (Login/Register) | ⬜ Not Started | Built-in with Supabase |
| 5 | Database tables (SQL schema) | ⬜ Not Started | I give you SQL to run |
| 6 | FaucetPay integration | ⬜ Waiting on you | You give me API key |
| 7 | hCaptcha integration | ⬜ Waiting on you | You give me site key |
| 8 | Ad network integration | ⬜ Waiting on you | You give me ad unit codes |
| 9 | Shortlink API integration | ⬜ Waiting on you | You give me API token |
| 10 | Offer wall integration | ⬜ Waiting on you | You give me App ID |
| 11 | Anti-cheat system | ⬜ Not Started | |
| 12 | Admin dashboard | ⬜ Not Started | |
| 13 | Domain + DNS | ⬜ Waiting on you | Point domain to Vercel |

---

## STEP 1 — ACCOUNTS TO CREATE (Your homework)

### 🔴 CRITICAL (Without these, nothing works)

#### 1.1 — GitHub Repository
- **Go to:** https://github.com → New Repository
- **Do:** Create a repo called `cryptozy` (private or public, your choice)
- **Then:** Push the current code to it
- **Bring back:** Confirm it's done
- **Cost:** Free
- **Time:** 5 minutes

#### 1.2 — Supabase Project (Database + Auth + Backend)
- **Go to:** https://supabase.com
- **Do:** Create free account → New Project → Name it `cryptozy` → Set a DB password (save it!)
- **Bring back:** 
  - Project URL (looks like: `https://xxxxx.supabase.co`)
  - Anon/Public Key (found in Settings → API)
  - Service Role Key (for server-side, keep SECRET)
- **Cost:** Free (500MB DB, 50k monthly active users, 500k Edge Function invocations)
- **Time:** 5 minutes
- **⚠️ NEVER share the Service Role Key publicly — only in Vercel env vars**

#### 1.3 — Vercel Project (Frontend Hosting)
- **Go to:** https://vercel.com
- **Do:** Sign up with GitHub → Import your `cryptozy` repo → Deploy
- **Bring back:** Confirm it's deployed
- **Cost:** Free (100GB bandwidth, serverless functions included)
- **Time:** 5 minutes
- **✅ Bonus:** Every time you push to GitHub, Vercel auto-deploys

#### 1.4 — FaucetPay (Crypto Payments)
- **Go to:** https://faucetpay.io
- **Do:** Create account → Go to API Settings → Generate API key
- **Bring back:** API Key + your FaucetPay email
- **Cost:** Free to register. Deposit $10-20 of crypto (BTC/LTC/DOGE) to pay users
- **Time:** 10 minutes
- **⚠️ This is what actually sends crypto to your users**

#### 1.5 — hCaptcha (Anti-Bot + Earns You Money)
- **Go to:** https://www.hcaptcha.com
- **Do:** Create Publisher account → Add your site → Get keys
- **Bring back:** Site Key + Secret Key
- **Cost:** Free (they actually PAY YOU per captcha solved)
- **Time:** 5 minutes

---

### 🟡 HIGH PRIORITY (Revenue — how you make money)

#### 1.6 — A-Ads (Ad Network for crypto sites)
- **Go to:** https://a-ads.com
- **Do:** Create publisher account → Create ad unit → Get embed code
- **Bring back:** Ad Unit ID / embed code
- **Cost:** Free
- **Revenue:** You earn BTC every time users see/click ads

#### 1.7 — Exe.io or Shrinkme.io (Shortlink provider)
- **Exe.io:** https://exe.io
- **Shrinkme.io:** https://shrinkme.io
- **Do:** Create account → Go to API/Developer section → Get API token
- **Bring back:** API Token
- **Cost:** Free
- **Revenue:** You earn per link visit ($2-5 per 1000 views)

#### 1.8 — OfferToro (Offer Wall)
- **Go to:** https://www.offertoro.com
- **Do:** Create publisher account → Add your app/site → Get credentials
- **Bring back:** App ID + Secret Key
- **Cost:** Free
- **Revenue:** You earn 30-70% of offer value

---

### 🔵 LATER (After launch)

#### 1.9 — Domain Name
- **Where:** Namecheap, Cloudflare Registrar, or Porkbun
- **Suggestion:** cryptozy.io, cryptozy.co, getcryptozy.com
- **Cost:** $10-30/year
- **Then:** Point DNS to Vercel (I'll guide you)

#### 1.10 — Cloudflare (CDN + DDoS Protection)
- **Go to:** https://cloudflare.com
- **Do:** Free account → Point your domain nameservers
- **Cost:** Free

#### 1.11 — Resend (Email service for notifications)
- **Go to:** https://resend.com
- **Do:** Create account → Get API key
- **Bring back:** API Key
- **Cost:** Free (100 emails/day)

---

## STEP 2 — WHAT I BUILD (In Order)

### Phase A: Foundation (Once you have Supabase + Vercel)
- [ ] Install Supabase client in the React app
- [ ] Create SQL schema (users, balances, transactions, referrals, withdrawals)
- [ ] Supabase Auth: Register / Login / Logout pages
- [ ] Protected routes (must be logged in to earn)
- [ ] User profile with real balance from database
- [ ] Environment variables setup guide for Vercel

### Phase B: Real Earning Systems
- [ ] PTC ads: real ad viewing with DB-tracked cooldowns + hCaptcha
- [ ] Shortlink API: real shortened links that pay you
- [ ] Offer wall iframe + postback endpoint (auto-credits users)
- [ ] Mining: earnings tracked in DB with server-side validation

### Phase C: Payments
- [ ] FaucetPay withdrawal via Vercel serverless API route
- [ ] Minimum withdrawal thresholds
- [ ] Transaction history stored in Supabase
- [ ] Low-balance alerts

### Phase D: Security & Anti-Cheat
- [ ] Supabase Row Level Security (users see only their own data)
- [ ] Rate limiting via Edge Functions
- [ ] IP tracking + daily claim limits
- [ ] Cooldown timers stored server-side (can't cheat by changing clock)
- [ ] VPN/proxy detection
- [ ] Browser fingerprinting

### Phase E: Admin Panel
- [ ] Admin role in Supabase (special user flag)
- [ ] Admin dashboard: user list, total payouts, revenue tracking
- [ ] Ability to ban users, adjust balances, change reward amounts
- [ ] System settings stored in DB

### Phase F: Polish
- [ ] Email verification (Resend)
- [ ] Custom domain on Vercel
- [ ] Cloudflare DDoS protection
- [ ] Analytics & monitoring
- [ ] SEO optimization

---

## 🔐 ENVIRONMENT VARIABLES (Where keys go)

### In Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...          ← SECRET, server-only
FAUCETPAY_API_KEY=your_faucetpay_key           ← SECRET, server-only
HCAPTCHA_SECRET_KEY=0x...                       ← SECRET, server-only
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=xxxxxxx          ← Public, OK to expose
```

> **Rule:** Anything with `NEXT_PUBLIC_` prefix is visible to users (OK for site keys).
> Everything else stays server-side only (Vercel serverless functions).
> Since we use Vite, we'll use `VITE_` prefix instead of `NEXT_PUBLIC_`.

---

## 💰 BUSINESS MODEL SUMMARY

```
YOUR REVENUE:
├── A-Ads: ~$2-8 per 1000 ad impressions
├── Shortlinks: ~$2-5 per 1000 link visits
├── Offer Walls: 30-70% commission on completions
├── hCaptcha: ~$0.50-2 per 1000 solves
└── CPU Mining: you keep a % of hash power

YOUR COSTS:
├── User payouts via FaucetPay
├── Supabase: Free (up to 500MB + 50k users)
├── Vercel: Free (up to 100GB bandwidth)
├── GitHub: Free
└── Domain: $10-30/year (optional at start)

PROFIT = Revenue - Payouts
Rule of thumb: Pay users 40-60% of what you earn
```

---

## 🚨 RISKS & HOW TO HANDLE THEM

| Risk | Impact | Solution |
|------|--------|----------|
| Bots farming your site | Lose money fast | hCaptcha + IP limits + fingerprinting |
| Paying more than you earn | Bankruptcy | Set low reward amounts, monitor daily |
| Users using VPN to multi-account | Lost revenue | VPN detection + account verification |
| Ad network bans you | No revenue | Use multiple ad networks as backup |
| FaucetPay runs out of balance | Can't pay users | Set up low-balance alerts, auto-pause withdrawals |
| DDoS attacks | Site goes down | Cloudflare free protection |
| Supabase free tier limits | DB full | Monitor usage, upgrade when earning revenue |

---

## ✅ NEXT ACTION

**Your move:** Create these 3 accounts in order:
1. **GitHub** → Create `cryptozy` repo
2. **Supabase** → Create project, bring me URL + Anon Key
3. **Vercel** → Connect to GitHub repo

**Come back and say:** "I have [service] ready, here's [info]"
**I will:** Immediately build that integration into the website.

We go step by step. No rushing. 🚀
