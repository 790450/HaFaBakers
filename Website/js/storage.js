// localStorage utility functions

// Menu Items
function saveMenuItems(items) {
    localStorage.setItem('menuItems', JSON.stringify(items));
}

function getMenuItems() {
    const items = localStorage.getItem('menuItems');
    return items ? JSON.parse(items) : [];
}

// Cart
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Orders
function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function getOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
}

function getOrdersByMonth(year, month) {
    const orders = getOrders();
    return orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getFullYear() === year && orderDate.getMonth() === month;
    });
}

// Admin
function setAdminPassword(password) {
    localStorage.setItem('adminPassword', password);
}

function getAdminPassword() {
    return localStorage.getItem('adminPassword') || 'admin123'; // Default password
}

function setAdminSession(active) {
    if (active) {
        sessionStorage.setItem('adminLoggedIn', 'true');
    } else {
        sessionStorage.removeItem('adminLoggedIn');
    }
}

function isAdminLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Categories Management
function getCategories() {
    const categories = localStorage.getItem('categories');
    return categories ? JSON.parse(categories) : ['Birthday Cake', 'Classic Brownie', 'Nuts Brownie', 'Blondie', 'TeaCake', 'TutiFrutti Cake'];
}

function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function addCategory(category) {
    const categories = getCategories();
    if (!categories.includes(category)) {
        categories.push(category);
        saveCategories(categories);
    }
}

// Initialize default menu items if none exist
function initializeDefaultMenu() {
    const existingItems = getMenuItems();
    if (existingItems.length === 0) {
        // Using images from various open source websites (Unsplash, Pexels, Pixabay)
        const defaultItems = [
            { id: '1', name: 'Birthday Cake', type: 'egg', category: 'Birthday Cake', pricingType: 'weight', weight: 500, price: 500, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', description: 'Delicious egg birthday cake' },
            { id: '2', name: 'Birthday Cake', type: 'eggless', category: 'Birthday Cake', pricingType: 'weight', weight: 500, price: 550, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', description: 'Delicious eggless birthday cake' },
            { id: '3', name: 'Classic Brownie', type: 'egg', category: 'Classic Brownie', pricingType: 'piece', pricePerPiece: 45, price: 45, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', description: 'Rich and fudgy classic brownie' },
            { id: '4', name: 'Classic Brownie', type: 'eggless', category: 'Classic Brownie', pricingType: 'piece', pricePerPiece: 45, price: 45, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', description: 'Rich and fudgy eggless classic brownie' },
            { id: '5', name: 'Nuts Brownie', type: 'egg', category: 'Nuts Brownie', pricingType: 'piece', pricePerPiece: 50, price: 50, image: 'https://media.istockphoto.com/id/500841274/photo/homemade-chocolate-and-nut-brownie-cake.jpg?s=612x612&w=0&k=20&c=srV-ZssdfsBWX4zhnnimZYGTepdTRGc4vAcjyv2ZFqQ=', description: 'Classic brownie with mixed nuts' },
            { id: '6', name: 'Nuts Brownie', type: 'eggless', category: 'Nuts Brownie', pricingType: 'piece', pricePerPiece: 50, price: 50, image: 'https://media.istockphoto.com/id/500841274/photo/homemade-chocolate-and-nut-brownie-cake.jpg?s=612x612&w=0&k=20&c=srV-ZssdfsBWX4zhnnimZYGTepdTRGc4vAcjyv2ZFqQ=', description: 'Eggless brownie with mixed nuts' },
            { id: '7', name: 'Blondie', type: 'egg', category: 'Blondie', pricingType: 'piece', pricePerPiece: 55, price: 55, image: 'https://img.taste.com.au/fuHUwscb/taste/2016/11/white-chocolate-macadamia-blondies-85709-1.jpeg', description: 'Vanilla blondie with chocolate chips' },
            { id: '8', name: 'Blondie', type: 'eggless', category: 'Blondie', pricingType: 'piece', pricePerPiece: 55, price: 55, image: 'https://img.taste.com.au/fuHUwscb/taste/2016/11/white-chocolate-macadamia-blondies-85709-1.jpeg', description: 'Eggless vanilla blondie' },
            { id: '9', name: 'TeaCake', type: 'egg', category: 'TeaCake', pricingType: 'piece', pricePerPiece: 12, price: 12, image: 'https://i.ytimg.com/vi/cmXasNe3ixU/maxresdefault.jpg', description: 'Perfect tea time cake' },
            { id: '10', name: 'TeaCake', type: 'eggless', category: 'TeaCake', pricingType: 'piece', pricePerPiece: 12, price: 12, image: 'https://i.ytimg.com/vi/cmXasNe3ixU/maxresdefault.jpg', description: 'Eggless tea cake' },
            { id: '11', name: 'TutiFrutti Cake', type: 'egg', category: 'TutiFrutti Cake', pricingType: 'piece', pricePerPiece: 15, price: 15, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/11/tutti-frutti-cake-recipe.jpg', description: 'Colorful tutifrutti cake' },
            { id: '12', name: 'TutiFrutti Cake', type: 'eggless', category: 'TutiFrutti Cake', pricingType: 'piece', pricePerPiece: 15, price: 15, image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/11/tutti-frutti-cake-recipe.jpg', description: 'Eggless colorful tutifrutti cake' }
        ];
        saveMenuItems(defaultItems);
    }
}

// Calculate price based on weight
function calculatePrice(weight, pricePer100g) {
    return (pricePer100g * weight) / 100;
}

// Initialize on load
if (typeof window !== 'undefined') {
    initializeDefaultMenu();
}

