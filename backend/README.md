# FashionX Backend API

A powerful AI Virtual Try-On Platform backend built with Node.js, Express, and MongoDB. This backend provides comprehensive APIs for virtual clothing try-on functionality using FitRoom AI services.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password hashing
  - Profile management

- **Asset Management**
  - Model image upload and validation
  - Cloth image upload and validation
  - Result image storage
  - Metadata management
  - Soft delete functionality

- **Virtual Try-On**
  - Integration with FitRoom AI API
  - Single and combo try-on modes
  - HD processing support
  - Task status tracking
  - Retry mechanism for failed tasks

- **Admin Dashboard**
  - User management
  - Asset monitoring
  - Task analytics
  - System health monitoring

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer
- **Image Processing**: Sharp
- **Validation**: Joi
- **Security**: Helmet, bcryptjs, rate limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FashionX/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret
   - FitRoom API credentials
   - Other service configurations

4. **Create upload directories**
   ```bash
   mkdir -p uploads/models uploads/clothes uploads/results
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration (sends OTP to email)
- `POST /api/auth/login` - User login (requires email, password, and OTP)
- `POST /api/auth/request-otp` - Request OTP for login
- `POST /api/auth/resend-otp` - Resend OTP for verification
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Models
- `POST /api/models/upload` - Upload model image
- `GET /api/models` - Get user's model images
- `GET /api/models/:id` - Get model image by ID
- `DELETE /api/models/:id` - Delete model image

### Clothes
- `POST /api/clothes/upload` - Upload cloth image
- `POST /api/clothes/upload-multiple` - Upload multiple cloth images
- `GET /api/clothes` - Get user's cloth images
- `GET /api/clothes/:id` - Get cloth image by ID
- `PUT /api/clothes/:id` - Update cloth metadata
- `DELETE /api/clothes/:id` - Delete cloth image

### Try-On
- `POST /api/tryon` - Create try-on task
- `GET /api/tryon/list` - Get user's try-on tasks
- `GET /api/tryon/:id` - Get try-on task status
- `POST /api/tryon/:id/retry` - Retry failed task
- `DELETE /api/tryon/:id` - Delete try-on task

### Assets
- `GET /api/assets` - Get user's assets
- `GET /api/assets/stats` - Get asset statistics
- `GET /api/assets/:id` - Get asset by ID
- `PUT /api/assets/:id` - Update asset metadata
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/assets/:id/download` - Download asset

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/assets` - Get all assets
- `GET /api/admin/tasks` - Get all tasks
- `GET /api/admin/health` - System health

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/fashionx

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d

# FitRoom API
FITROOM_API_KEY=your-api-key
FITROOM_API_SECRET=your-api-secret
FITROOM_BASE_URL=https://api.fitroom.app

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── modelController.js   # Model management
│   ├── clothController.js   # Cloth management
│   ├── tryonController.js   # Try-on functionality
│   ├── assetController.js   # Asset management
│   └── adminController.js   # Admin functionality
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Error handling
│   ├── upload.js           # File upload handling
│   └── validation.js       # Request validation
├── models/
│   ├── User.js             # User schema
│   ├── Asset.js            # Asset schema
│   └── TryOnTask.js        # Try-on task schema
├── routes/
│   ├── auth.js             # Auth routes
│   ├── models.js           # Model routes
│   ├── clothes.js          # Cloth routes
│   ├── tryon.js            # Try-on routes
│   ├── assets.js           # Asset routes
│   └── admin.js            # Admin routes
├── services/
│   └── fitroomService.js   # FitRoom API integration
├── uploads/                # File storage
│   ├── models/
│   ├── clothes/
│   └── results/
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
└── server.js              # Entry point
```

## Security Features

- **Authentication**: JWT-based with secure cookie storage
- **Authorization**: Role-based access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation
- **File Security**: File type and size validation
- **Error Handling**: Secure error responses
- **CORS**: Configurable cross-origin resource sharing

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set secure JWT secret
   - Configure FitRoom API credentials

2. **Security Considerations**
   - Use HTTPS in production
   - Set secure CORS origins
   - Configure rate limiting
   - Set up proper logging
   - Use environment-specific secrets

3. **Performance**
   - Enable compression
   - Set up caching
   - Configure load balancing
   - Monitor resource usage

## API Documentation

For detailed API documentation, import the Postman collection or refer to the inline JSDoc comments in the controller files.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.