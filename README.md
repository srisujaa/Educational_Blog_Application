# Online Educational Website

A MERN stack-based educational platform that allows users to browse courses, enroll in them, and manage their learning journey.

## Features

- User Authentication (Login/Signup)
- Course Management
- Blog System
- User Profile Management
- Course Enrollment System

## Tech Stack

- Frontend:
  - React.js
  - React Router
  - Axios
  - CSS3

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## Getting Started

1. Clone the repository
```bash
git clone [your-repo-url]
cd Online-Educational-Website
```

2. Install dependencies
```bash
# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install
```

3. Set up environment variables
Create a `.env` file in the Backend directory with:
```
MONGO_URI=mongodb://localhost:27017/educational-website
JWT_SECRET=your_jwt_secret_key
```

4. Run the application
```bash
# Start Backend server (from Backend directory)
npm start

# Start Frontend development server (from Frontend directory)
npm start
```

The backend will run on http://localhost:5001 and the frontend on http://localhost:3000

## Project Structure

```
├── Backend/
│   ├── models/
│   ├── uploads/
│   └── index.js
└── Frontend/
    ├── public/
    └── src/
        ├── components/
        ├── assets/
        └── App.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
