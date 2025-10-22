# AI Coding Guidelines for Sample-FullStack E-commerce App

## Architecture Overview
This is a full-stack e-commerce application with separate backend and frontend:
- **Backend**: Node.js/Express server with MongoDB, JWT authentication, Cloudinary image storage
- **Frontend**: React 19 with Vite, React Router, Material-UI, Axios for API calls
- **Data Flow**: Frontend makes API calls to `/api/v1/*` endpoints, cart state managed at App level with localStorage

## Key Components & Patterns

### Backend API Structure
- Routes mounted under `/api/v1` in `backend/app.js`
- Controllers return consistent format: `{success: true, data}` or error objects
- Authentication middleware expects `Authorization: Bearer <token>` header
- File uploads handled by Multer with memory storage, then uploaded to Cloudinary

### Authentication & Authorization
- JWT tokens stored in sessionStorage on frontend (`frontend/src/Utils/helpers.jsx`)
- Protected routes use `isAuthenticatedUser` middleware
- Password hashing with bcrypt, reset tokens with crypto.randomBytes
- User avatars uploaded to Cloudinary 'avatars' folder

### Product Management
- Products stored in MongoDB with embedded reviews and images arrays
- Images uploaded to Cloudinary 'products' folder with public_id/url structure
- Search/filter/pagination handled by `APIFeatures` class (`backend/utils/apiFeatures.js`)
- Predefined categories: Electronics, Cameras, Laptops, Accessories, Headphones, Food, Books, Clothes/Shoes, Beauty/Health, Sports, Outdoor, Home

### Cart & Checkout Flow
- Cart state managed in `App.jsx` with localStorage persistence
- Cart items: `{product, name, price, image, stock, quantity}`
- Shipping info stored separately in localStorage
- Checkout steps: Cart → Shipping → Payment → Confirm Order → Success

### Frontend Patterns
- API calls use hardcoded `http://localhost:4001/api/v1/*` URLs
- Toast notifications via `react-toastify` for user feedback
- Price filtering with Material-UI Slider (range 1-1000)
- Pagination with Material-UI Pagination component
- Product ratings displayed as star ratings with CSS width percentages

## Development Workflows

### Running the Application
```bash
# Backend (from backend/ directory)
npm start  # Runs with nodemon on port from .env

# Frontend (from frontend/ directory)  
npm run dev  # Vite dev server on port 5173
```

### Environment Setup
Required `.env` file in `backend/config/`:
```
DB_URI=mongodb://localhost:27017/samplefullstack
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_TIME=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=4001
```

### File Upload Handling
- Use `multer.memoryStorage()` for file buffers
- Upload to Cloudinary with folder names ('avatars', 'products')
- Store `{public_id, url}` objects in database
- Image validation: .jpg, .jpeg, .png only

### Database Models
- **User**: name, email, password (hashed), avatar, role, reset tokens
- **Product**: name, price, description, ratings, images[], category, seller, stock, reviews[]
- **Order**: shippingInfo, user, orderItems[], paymentInfo, pricing fields, orderStatus

## Code Style & Conventions

### Error Handling
- Backend errors: `return res.status(code).json({message: 'error text'})`
- Frontend errors: `toast.error(error, {position: 'top-left'})`
- Success: `toast.success('message', {position: 'bottom-right'})`

### State Management
- Cart state lifted to App component, passed down via props
- localStorage used for cartItems and shippingInfo persistence
- sessionStorage used for auth tokens and user data

### Component Structure
- Layout components: Header, Footer, Loader, MetaData
- Feature components grouped by domain (Product/, Cart/, User/)
- Reusable UI components from Material-UI (@mui/material)

### API Integration
- Axios GET/POST/PUT requests to backend endpoints
- Response data accessed as `res.data.products` etc.
- Error handling with try/catch blocks

## Common Tasks & Patterns

### Adding New Products
1. Upload images to Cloudinary 'products' folder
2. Create product with images array: `[{public_id, url}]`
3. Validate against category enum in model

### User Authentication Flow
1. Register/login returns `{success: true, token, user}`
2. Store token in sessionStorage via `authenticate()` helper
3. Include `Authorization: Bearer ${token}` in protected requests
4. Use `getUser()` and `getToken()` helpers for state checks

### Cart Operations
1. Add item: Fetch product details, create cart item object, update state
2. Persist to localStorage on every change
3. Remove item: Filter cartItems array by product ID

### Search & Filtering
- Query params: `?keyword=term&page=1&price[gte]=min&price[lte]=max`
- APIFeatures handles regex search, price range filtering, pagination
- Frontend updates URL params for bookmarkable searches

## Dependencies & Libraries

### Backend
- express, mongoose, bcryptjs, jsonwebtoken, cloudinary, multer, nodemailer, validator

### Frontend  
- react, react-router-dom, axios, @mui/material, react-toastify, react-helmet

## Testing & Validation
- No test suite currently configured
- Manual testing via Postman for API endpoints
- Frontend validation through HTML5/React form validation
- Image upload validation in Multer config

## Deployment Considerations
- Environment variables required for production
- Cloudinary configuration for image hosting
- MongoDB connection string for database
- CORS configuration for cross-origin requests
- Static file serving for production builds