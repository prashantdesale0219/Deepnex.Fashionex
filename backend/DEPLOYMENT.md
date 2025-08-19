# Production Deployment Guide

## Render Deployment

### Prerequisites
1. MongoDB Atlas database setup
2. Environment variables configured
3. Git repository ready

### Environment Variables for Render

Set these environment variables in your Render dashboard:

```bash
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=https://your-frontend-domain.com

# Optional
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FITROOM_API_KEY=your-fitroom-api-key
```

### Render Configuration

1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Node Version**: 18.x or higher
4. **Environment**: Node

### Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Set environment variables in Render dashboard
4. Deploy the service

### Health Check

Your backend will be available at: `https://your-app-name.onrender.com`

Health check endpoint: `https://your-app-name.onrender.com/health`

### API Endpoints

All API endpoints will be available at:
- `https://your-app-name.onrender.com/api/auth/*`
- `https://your-app-name.onrender.com/api/models/*`
- `https://your-app-name.onrender.com/api/clothes/*`
- `https://your-app-name.onrender.com/api/tryon/*`

### Frontend Configuration

Update your frontend environment variables:
```bash
NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com
```

### Vercel Frontend Deployment

For Vercel deployment, ensure:
1. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
2. Update image URLs in components to use production backend
3. Ensure CORS includes your Vercel domain in backend

### Troubleshooting

1. **Database Connection**: Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. **CORS Issues**: Verify CLIENT_URL matches your frontend domain
3. **File Uploads**: Render has ephemeral storage, consider using cloud storage for production
4. **Cold Starts**: Free tier services may have cold start delays

### Production Checklist

- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] CORS origins updated
- [ ] JWT secret is secure
- [ ] Rate limiting configured
- [ ] Health check working
- [ ] API endpoints responding
- [ ] Frontend connected successfully