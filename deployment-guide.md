# 🚀 Vistagram Deployment Guide

This guide walks you through deploying your Vistagram MERN stack application to production.

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] MongoDB Atlas account (for production database)
- [ ] Cloudinary account (for image storage)
- [ ] GitHub repository with your code
- [ ] Deployment platform accounts (Render, Vercel, etc.)

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Note your connection string

2. **Configure Database Access**
   - Create a database user
   - Allow access from all IP addresses (0.0.0.0/0) for production
   - Get your connection string

## 🖼️ Image Storage Setup (Cloudinary)

1. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com)
   - Sign up for free account
   - Note your Cloud Name, API Key, and API Secret

## 🎯 Backend Deployment (Render)

### Option 1: Deploy to Render

1. **Prepare for Deployment**
   ```bash
   # Ensure your backend has a start script in package.json
   "scripts": {
     "start": "node server.js"
   }
   ```

2. **Create Render Service**
   - Go to [Render](https://render.com)
   - Connect your GitHub repository
   - Create a new Web Service
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`

3. **Environment Variables**
   Set these in Render dashboard:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vistagram
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```

### Option 2: Deploy to Railway

1. **Connect GitHub**
   - Go to [Railway](https://railway.app)
   - Connect GitHub repository
   - Deploy from `backend` folder

2. **Set Environment Variables** (same as above)

3. **Configure Build**
   - Railway should auto-detect Node.js
   - Ensure start command is correct

### Option 3: Deploy to Fly.io

1. **Install Fly CLI**
   ```bash
   # Install flyctl
   curl -L https://fly.io/install.sh | sh
   ```

2. **Initialize and Deploy**
   ```bash
   cd backend
   fly auth login
   fly init
   fly deploy
   ```

## 🌐 Frontend Deployment (Vercel)

### Deploy to Vercel

1. **Prepare Frontend**
   Create `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Set build command: `npm run build`
   - Set output directory: `build`

3. **Environment Variables**
   Set in Vercel dashboard:
   ```env
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   ```

### Alternative: Deploy to Netlify

1. **Build and Deploy**
   - Go to [Netlify](https://netlify.com)
   - Connect GitHub repository
   - Set build directory: `frontend`
   - Set build command: `npm run build`
   - Set publish directory: `frontend/build`

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

Update your backend's CORS configuration with your actual frontend URLs:

```javascript
// backend/middleware/corsMiddleware.js
const allowedOrigins = [
  'https://your-actual-frontend-domain.vercel.app',
  'https://your-actual-frontend-domain.netlify.app'
];
```

### 2. Test Your Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-backend-app.onrender.com/api/health
   ```

2. **Frontend Functionality**
   - Visit your frontend URL
   - Test creating a post
   - Test liking and sharing
   - Verify image uploads work

### 3. Seed Production Database

```bash
# Run this once to populate your production database
# Update your .env with production MongoDB URI first
npm run seed
```

## 🔒 Security Checklist

- [ ] Environment variables are set correctly
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] File upload limits are set
- [ ] HTTPS is enabled (automatic on most platforms)

## 📊 Monitoring and Maintenance

1. **Monitor Application**
   - Check Render/Railway logs for errors
   - Monitor Cloudinary usage
   - Check MongoDB Atlas metrics

2. **Regular Maintenance**
   - Keep dependencies updated
   - Monitor error rates
   - Backup database periodically

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify frontend URL in backend CORS settings
   - Check environment variables

2. **Image Upload Fails**
   - Verify Cloudinary credentials
   - Check file size limits

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings

4. **Build Failures**
   - Ensure all dependencies are in package.json
   - Check Node.js version compatibility

## 📝 Final URLs

After successful deployment, you'll have:

- **Backend API**: `https://your-backend-app.onrender.com/api`
- **Frontend App**: `https://your-frontend-app.vercel.app`
- **Health Check**: `https://your-backend-app.onrender.com/api/health`

## 🎉 Success!

Your Vistagram app is now live! Share the frontend URL with users and start capturing those moments.

### 📱 PWA Features (Optional Enhancement)

To make your app installable on mobile devices, you can enable PWA features:

1. Update `frontend/public/manifest.json` with your app details
2. Add service worker for offline functionality
3. Configure app icons and splash screens

---

**Need help?** Check the logs in your deployment platforms or refer to their documentation.