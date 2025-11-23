# Inventory Management App

A full-featured inventory management application with Node.js/Express backend (SQLite) and React frontend.

## Features

### Backend (Node.js + Express + SQLite)
- ✅ RESTful API for product management (CRUD operations)
- ✅ CSV import/export functionality
- ✅ Inventory history tracking with automatic logging
- ✅ Product search and filtering
- ✅ Pagination and sorting support
- ✅ Input validation with express-validator
- ✅ File upload handling with multer

### Frontend (React)
- ✅ Product listing with search and category filters
- ✅ Inline editing with save/cancel functionality
- ✅ Add new products with form validation
- ✅ CSV import with detailed results (added/skipped)
- ✅ CSV export with automatic download
- ✅ Inventory history sidebar with change tracking
- ✅ Stock status indicators (In Stock/Out of Stock)
- ✅ Responsive design with clean UI
- ✅ Real-time product updates

## Project Structure

```
inventory-management-app/
│
├── backend/
│   ├── server.js                 # Express server setup
│   ├── db.js                     # SQLite database connection and initialization
│   ├── routes/
│   │   └── products.js           # Product API routes
│   ├── controllers/
│   │   └── productController.js  # Business logic for products
│   ├── middleware/
│   │   ├── upload.js             # Multer file upload configuration
│   │   └── validate.js           # Request validation rules
│   ├── uploads/                  # Uploaded files directory
│   ├── inventory.db              # SQLite database (auto-generated)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProductTable.js       # Product list table
    │   │   ├── ProductRow.js         # Individual product row with inline editing
    │   │   ├── ImportModal.js        # CSV import modal
    │   │   ├── ExportButton.js       # CSV export button
    │   │   └── HistorySidebar.js     # Inventory history sidebar
    │   ├── pages/
    │   │   └── ProductsPage.js       # Main products page
    │   ├── App.js                    # App router
    │   └── api/
    │       └── productsApi.js        # Axios API client
    ├── package.json
    └── public/
        └── index.html
```

## Quick Start

### Backend Setup

1. Navigate to the backend folder:

```pwsh
cd "C:\Users\91897\Pictures\Personal\Inventary Management System\inventory-management-app\backend"
```

2. Install dependencies:

```pwsh
npm install
```

3. Start the development server:

```pwsh
npm run dev
```

The backend will start on **http://localhost:5000**

For production:
```pwsh
npm start
```

### Frontend Setup

1. Navigate to the frontend folder:

```pwsh
cd "C:\Users\91897\Pictures\Personal\Inventary Management System\inventory-management-app\frontend"
```

2. Install dependencies:

```pwsh
npm install
```

3. Start the development server:

```pwsh
npm start
```

The frontend will start on **http://localhost:3000** and automatically open in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?category=`, `?name=`, `?page=`, `?limit=`, `?sort=`, `?order=`) |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product (tracks inventory history) |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/products/:id/history` | Get inventory history for a product |
| POST | `/api/products/import` | Import products from CSV (multipart/form-data with field `csvFile`) |
| GET | `/api/products/export` | Export all products as CSV |

## Testing the Application

### Using the Sample CSV

A sample CSV file (`sample-products.csv`) is included in the root directory. To test the import feature:

1. Open the application at http://localhost:3000
2. Click the **"📤 Import CSV"** button
3. Select `sample-products.csv`
4. Click **"Upload CSV"**
5. View the import results showing added and skipped products

### CSV File Format

Your CSV file should have these headers:
```
name,unit,category,brand,stock,status,image
```

Example row:
```
"Wireless Mouse","pcs","Electronics","Logitech",45,"Active",""
```

## Features in Detail

### Product Management
- **Add**: Click "➕ Add New Product" button to add new products
- **Edit**: Click "Edit" on any product row to enable inline editing
- **Delete**: Click "Delete" to remove a product (with confirmation)
- **Search**: Use the search bar to filter by name, brand, or category
- **Category Filter**: Use the dropdown to filter by specific categories

### Import/Export
- **Import**: Upload CSV files to bulk add products (duplicates are automatically skipped)
- **Export**: Download all products as CSV with a single click

### Inventory History
- Click the **"History"** button on any product to view stock changes
- Shows old quantity, new quantity, change amount, and timestamp
- Automatically tracks changes when stock is updated

## Environment Variables

### Backend (.env)
Create a `.env` file in the backend folder if needed:
```
PORT=5000
```

### Frontend
The frontend defaults to `http://localhost:5000/api/products`. To change this, set:
```
REACT_APP_API_URL=http://your-backend-url/api/products
```

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  unit TEXT,
  category TEXT,
  brand TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT,
  image TEXT
);
```

### Inventory History Table
```sql
CREATE TABLE inventory_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  old_quantity INTEGER,
  new_quantity INTEGER,
  change_date TEXT,
  user_info TEXT,
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

## Development Notes

- Backend uses nodemon for auto-restart on file changes
- Frontend uses react-scripts with hot module replacement
- SQLite database file is created automatically on first run
- CORS is enabled for cross-origin requests

## Deployment

### Backend (Render/Railway/Heroku)
1. Set up the service to run `npm start`
2. Configure environment variables (if any)
3. For production, consider migrating from SQLite to PostgreSQL for better persistence

### Frontend (Netlify/Vercel)
1. Build command: `npm run build`
2. Publish directory: `build`
3. Set environment variable `REACT_APP_API_URL` to your deployed backend URL

## Troubleshooting

### Backend won't start
- Ensure port 5000 is available
- Check that all dependencies are installed: `npm install`
- Verify SQLite database permissions

### Frontend won't start
- Ensure port 3000 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that backend is running on port 5000

### Import not working
- Verify CSV file format matches the required headers
- Check backend console for error messages
- Ensure file size is reasonable (< 10MB)

## Next Steps (Optional Enhancements)

- [ ] Add user authentication (JWT)
- [ ] Implement pagination UI for large datasets
- [ ] Add product images upload support
- [ ] Create dashboard with analytics
- [ ] Add unit tests (Jest, React Testing Library, Supertest)
- [ ] Implement real-time updates with WebSockets
- [ ] Add data backup/restore functionality

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.
