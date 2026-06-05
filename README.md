# 🔧 Puthankada Hardware - Backend API

Node.js/Express backend for Puthankada Hardware e-commerce platform.

## Features

- 🔐 JWT Authentication
- 👤 User management with roles
- 📦 Product CRUD operations
- 🏷️ Category and subcategory management
- 🎯 Banner management
- 🖼️ Image upload with Cloudinary
- 🔒 Role-based access control

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Passport
- **File Upload:** Multer, Cloudinary
- **Security:** Helmet, bcryptjs

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create `.env` file (already created):
   ```env
   MONGO_URI=mongodb://localhost:27017/puthankada-db
   JWT_SECRET=puthankada-jwt-secret-key
   NODE_ENV=development
   PORT=5001
   ```

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

4. **Clean old data (if needed):**
   ```bash
   node cleanup-database.js
   ```

5. **Create admin account:**
   ```bash
   node createAdmin.js
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```

## Admin Credentials

**Email:** admin@puthankada.com  
**Password:** puthankada123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Subcategories
- `GET /api/subcategories` - Get all subcategories
- `POST /api/subcategories` - Create subcategory (Admin)
- `PUT /api/subcategories/:id` - Update subcategory (Admin)
- `DELETE /api/subcategories/:id` - Delete subcategory (Admin)

### Banners
- `GET /api/banners` - Get all banners
- `POST /api/banners` - Create banner (Admin)
- `PUT /api/banners/:id` - Update banner (Admin)
- `DELETE /api/banners/:id` - Delete banner (Admin)

## Database Models

- **User** - User accounts with roles
- **Product** - Hardware products
- **Category** - Product categories
- **SubCategory** - Product subcategories/brands
- **Banner** - Homepage banners

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `node createAdmin.js` - Create admin account
- `node cleanup-database.js` - Clean database (removes old data)

## Security

- JWT tokens for authentication
- Password hashing with bcryptjs
- Role-based access control
- Helmet for HTTP headers security
- CORS configuration

## Notes

- Database cleaned from old Gracio data
- New admin account created with Puthankada credentials
- All endpoints require authentication except login/register