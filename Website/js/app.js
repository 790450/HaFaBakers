// Main application logic

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure default menu is initialized
    initializeDefaultMenu();
    
    // Refresh menu display if on customer page
    if (document.getElementById('menuGrid')) {
        displayMenuItems();
    }
    
    // Update cart count
    if (document.getElementById('cartCount')) {
        updateCartCount();
    }
});

