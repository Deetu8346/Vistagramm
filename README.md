# 📸 Vistagram

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) social media application where users can share photos with captions, like posts, and share content.

## 🚀 Features

- **Image Upload**: Capture photos via camera or upload files
- **Post Creation**: Add captions to images and share posts
- **Timeline Feed**: View posts in reverse chronological order
- **Interactive Engagement**: Like/unlike posts with persistent counts
- **Social Sharing**: Share posts with incremented share counts
- **Responsive Design**: Mobile-friendly interface
- **Cloud Storage**: Images stored securely on Cloudinary

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Cloudinary** - Image storage and optimization
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Frontend
- **React.js** - User interface
- **Axios** - HTTP client
- **CSS3** - Styling
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
Vistagramm/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   └── postController.js
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validation.js
│   ├── models/
│   │   └── Post.js
│   ├── routes/
│   │   └── posts.js
│   ├── scripts/
│   │   └── seed.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   └── [React app structure]
├── package.json
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image storage)

### 1. Clone and Install
```bash
git clone <repository-url>
cd Vistagramm
npm run install-deps
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/vistagram

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Development
```bash
# Start both backend and frontend
npm run dev

# Or start individually
npm run server  # Backend only
npm run client  # Frontend only
```

## 📚 API Documentation

### Base URL: `http://localhost:5000/api`

#### Posts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get timeline posts (paginated) |
| POST | `/posts` | Create new post with image |
| GET | `/posts/:id` | Get single post by ID |
| POST | `/posts/:id/like` | Toggle like/unlike |
| POST | `/posts/:id/share` | Increment share count |

#### Example Requests

**Get Posts (Timeline)**
```javascript
GET /api/posts?page=1&limit=20
```

**Create Post**
```javascript
POST /api/posts
Content-Type: multipart/form-data

{
  "username": "john_doe",
  "caption": "Beautiful sunset today!",
  "image": [file]
}
```

**Toggle Like**
```javascript
POST /api/posts/:id/like
```

## 🗄️ Database Schema

### Post Model
```javascript
{
  username: String (required, 2-30 chars),
  imageUrl: String (required, valid image URL),
  caption: String (required, max 500 chars),
  timestamp: Date (default: now),
  likesCount: Number (default: 0),
  shareCount: Number (default: 0),
  likedBy: [String] (user identifiers),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Backend Deployment (Render/Railway/Fly.io)
1. link: https://vistagramm.onrender.com

### Frontend Deployment (Vercel/Netlify)
1. link: https://vistagramm-mtw1qljwn-deetu8346s-projects.vercel.app/

### Production Considerations
- Set `NODE_ENV=production`
- Configure proper CORS origins
- Use MongoDB Atlas for database
- Set up Cloudinary for image storage
- Enable HTTPS
- Configure rate limiting
- Set up monitoring and logging

## 🧪 Development Scripts

```bash
# Install all dependencies
npm run install-deps

# Development mode (both servers)
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Seed database
npm run seed

# Build frontend for production
npm run build

# Run tests (when implemented)
npm test
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - API call protection
- **Input Validation** - Data sanitization
- **File Upload Validation** - Image type checking
- **CORS Configuration** - Cross-origin protection
- **Error Handling** - Secure error responses

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using the MERN stack
