# 🛒 GreenKart

**An Eco-Friendly E-commerce Platform with AI-Powered Recommendations**

GreenKart is a full-stack e-commerce application focused on sustainable and eco-friendly products. The platform features a modern React frontend, Node.js/Express backend, and a Python-based AI service for intelligent product recommendations.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)

---

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### AI Service
- **Python 3** - Programming language
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server

---

## 📁 Project Structure

```
greenkart/
│
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   ├── Footer.jsx    # Footer component
│   │   │   └── Layout.jsx    # Layout wrapper
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Login.jsx     # Login page (UI only)
│   │   │   └── Products.jsx  # Products listing
│   │   ├── App.jsx           # Root component
│   │   └── index.css         # Tailwind styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js/Express backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   └── healthController.js
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling
│   ├── models/
│   │   └── Product.js        # Product schema
│   ├── routes/
│   │   ├── index.js          # Route aggregator
│   │   └── healthRoutes.js   # Health check routes
│   ├── server.js             # Express server entry
│   ├── package.json
│   └── .env.example
│
├── ai-service/               # Python ML service
│   ├── app.py                # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── .env.example
│
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://python.org/)
- **MongoDB** (local or cloud) - [Download](https://mongodb.com/)
- **Git** - [Download](https://git-scm.com/)

### Clone the Repository

```bash
git clone <repository-url>
cd greenkart
```

---

## 🏃 Running the Application

### 1. Frontend (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

### 2. Backend (Node.js + Express)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/greenkart

# Start development server (with auto-reload)
npm run dev

# OR start production server
npm start
```

The backend will be available at: **http://localhost:5000**

---

### 3. AI Service (Python + FastAPI)

```bash
# Navigate to ai-service directory
cd ai-service

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app:app --reload --port 8000

# OR run directly with Python
python app.py
```

The AI service will be available at: **http://localhost:8000**

---

## 📡 API Endpoints

### Backend API (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/api/health` | Health check endpoint |

### AI Service (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Health check endpoint |
| GET | `/api/recommendations` | Product recommendations (placeholder) |
| GET | `/api/classify` | Product classification (placeholder) |

---

## 🧪 Testing the Setup

After starting all services, verify they're running:

```bash
# Test Backend
curl http://localhost:5000/api/health

# Test AI Service
curl http://localhost:8000/health
```

---

## 📝 Development Notes

### Current Status (Step 1)
- ✅ Project structure created
- ✅ Frontend with React + Tailwind
- ✅ Backend with Express + MongoDB
- ✅ AI service with FastAPI
- ✅ Basic routing and health checks
- ⏳ Authentication (coming in Step 2)
- ⏳ Product CRUD (coming in Step 2)
- ⏳ ML models (coming in later steps)

### Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/greenkart
FRONTEND_URL=http://localhost:5173
```

**AI Service (.env)**
```
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

GreenKart - Final Year Project

---

**Happy Coding! 🌱**
