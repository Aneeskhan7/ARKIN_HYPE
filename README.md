# Product Review and Reward System

A Node.js-based web application that allows users to add reviews for products, earn rewards, and request balance withdrawals. The application features an admin panel where admins can manage users, categories, products, and approve user requests.

## Features

### User Features
- **Add Reviews**: Users can add reviews to products and earn rewards based on the product's review percentage.
- **Rewards & Balance**: Users earn rewards that contribute to their balance and total balance. Users can also monitor their trial balance and trial rewards.
- **Withdraw Requests**: Users can request to withdraw their balance, which admins can approve or reject.

### Admin Features
- **Approve Users**: Admins can approve or reject user registrations.
- **Manage Categories & Products**: Admins can create and manage categories, and assign products to these categories.
- **Handle Withdraw Requests**: Admins can view and approve or reject user balance withdrawal requests.

## Project Structure

```plaintext
e-commerce-system/
│
├── controllers/
│   ├── userController.js       # Handles user-related actions like registration, login, profile management, review submission, etc.
│   ├── adminController.js      # Handles admin actions like approving users, managing categories, approving withdrawal requests, etc.
│   ├── productController.js    # Manages product-related actions, including category management and product creation
│   └── reviewController.js     # Manages review-related actions, including reward calculations
│
├── models/
│   ├── userModel.js            # User schema and model with fields for balance, rewards, etc.
│   ├── productModel.js         # Product schema and model, includes category management
│   ├── reviewModel.js          # Review schema and model, manages reviews, ratings, and associated rewards
│   └── withdrawalModel.js      # Withdrawal schema and model, tracks user withdrawal requests
│
├── routes/
│   ├── userRoutes.js           # Routes for user-related actions (e.g., signup, login, review submission)
│   ├── adminRoutes.js          # Routes for admin-related actions (e.g., approving users, managing categories)
│   ├── productRoutes.js        # Routes for product management, including categories and reviews
│   └── withdrawalRoutes.js     # Routes for handling withdrawal requests by users and approval by admins
│
├── public/
│   ├── index.html              # Front-end HTML for users
│   ├── admin.html              # Front-end HTML for admins
│   ├── style.css               # Global styles
│   └── script.js               # Front-end logic for users
│
├── views/
│   ├── userDashboard.ejs       # User dashboard template
│   ├── adminDashboard.ejs      # Admin dashboard template
│   ├── productList.ejs         # Template for displaying product lists
│   └── reviewList.ejs          # Template for displaying review lists
│
├── utils/
│   ├── apiFeatures.js          # Utility functions for API handling, filtering, sorting, etc.
│   └── appError.js             # Custom error handling
│
├── config/
│   ├── config.env              # Environment variables configuration
│   └── db.js                   # Database connection setup
│
├── middleware/
│   ├── authMiddleware.js       # Middleware for handling authentication and authorization
│   └── errorMiddleware.js      # Middleware for handling errors globally
│
├── tmp/                        # Temporary files and uploads
│
├── server.js                   # Main server file, entry point for the application
├── package.json                # NPM dependencies and scripts
└── .gitignore                  # Files and directories to be ignored by Git

Installation

    Clone the repository:

git clone https://github.com/your-username/e-commerce-system.git
cd e-commerce-system

Install dependencies:

npm install

Set up environment variables:
Create a .env file in the root of the project and add the following environment variables:

NODE_ENV=development
PORT=3000
DATABASE=<Your MongoDB connection string>
DATABASE_PASSWORD=<Your MongoDB password>
JWT_SECRET=<Your JWT secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=<Your email username>
EMAIL_HOST=smtp.gmail.com
EMAIL_PASSWORD=<Your email password>
SMTP_SERVICE=Gmail

Run the application:
npm start

Visit the application:
Open your browser and go to http://localhost:3000.
