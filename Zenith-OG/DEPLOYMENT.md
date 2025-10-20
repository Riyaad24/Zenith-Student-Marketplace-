# Zenith Student Marketplace - Deployment Guide

## 🚀 Production Deployment Steps

### 1. Database Setup (Choose One)

#### Option A: PlanetScale (Recommended)
1. Go to [planetscale.com](https://planetscale.com)
2. Create account and new database
3. Get connection string
4. Update DATABASE_URL in production

#### Option B: Railway MySQL
1. Go to [railway.app](https://railway.app)
2. Create MySQL database
3. Get connection string

#### Option C: DigitalOcean Managed Database
1. Create DigitalOcean account
2. Set up managed MySQL database
3. Configure connection

### 2. Deployment Platform (Choose One)

#### Option A: Vercel (Easiest for Next.js)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Connect custom domain

#### Option B: Netlify
1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Set up custom domain

#### Option C: DigitalOcean App Platform
1. Create app from GitHub
2. Configure environment
3. Set up custom domain

### 3. Domain Configuration

#### For GoDaddy Domain:
1. Get deployment URL from your platform
2. Go to GoDaddy DNS Management
3. Add CNAME record pointing to deployment URL
4. Wait for DNS propagation (up to 48 hours)

### 4. Environment Variables for Production

```bash
# Production Environment Variables
DATABASE_URL="your-production-mysql-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-strong-secret"
NODE_ENV="production"
```

### 5. Build Configuration

Make sure your package.json has proper build scripts:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "postbuild": "prisma generate"
  }
}
```

## 🔧 Pre-Deployment Checklist

- [ ] Database created and accessible
- [ ] Environment variables configured
- [ ] Code pushed to GitHub
- [ ] Domain DNS settings ready
- [ ] SSL certificate (automatic with most platforms)
- [ ] Build process tested locally

## 📞 Support

For deployment assistance, check platform-specific docs:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- DigitalOcean: https://docs.digitalocean.com