# Leave Management System

## What is this project?
This is a full-stack web application designed to handle leave requests for a company. It provides a simple, functional interface for two types of users:
1. **Employees**: Can create an account, log in, apply for leaves (by providing dates and reasons), and see if their leaves are Pending, Approved, or Rejected.
2. **Employers**: Can create an account, log in, view a dashboard of all leave requests from employees, and choose to Approve or Reject them.

## Tech Stack
- **Frontend**: Vue.js 3, Vite, Tailwind CSS, Vue Router
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control

## Project Flow
1. **Authentication**: Users choose their role (`Employee` or `Employer`) when registering. A JWT token is generated on login to secure future requests.
2. **Employee Flow**: Employees access a protected dashboard. They fill out a modal to apply for leave. The backend strictly validates that the end date is after the start date and saves the request as `Pending`.
3. **Employer Flow**: Employers access a different protected dashboard. They see all employee requests. Clicking 'Approve' or 'Reject' updates the database, modifying the status the employee sees.

## File Structure
```
leave-management/
├── backend/                  # Node.js REST API
│   ├── controllers/          # Business logic for auth and leaves
│   ├── middleware/           # Protects routes using JWT
│   ├── models/               # MongoDB models (User, LeaveRequest)
│   ├── routes/               # Express API routing
│   ├── .env                  # Environment variables (Database URL, JWT Secret)
│   └── server.js             # Entry point and database connection
└── frontend/                 # Vue.js UI Application
    ├── src/                  
    │   ├── components/       # Shared UI parts (e.g. Navbar)
    │   ├── services/         # Axios API configuration
    │   ├── views/            # Dashboard and Auth pages
    │   └── main.js           # Vue entry point
    ├── index.html            # Main HTML file
    └── tailwind.config.js    # Styling configuration
```

## Environment Variables

For the application to function correctly in a production or permanent testing environment, you must set up the `backend/.env` file with the following variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | The port the backend server runs on | `5000` |
| `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key used to sign authentication tokens | `super_secret_jwt_key_here` |

*Note: If `MONGO_URI` is left blank or has the placeholder `<username>`, the app spins up a temporary in-memory database automatically.*

## API Endpoints

The backend exposes a RESTful API. Below are the core endpoints:

### Authentication (`/api/auth`)
- `POST /register`: Create a new user account (Requires `name`, `email`, `password`, `role`).
- `POST /login`: Authenticate an existing user and receive a JWT (Requires `email`, `password`).

### Leave Requests (`/api/leaves`)
- `POST /` (Protected, Employee): Apply for a new leave (Requires `leaveType`, `startDate`, `endDate`, `reason`).
- `GET /` (Protected):
  - **If Employee**: Returns only leaves applied for by the logged-in user.
  - **If Employer**: Returns all leave requests from all users.
- `PUT /:id/status` (Protected, Employer Only): Update the status of a specific leave request (Requires `status` as Pending, Approved, or Rejected). 

## How to Set It Up

**Prerequisites**: You must have Node.js installed.

### 1. Setup the Backend
Open a terminal and run the following commands:
```bash
cd backend
npm install
npm run dev
```

### 2. Setup the Frontend
Open a **new** terminal window and run:
```bash
cd frontend
npm install
npm run dev
```

### 3. Use the App
Open your browser and navigate to `http://localhost:5173/`. You are ready to start testing the employee and employer flows!

## Deployment

To deploy this application to production:

1. **Database**: Create a free MongoDB Atlas cluster and get your connection string.
2. **Backend**: Host the `backend/` folder on a service like Render, Heroku, or Vercel (using serverless functions). Make sure to set `MONGO_URI` and `JWT_SECRET` in the host's environment variables settings.
3. **Frontend**: Build the frontend (`cd frontend && npm run build`) and host the resulting `dist/` folder on a static hosting service like Vercel, Netlify, or GitHub Pages.
   - *Important:* Before building the frontend, ensure the `baseURL` in `frontend/src/services/api.js` points to your LIVE backend URL instead of `http://localhost:5000`.

**Live Demo:** *(Insert your deployed frontend link here once hosted!)*
