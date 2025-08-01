# 🚀 Vistagram Setup Guide

## Quick Start

### Option 1: Automated Setup (Recommended)
```bash
./setup.sh
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   # Install all dependencies
   npm run install-deps
   
   # Or install separately
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment examples
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Configure Backend Environment**
   Edit `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/vistagram
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (recommended for production)
   ```

5. **Seed Database**
   ```bash
   npm run seed
   ```

6. **Start Application**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start separately
   npm run server  # Backend (port 5000)
   npm run client  # Frontend (port 3000)
   ```

## 🛠️ Development Scripts

```bash
# Install dependencies for both backend and frontend
npm run install-deps

# Start both servers in development mode
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Seed database with sample data
npm run seed

# Build frontend for production
npm run build
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📝 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/vistagram

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔧 Prerequisites

- **Node.js**: Version 14 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Cloudinary Account**: For image storage (free tier available)

## 📁 Project Structure

```
Vistagramm/
├── backend/                 # Express.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   └── server.js          # Main server file
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/               # React components
│   └── package.json       # Frontend dependencies
├── package.json           # Root package file
├── setup.sh              # Automated setup script
└── README.md             # Documentation
```

## 🚀 Deployment

See `deployment-guide.md` for detailed deployment instructions to:
- **Backend**: Render, Railway, or Fly.io
- **Frontend**: Vercel or Netlify
- **Database**: MongoDB Atlas
- **Images**: Cloudinary

## ✨ Features

- **Photo Upload**: Camera capture or file upload
- **Timeline Feed**: Reverse chronological posts
- **Like System**: Toggle likes with persistent counts
- **Share System**: Share posts with URL generation
- **Responsive Design**: Mobile-friendly interface
- **Cloud Storage**: Cloudinary integration
- **Real-time**: Live like/share count updates

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running: `mongod`
   - Verify connection string in .env

2. **Cloudinary Upload Error**
   - Verify credentials in backend/.env
   - Check Cloudinary dashboard

3. **CORS Error**
   - Ensure frontend URL matches in backend CORS config
   - Check environment variables

4. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

### Getting Help

1. Check the console for error messages
2. Review the `backend/server.js` logs
3. Verify all environment variables are set
4. Ensure all dependencies are installed

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/posts` | Get timeline posts |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts/:id/like` | Toggle like |
| POST | `/api/posts/:id/share` | Share post |

### Example API Calls

```javascript
// Get posts
fetch('/api/posts')

// Create post
const formData = new FormData();
formData.append('username', 'john_doe');
formData.append('caption', 'Beautiful sunset!');
formData.append('image', imageFile);

fetch('/api/posts', {
  method: 'POST',
  body: formData
})

// Toggle like
fetch('/api/posts/POST_ID/like', { method: 'POST' })
```

## 🎯 Next Steps

1. **Setup Complete**: Follow the setup steps above
2. **Development**: Start building features
3. **Deployment**: Use the deployment guide
4. **Enhancements**: Add authentication, comments, etc.

---

**Ready to start?** Run `./setup.sh` and begin building!