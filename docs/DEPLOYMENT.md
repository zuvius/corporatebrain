# Corporate Brain - Deployment Guide

A beginner-friendly guide to deploying the Corporate Brain application on **Localhost** (development), **Vercel** (serverless), and **VPS** (self-hosted).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option A: Local Development (Docker)](#option-a-local-development-docker)
3. [Option B: Vercel Deployment](#option-b-vercel-deployment)
4. [Option C: VPS Deployment](#option-c-vps-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have the following installed:

### For All Deployments:

- **Git** - To clone the repository
- **Node.js 18+** - JavaScript runtime ([Download](https://nodejs.org/))
- **npm** or **pnpm** - Package manager (comes with Node.js)

### For Local Development:

- **Docker Desktop** - Container platform ([Download](https://www.docker.com/products/docker-desktop/))
- **Docker Compose** - Usually included with Docker Desktop

### For VPS Deployment:

- **SSH access** to your VPS server
- **Domain name** (optional but recommended)

---

## Option A: Local Development (Docker)

The easiest way to run Corporate Brain locally for development and testing.

### Step 1: Clone the Repository

**Option A: Using Docker (Recommended for beginners)**
Docker provides a complete, isolated environment with PostgreSQL, Redis, and the app pre-configured. This is the easiest way to get started.

**Option B: Without Docker (If you already have PostgreSQL installed)**
If you have PostgreSQL 17+ with pgvector extension already installed locally, you can run the app directly.

```bash
# Open your terminal (Command Prompt, PowerShell, or Terminal)
# Navigate to where you want to store the project
cd Documents

# Clone the repository
git clone https://github.com/your-org/corporate-brain.git

# Enter the project directory
cd corporate-brain
```

### Step 2: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Open .env.local in your text editor and add your API keys
```

**Minimum required variables for local development:**

```bash
# .env.local

# Database (PostgreSQL running in Docker)
# Note: Using port 5433 to avoid conflicts with other PostgreSQL instances
DATABASE_URL="postgresql://corp_brain:corpbrain123@localhost:5433/corporate_brain"

# Authentication (Auth.js v5) - generate a random secret
AUTH_URL="http://localhost:3004"
AUTH_SECRET="your-super-secret-random-string-here"
AUTH_TRUST_HOST=true

# AI Providers (add at least one)
OPENAI_API_KEY="sk-your-openai-key"
# OR
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
# OR
GOOGLE_AI_API_KEY="your-gemini-key"

# Redis & Queue (optional - for caching and background jobs)
# Option A: Local Redis (if using Docker)
REDIS_URL="redis://localhost:6379"
# Option B: Upstash (for serverless/production)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
# Option C: Upstash QStash (for background job queues)
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN=""
QSTASH_CURRENT_SIGNING_KEY=""
QSTASH_NEXT_SIGNING_KEY=""
```

**Important: PostgreSQL Password with Special Characters**

If your PostgreSQL password contains special characters (`@`, `#`, `$`, `%`, `&`, `+`, `/`, `:`, `?`), you must URL-encode them in the `DATABASE_URL`:

| Character | URL-Encoded |
| --------- | ----------- |
| `@`       | `%40`       |
| `#`       | `%23`       |
| `$`       | `%24`       |
| `%`       | `%25`       |
| `&`       | `%26`       |
| `+`       | `%2B`       |
| `/`       | `%2F`       |
| `:`       | `%3A`       |
| `?`       | `%3F`       |

**Example:**

```bash
# If password is: P@ss#w0rd$2024
# Encode as: P%40ss%23w0rd%242024

DATABASE_URL="postgresql://brainuser:P%40ss%23w0rd%242024@localhost:5432/corporate_brain"
```

**Quick command to encode your password:**

```bash
node -e "console.log(encodeURIComponent('your-password-here'))"
```

**How to generate a random secret (32 characters):**

```bash
# Run this command and copy the output
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

**For enhanced security (64 characters):**

```bash
# Run this command for a 64-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Start Docker Services (If using Docker)

**If NOT using Docker:** Skip to Step 4 and ensure you have PostgreSQL 17+ with pgvector extension installed locally.

```bash
# Start PostgreSQL and Redis containers
docker-compose up -d

# Wait 30 seconds for services to initialize
# Check if containers are running
docker-compose ps
```

**Docker Compose Configuration:**

The `docker-compose.yml` includes healthcheck configuration for PostgreSQL:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U corp_brain -d corporate_brain"]
  interval: 5s
  timeout: 5s
  retries: 5
```

**You should see:**

- `postgres` container running on port 5432 (container) mapped to 5433 (host)
- `redis` container running on port 6379

**Verify Docker containers are working:**

```bash
# 1. Check containers are running
docker ps

# 2. Test PostgreSQL connection
docker exec corporate-brain-db pg_isready
# Should say: "accepting connections"

# 3. Test Redis connection
docker exec corporate-brain-redis redis-cli ping
# Should say: "PONG"
```

### Step 4: Install Dependencies

```bash
# Install Node.js packages
npm install

# Or if using pnpm
pnpm install
```

### Step 4: Set Up PostgreSQL with pgvector

**If using Docker:**
The Docker setup automatically includes PostgreSQL with pgvector. Proceed to Step 5.

**If NOT using Docker (local PostgreSQL):**

```bash
# Install pgvector extension (required for vector search)

# On Windows:
# Option 1: Use Docker (Recommended for Windows - see Docker instructions above)
# Option 2: Install PostgreSQL with pgvector manually:

# Step 1: Download PostgreSQL 17+ installer from https://www.postgresql.org/download/windows/
# Step 2: During installation, note the password you set for 'postgres' user
# Step 3: Download pgvector Windows build from https://github.com/pgvector/pgvector/releases
# Step 4: Extract pgvector files to PostgreSQL's extension folder:
#   C:\Program Files\PostgreSQL\17\share\extension\
#   C:\Program Files\PostgreSQL\17\lib\

# Step 5: Open psql and create extension
psql -U postgres -d corporate_brain -c "CREATE EXTENSION IF NOT EXISTS vector;"

# On macOS with Homebrew:
brew install pgvector

# On Ubuntu/Debian (use your installed PostgreSQL version):
apt install postgresql-17-pgvector

# Connect to PostgreSQL and create extension
psql -U postgres -d corporate_brain -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

**Alternative for Windows (Easiest):**

```bash
# Use WSL2 (Windows Subsystem for Linux)
# 1. Install WSL2: wsl --install
# 2. Install Ubuntu from Microsoft Store
# 3. Inside WSL2, follow the Ubuntu/Debian instructions above
```

**Verify pgvector is installed:**

```bash
psql -U postgres -d corporate_brain -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
```

### Step 5: Run Database Migrations

```bash
# Push database schema (creates tables)
npx drizzle-kit push

# Note: Using 'push' instead of deprecated 'push:pg' command
```

### Step 6: Seed the Database (Optional)

```bash
# Add sample data and admin user
npm run db:seed

# Default login after seeding:
# Email: admin@example.com
# Password: password123
```

### Step 7: Start the Development Server

```bash
# Start the Next.js development server
npm run dev

# Or with pnpm
pnpm dev
```

**Wait for the message:**

```
> Ready on http://localhost:3000
```

### Step 7: Open in Browser

Navigate to: **http://localhost:3000**

**Default login credentials (if seeded):**

- Email: `admin@example.com`
- Password: `password123`

### Useful Local Development Commands

```bash
# Start Docker containers
docker-compose up -d

# Stop Docker containers
docker-compose down

# View container logs
docker-compose logs -f

# Reset database (caution: deletes all data)
docker-compose down -v
docker-compose up -d
npx drizzle-kit push:pg

# Update dependencies
npm update

# Stop dev server (when running)
# Press Ctrl+C in terminal
```

### Running Multiple Projects with Docker

If you want to run multiple projects simultaneously, change ports to avoid conflicts:

```bash
# Project 1 - Corporate Brain (uses port 5433 to avoid conflicts)
cd "C:\project1"
docker-compose up -d  # Uses ports 5433, 6379, 3000

# Project 2 - Another app
cd "C:\project2"
# Edit docker-compose.yml to change ports:
#   ports:
#     - "5434:5432"  # PostgreSQL on 5434 instead of 5433
#     - "6380:6379"  # Redis on 6380 instead of 6379
docker-compose up -d
```

**Why port 5433?** The default PostgreSQL port 5432 is often already in use by:

- Another Docker container
- Locally installed PostgreSQL
- Another development project

Using port 5433 prevents `28P01` authentication errors caused by connecting to the wrong PostgreSQL instance.

---

## Option B: Vercel Deployment

Deploy to Vercel for a production-ready, serverless environment with automatic scaling.

### Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub, GitLab, or Bitbucket.

```bash
# If you haven't already, push to a git repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/corporate-brain.git
git push -u origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub/GitLab/Bitbucket account
3. Click **"Add New Project"**

### Step 3: Import Project

1. Select your `corporate-brain` repository
2. Click **"Import"**
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `next build`
   - **Output Directory:** `.next`

### Step 4: Add Environment Variables

In the Vercel dashboard, go to **Settings > Environment Variables** and add:

| Variable                   | Value                             | Environment |
| -------------------------- | --------------------------------- | ----------- |
| `DATABASE_URL`             | Your PostgreSQL connection string | Production  |
| `AUTH_SECRET`              | Random 32-character string        | Production  |
| `AUTH_URL`                 | Your Vercel deployment URL        | Production  |
| `OPENAI_API_KEY`           | Your OpenAI API key               | Production  |
| `ANTHROPIC_API_KEY`        | Your Anthropic API key (optional) | Production  |
| `GOOGLE_AI_API_KEY`        | Your Google AI API key (optional) | Production  |
| `UPSTASH_REDIS_REST_URL`   | Your Redis URL (optional)         | Production  |
| `UPSTASH_REDIS_REST_TOKEN` | Your Redis token (optional)       | Production  |

**For database, you need a hosted PostgreSQL:**

- **Option 1:** [Neon](https://neon.tech) - Serverless PostgreSQL (Recommended)
- **Option 2:** [Supabase](https://supabase.com) - Free tier available
- **Option 3:** [Railway](https://railway.app) - Easy setup

**For caching and queues, you need Redis/Upstash:**

- **Option 1:** [Upstash](https://upstash.com) - Serverless Redis (Recommended for Vercel)
  - Create account, create Redis database, copy REST URL and token
  - Also create QStash for background job queues (optional)
- **Option 2:** [Redis Cloud](https://redis.com/try-free/) - Free tier available
- **Option 3:** Self-hosted Redis (see VPS section)

**How to get Neon Database URL:**

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string: `postgresql://user:password@host/dbname`
4. Add to Vercel environment variables

### Step 5: Configure Build Settings

Create/update `vercel.json` in your project root:

```json
{
  "buildCommand": "next build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Step 6: Deploy

1. Click **"Deploy"** in Vercel dashboard
2. Wait for build to complete (2-5 minutes)
3. Click the deployment URL to view your app

### Step 7: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings > Domains**
2. Add your domain (e.g., `corporatebrain.com`)
3. Follow DNS configuration instructions
4. Update `AUTH_URL` to your custom domain

### Step 8: Run Database Migrations

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Run migrations on production database
vercel env pull .env.production.local
npx drizzle-kit push:pg
```

### Automatic Deployments

Vercel automatically deploys when you push to your repository:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys
```

---

## Option C: VPS Deployment

Deploy to your own Virtual Private Server for full control and data sovereignty.

### Recommended VPS Providers

- **DigitalOcean** - [digitalocean.com](https://digitalocean.com) (Ubuntu Droplet)
- **Linode** - [linode.com](https://linode.com)
- **AWS Lightsail** - [aws.amazon.com/lightsail](https://aws.amazon.com/lightsail)
- **Hetzner** - [hetzner.com](https://hetzner.com) (Europe)

**Recommended specs:** 2 vCPUs, 4GB RAM, 50GB SSD minimum

### Step 1: Set Up VPS

1. Create an Ubuntu 22.04 LTS server
2. Note the IP address (e.g., `192.168.1.100`)
3. Ensure ports 22 (SSH), 80 (HTTP), and 443 (HTTPS) are open

### Step 2: Connect to Server

```bash
# On your local machine, connect via SSH
ssh root@YOUR_SERVER_IP

# Example:
ssh root@192.168.1.100
```

### Step 3: Update System & Install Dependencies

```bash
# Update package lists
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Git
apt install -y git

# Install PostgreSQL (version 17 - latest stable)
apt install -y postgresql-17 postgresql-contrib-17

# Install pgvector extension for PostgreSQL 17
apt install -y postgresql-17-pgvector

# Install Redis
apt install -y redis-server

# Install Nginx (web server)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2

# Verify installations
node --version  # Should show v18.x.x
npm --version
psql --version
```

### Step 4: Set Up PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, create database and user
CREATE DATABASE corporate_brain;
CREATE USER brainuser WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE corporate_brain TO brainuser;

# Create the vector extension (required for AI embeddings)
\c corporate_brain
CREATE EXTENSION IF NOT EXISTS vector;

\q

# Enable and start PostgreSQL service
systemctl enable postgresql
systemctl start postgresql
```

### Step 5: Set Up Redis

```bash
# Edit Redis configuration
nano /etc/redis/redis.conf

# Find and update these lines:
bind 127.0.0.1
protected-mode yes

# Restart Redis
systemctl restart redis-server
systemctl enable redis-server
```

### Step 6: Clone & Configure Application

```bash
# Create app directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/your-org/corporate-brain.git
cd corporate-brain

# Install dependencies
npm install

# Create environment file
nano .env.local
```

**Paste this configuration (update with your values):**

```bash
# .env.local
NODE_ENV=production

# Database
DATABASE_URL="postgresql://brainuser:your_secure_password@localhost:5432/corporate_brain"

# Authentication (Auth.js v5)
AUTH_URL="https://your-domain.com"
AUTH_SECRET="your-super-secret-random-string-here"

# AI Providers
OPENAI_API_KEY="sk-your-openai-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
GOOGLE_AI_API_KEY="your-gemini-key"

# Redis (optional, for caching and background job queues)
REDIS_URL="redis://localhost:6379"
```

**Generate a secure secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 7: Build Application

```bash
# Run database migrations
npx drizzle-kit push:pg

# Build the application
npm run build
```

### Step 8: Configure PM2

```bash
# Create PM2 configuration
nano ecosystem.config.js
```

**Paste this configuration:**

```javascript
module.exports = {
  apps: [
    {
      name: "corporate-brain",
      cwd: "/var/www/corporate-brain",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/corporate-brain/err.log",
      out_file: "/var/log/corporate-brain/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
```

```bash
# Create log directory
mkdir -p /var/log/corporate-brain

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config to start on boot
pm2 save
pm2 startup systemd
```

### Step 9: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/corporate-brain
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/corporate-brain /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

### Step 10: Set Up SSL (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts (enter email, agree to terms)
# Certbot automatically configures Nginx for HTTPS

# Test auto-renewal
certbot renew --dry-run
```

### Step 11: Configure Firewall

```bash
# Install UFW (Uncomplicated Firewall)
apt install -y ufw

# Allow necessary ports
ufw allow ssh      # Port 22
ufw allow http     # Port 80
ufw allow https    # Port 443

# Enable firewall
ufw enable

# Check status
ufw status
```

### Step 12: Set Up Automatic Updates (Optional)

```bash
# Install unattended upgrades
apt install -y unattended-upgrades

# Enable automatic security updates
dpkg-reconfigure -plow unattended-upgrades
```

### Managing the VPS Deployment

```bash
# View application logs
pm2 logs corporate-brain

# Restart application
pm2 restart corporate-brain

# Stop application
pm2 stop corporate-brain

# Update application
cd /var/www/corporate-brain
git pull
npm install
npm run build
pm2 restart corporate-brain

# Monitor resources
pm2 monit

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### Local Development Issues

**Problem:** `docker-compose up` fails

```bash
# Solution: Check if Docker is running
docker ps

# If not running, start Docker Desktop
# Then try again:
docker-compose down
docker-compose up -d
```

**Problem:** Database connection errors

```bash
# Solution: Reset database
docker-compose down -v
docker-compose up -d
npx drizzle-kit push:pg
```

**Problem:** Port 3000 already in use

```bash
# Solution: Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

**Problem:** Docker port conflicts (running multiple projects)

```bash
# Solution: Change ports in docker-compose.yml for second project
# Change:
#   ports:
#     - "5433:5432"  # Use 5433 instead of 5432
#     - "6380:6379"  # Use 6380 instead of 6379
# Then update DATABASE_URL in .env.local accordingly
```

**Problem:** PostgreSQL connection fails with `28P01` password authentication error

```bash
# Root Cause: Another PostgreSQL instance already using port 5432

# Solution: Change to port 5433 in docker-compose.yml:
#   ports:
#     - "5433:5432"  # Host port 5433 → Container port 5432

# Then update .env DATABASE_URL to use port 5433:
# DATABASE_URL=postgresql://corp_brain:corpbrain123@localhost:5433/corporate_brain

# Also add to docker-compose.yml for trust authentication:
# environment:
#   POSTGRES_HOST_AUTH_METHOD: trust
```

### Vercel Deployment Issues

**Problem:** Build fails with "Module not found"

```bash
# Solution: Clear cache and redeploy
# In Vercel dashboard:
# Settings > Git > Redeploy with "Use existing Build Cache" unchecked
```

**Problem:** Database connection timeout

```bash
# Solution: Check DATABASE_URL format
# Must be: postgresql://user:pass@host:port/dbname
# Ensure database accepts connections from Vercel IPs
```

**Problem:** Environment variables not working

```bash
# Solution: Verify variables in Vercel dashboard
# Settings > Environment Variables
# Ensure they are set for "Production" environment
# Redeploy after adding variables
```

### VPS Deployment Issues

**Problem:** Cannot connect via SSH

```bash
# Solution: Check firewall and SSH service
# On server console:
systemctl status ssh
ufw allow ssh
systemctl restart ssh
```

**Problem:** 502 Bad Gateway (Nginx)

```bash
# Solution: Check if app is running
pm2 status
pm2 logs

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Ensure app is running on port 3000
curl http://localhost:3000
```

**Problem:** SSL certificate errors

```bash
# Solution: Renew certificate
certbot renew
systemctl restart nginx
```

**Problem:** Permission denied when running commands

```bash
# Solution: Use sudo or check ownership
sudo chown -R $USER:$USER /var/www/corporate-brain
```

---

## Quick Reference

### Environment Variables Checklist

| Variable                   | Local       | Vercel   | VPS        | Description                  |
| -------------------------- | ----------- | -------- | ---------- | ---------------------------- |
| `DATABASE_URL`             | ✅          | ✅       | ✅         | PostgreSQL connection        |
| `AUTH_SECRET`              | ✅          | ✅       | ✅         | Random 32-char string        |
| `AUTH_URL`                 | ✅          | ✅       | ✅         | Your domain URL              |
| `AUTH_TRUST_HOST`          | ✅          | ❌       | ❌         | Trust localhost (dev only)   |
| `OPENAI_API_KEY`           | ✅          | ✅       | ✅         | OpenAI API access            |
| `ANTHROPIC_API_KEY`        | Optional    | Optional | Optional   | Claude API access            |
| `GOOGLE_AI_API_KEY`        | Optional    | Optional | Optional   | Gemini API access            |
| `REDIS_URL`                | ✅ (Docker) | ❌       | ✅ (Local) | Self-hosted Redis connection |
| `UPSTASH_REDIS_REST_URL`   | Optional    | Optional | Optional   | Upstash Redis (serverless)   |
| `UPSTASH_REDIS_REST_TOKEN` | Optional    | Optional | Optional   | Upstash Redis auth token     |
| `QSTASH_URL`               | Optional    | Optional | Optional   | Upstash QStash (queue)       |
| `QSTASH_TOKEN`             | Optional    | Optional | Optional   | QStash auth token            |

### Common Commands

| Task                 | Command                             |
| -------------------- | ----------------------------------- |
| Start dev server     | `npm run dev`                       |
| Build for production | `npm run build`                     |
| Start production     | `npm start`                         |
| Run migrations       | `npx drizzle-kit push:pg`           |
| View logs            | `pm2 logs` or `docker-compose logs` |

---

## Need Help?

If you encounter issues not covered here:

1. Check the main documentation in `SCOPE_OF_WORK.md`
2. Review Next.js deployment docs: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. Check Docker documentation: [docs.docker.com](https://docs.docker.com)
4. Review Vercel docs: [vercel.com/docs](https://vercel.com/docs)

---

**Document Version:** 1.0  
**Last Updated:** April 2026
