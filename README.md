# IEEE Backend

A Node.js Express backend API with MongoDB integration.

## Features

- Express.js server
- MongoDB database connection
- CORS enabled
- Environment variable configuration
- Sample API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd IEEE_Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/ieee_backend
NODE_ENV=development
```

4. Make sure MongoDB is running on your system or update the `MONGO_URI` to point to your MongoDB instance.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication Endpoints

#### Passwordless Email-OTP Login
- `POST /api/auth/send-login-otp` - Send OTP for passwordless login
  - Body: `{ "studentId": "string", "email": "string" }`
- `POST /api/auth/verify-login-otp` - Verify OTP and login directly
  - Body: `{ "studentId": "string", "email": "string", "otp": "string" }`
- `GET /api/auth/profile` - Get user profile (requires Bearer token)
- `PUT /api/auth/profile` - Update user profile (requires Bearer token)
  - Body: `{ "email": "string" }`
- `POST /api/auth/logout` - Logout user

### Sample Endpoints

- `POST /api/sample` - Create a new sample record
- `GET /api/sample` - Get all sample records

### Root Endpoint

- `GET /` - Health check endpoint

## Project Structure

```
IEEE_Backend/
├── config/
│   └── db.js          # Database connection configuration
├── models/
│   └── sample.js      # Sample model schema
├── route/
│   └── sampleroute.js # Sample API routes
├── index.js           # Main server file
├── package.json       # Dependencies and scripts
└── .env              # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `NODE_ENV` - Environment mode (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

ISC 