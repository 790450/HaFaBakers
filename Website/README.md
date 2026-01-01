# Home Baking Website

A complete e-commerce website for a home baking business with menu management, shopping cart, billing, and admin features.

## Features

### Customer Features
- Browse menu items (Egg and Eggless variants) with beautiful images
- Filter by type (All, Egg, Eggless)
- Add items to cart by clicking on them
- Manage cart (increase/decrease quantity, remove items)
- View cart total
- Print bill
- Pay via QR code (UPI)
- Clear cart
- Fully mobile responsive design

### Admin Features
- Password-protected admin panel
- Menu management (CRUD operations)
  - Add new items
  - Edit existing items
  - Delete items
  - View all items in a table
  - **Add custom categories dynamically**
- Monthly sales report
  - Filter orders by month
  - View total orders and revenue
  - Export to CSV

## Setup

1. Open `index.html` in a web browser
2. The website uses localStorage, so no server is required
3. Default admin password: `admin123`

## File Structure

```
Website/
├── index.html          # Customer-facing page
├── admin.html          # Admin dashboard
├── css/
│   ├── style.css       # Main stylesheet
│   └── admin.css       # Admin-specific styles
├── js/
│   ├── app.js          # Main application logic
│   ├── cart.js         # Cart and billing functionality
│   ├── menu.js         # Menu display and filtering
│   ├── admin.js        # Admin panel logic
│   └── storage.js      # localStorage utilities
└── images/             # Product images directory
```

## Default Menu Items

The website comes pre-loaded with 12 default items with images from Unsplash (free, open source):
- Birthday Cake (Egg & Eggless)
- Classic Brownie (Egg & Eggless)
- Nuts Brownie (Egg & Eggless)
- Blondie (Egg & Eggless)
- TeaCake (Egg & Eggless)
- TutiFrutti Cake (Egg & Eggless)

## Adding Categories

In the admin panel, you can:
1. Click "Add Category" button to create a new category
2. Or click the "+" button next to the category dropdown when adding/editing items
3. Categories are saved and available for all future items

## Adding Product Images

The website comes with default images from Unsplash (free, open source). You can:
1. Use the default Unsplash images (already configured)
2. Add your own images by placing them in the `images/` folder and using relative paths like `images/cake.jpg`
3. Or use full URLs to any image hosting service
4. In the admin panel, edit a menu item and update the image URL field

## QR Code Setup

1. Replace `images/upi-qr.png` with your actual UPI QR code image
2. Or update the image source in `index.html` (line with `id="qrCodeImage"`)

## Browser Compatibility

Works in all modern browsers that support:
- localStorage
- ES6 JavaScript
- CSS Grid and Flexbox

## Notes

- All data is stored in browser localStorage
- Data persists across page refreshes
- Admin session expires when browser is closed
- Default admin password can be changed in `js/storage.js`

