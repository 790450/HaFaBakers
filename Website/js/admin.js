// Admin panel functionality

// Check if admin is logged in
function checkAdminAuth() {
    if (!isAdminLoggedIn()) {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    } else {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadAdminData();
    }
}

// Login functionality
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const adminPassword = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = adminPassword.value;
        const correctPassword = getAdminPassword();
        
        if (password === correctPassword) {
            setAdminSession(true);
            checkAdminAuth();
            adminPassword.value = '';
            loginError.textContent = '';
        } else {
            loginError.textContent = 'Incorrect password. Please try again.';
        }
    });
}

// Logout functionality
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            setAdminSession(false);
            checkAdminAuth();
        });
    }
}

// Tab switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab + 'Tab').classList.add('active');
            
            // Load data for the active tab
            if (targetTab === 'sales') {
                loadSalesReport();
            }
        });
    });
}

// Menu Management
function loadCategories() {
    const categories = getCategories();
    const categorySelect = document.getElementById('itemCategory');
    if (categorySelect) {
        categorySelect.innerHTML = categories.map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('');
    }
}

function loadMenuTable() {
    const menuItems = getMenuItems();
    const tableBody = document.getElementById('menuTableBody');
    
    if (menuItems.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    No menu items found. Click "Add New Item" to create one.
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = menuItems.map(item => {
        // Get price based on pricing type
        let displayPrice = item.price || 0;
        if (item.pricingType === 'piece' && item.pricePerPiece) {
            displayPrice = item.pricePerPiece;
        }
        
        const displayWeight = item.weight ? `${item.weight}g` : (item.pricingType === 'piece' ? 'Per Piece' : 'N/A');
        const pricingTypeDisplay = item.pricingType === 'piece' ? 'Piece' : (item.pricingType === 'weight' ? 'Weight' : 'Legacy');
        
        return `
        <tr>
            <td>
                <div class="menu-table-image">
                    ${item.image ? 
                        `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.parentElement.innerHTML='🍰'">` : 
                        '🍰'
                    }
                </div>
            </td>
            <td><strong>${item.name}</strong></td>
            <td>${item.type === 'egg' ? 'Egg' : 'Eggless'}</td>
            <td>${item.category}</td>
            <td>${displayWeight}<br><small style="color: #666;">${pricingTypeDisplay}</small></td>
            <td>₹${displayPrice.toFixed(2)}</td>
            <td>
                <div class="table-actions">
                    <button class="table-btn table-btn-edit" onclick="editMenuItem('${item.id}')">Edit</button>
                    <button class="table-btn table-btn-delete" onclick="deleteMenuItem('${item.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

function addMenuItem() {
    document.getElementById('modalTitle').textContent = 'Add Menu Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';

    const calculatedPriceEl = document.getElementById('calculatedPrice');
    if (calculatedPriceEl) {
        calculatedPriceEl.textContent = '';
    }

    document.getElementById('pricingType').value = 'weight';
    togglePricingFields();
    loadCategories();
    document.getElementById('itemModal').classList.add('active');
}
function editMenuItem(itemId) {
    const menuItems = getMenuItems();
    const item = menuItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    loadCategories(); // Refresh categories dropdown
    document.getElementById('modalTitle').textContent = 'Edit Menu Item';
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemType').value = item.type;
    document.getElementById('itemCategory').value = item.category;
    
    // Determine pricing type
    let pricingType = item.pricingType;
    if (!pricingType) {
        // Determine from existing data
        pricingType = item.weight ? 'weight' : 'piece';
    }
    
    document.getElementById('pricingType').value = pricingType;
    togglePricingFields();
    
    // Populate fields based on pricing type
    if (pricingType === 'weight') {
        document.getElementById('itemWeight').value = item.weight || '';
        document.getElementById('itemPrice').value = item.price || '';
    } else {
        document.getElementById('itemPricePerPiece').value = item.pricePerPiece || item.price || '';
        updateCalculatedPrice(); // Auto-fill price from piece price
    }
    
    // Set price field for weight-based items
    if (pricingType === 'weight') {
        document.getElementById('itemPrice').value = item.price || '';
    }
    document.getElementById('itemImage').value = item.image || '';
    document.getElementById('itemDescription').value = item.description || '';
    
    document.getElementById('itemModal').classList.add('active');
}

function updateCalculatedPrice() {
    const pricingType = document.getElementById('pricingType').value;
    
    if (pricingType === 'piece') {
        const pricePerPiece = parseFloat(document.getElementById('itemPricePerPiece').value) || 0;
        if (pricePerPiece > 0) {
            document.getElementById('itemPrice').value = pricePerPiece.toFixed(2);
        }
    }
    // For weight-based, price is entered manually, no calculation needed
}

function togglePricingFields() {
    const pricingType = document.getElementById('pricingType').value;
    const weightBasedFields = document.getElementById('weightBasedFields');
    const pieceBasedFields = document.getElementById('pieceBasedFields');
    const priceCalculationNote = document.getElementById('priceCalculationNote');
    
    // Clear relevant fields when switching
    if (pricingType === 'weight') {
        document.getElementById('itemPricePerPiece').value = '';
    } else {
        document.getElementById('itemWeight').value = '';
    }
    
    if (pricingType === 'weight') {
        weightBasedFields.style.display = 'block';
        pieceBasedFields.style.display = 'none';
        document.getElementById('itemWeight').required = true;
        document.getElementById('itemPricePerPiece').required = false;
        priceCalculationNote.textContent = 'Enter the total price for this weight';
    } else {
        weightBasedFields.style.display = 'none';
        pieceBasedFields.style.display = 'block';
        document.getElementById('itemWeight').required = false;
        document.getElementById('itemPricePerPiece').required = true;
        priceCalculationNote.textContent = 'Enter the fixed price per piece';
    }
}

function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const menuItems = getMenuItems();
    const filteredItems = menuItems.filter(i => i.id !== itemId);
    saveMenuItems(filteredItems);
    loadMenuTable();
}

function saveMenuItem(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value.trim();
    const type = document.getElementById('itemType').value;
    const category = document.getElementById('itemCategory').value;
    const pricingType = document.getElementById('pricingType').value;
    const image = document.getElementById('itemImage').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    
    let price = 0;
    let weight = null;
    let pricePerPiece = null;
    
    // Validate and get pricing data based on type
    if (pricingType === 'weight') {
        weight = parseFloat(document.getElementById('itemWeight').value);
        price = parseFloat(document.getElementById('itemPrice').value);
        
        if (!name || !weight || weight <= 0 || !price || price <= 0) {
            alert('Please fill in all required fields correctly for weight-based pricing.');
            return;
        }
    } else {
        pricePerPiece = parseFloat(document.getElementById('itemPricePerPiece').value);
        price = parseFloat(document.getElementById('itemPrice').value);
        
        if (!name || !pricePerPiece || pricePerPiece <= 0 || !price || price <= 0) {
            alert('Please fill in all required fields correctly for piece-based pricing.');
            return;
        }
    }
    
    // Add category if it doesn't exist
    addCategory(category);
    
    const menuItems = getMenuItems();
    
    if (itemId) {
        // Update existing item
        const index = menuItems.findIndex(i => i.id === itemId);
        if (index !== -1) {
            menuItems[index] = {
                ...menuItems[index],
                name,
                type,
                category,
                pricingType,
                weight,
                pricePerPiece,
                price,
                image,
                description
            };
        }
    } else {
        // Add new item
        const newItem = {
            id: Date.now().toString(),
            name,
            type,
            category,
            pricingType,
            weight,
            pricePerPiece,
            price,
            image,
            description
        };
        menuItems.push(newItem);
    }
    
    saveMenuItems(menuItems);
    loadMenuTable();
    loadCategories(); // Refresh categories
    document.getElementById('itemModal').classList.remove('active');
    
    // Refresh menu on customer page if it's open
    if (typeof displayMenuItems === 'function') {
        displayMenuItems();
    }
}

function initializeCategoryManagement() {
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const addNewCategoryBtn = document.getElementById('addNewCategoryBtn');
    const categoryForm = document.getElementById('categoryForm');
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModal = document.getElementById('closeCategoryModal');
    const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
    
    function openCategoryModal() {
        document.getElementById('newCategoryName').value = '';
        categoryModal.classList.add('active');
    }
    
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', openCategoryModal);
    }
    
    if (addNewCategoryBtn) {
        addNewCategoryBtn.addEventListener('click', openCategoryModal);
    }
    
    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const categoryName = document.getElementById('newCategoryName').value.trim();
            if (categoryName) {
                addCategory(categoryName);
                loadCategories();
                categoryModal.classList.remove('active');
                alert(`Category "${categoryName}" added successfully!`);
            }
        });
    }
    
    if (closeCategoryModal) {
        closeCategoryModal.addEventListener('click', () => {
            categoryModal.classList.remove('active');
        });
    }
    
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', () => {
            categoryModal.classList.remove('active');
        });
    }
    
    if (categoryModal) {
        categoryModal.addEventListener('click', (e) => {
            if (e.target === categoryModal) {
                categoryModal.classList.remove('active');
            }
        });
    }
}

function initializeMenuManagement() {
    const addItemBtn = document.getElementById('addItemBtn');
    const itemForm = document.getElementById('itemForm');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const itemModal = document.getElementById('itemModal');
    const pricingType = document.getElementById('pricingType');
    const itemWeight = document.getElementById('itemWeight');
    const itemPricePer100g = document.getElementById('itemPricePer100g');
    const itemPricePerPiece = document.getElementById('itemPricePerPiece');
    
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addMenuItem);
    }
    
    if (itemForm) {
        itemForm.addEventListener('submit', saveMenuItem);
    }
    
    // Toggle pricing fields when pricing type changes
    if (pricingType) {
        pricingType.addEventListener('change', togglePricingFields);
    }
    
    // Auto-update price when piece price changes
    if (itemPricePerPiece) {
        itemPricePerPiece.addEventListener('input', updateCalculatedPrice);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            itemModal.classList.remove('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            itemModal.classList.remove('active');
        });
    }
    
    if (itemModal) {
        itemModal.addEventListener('click', (e) => {
            if (e.target === itemModal) {
                itemModal.classList.remove('active');
            }
        });
    }
}

// Sales Report
function loadSalesReport() {
    const monthSelector = document.getElementById('monthSelector');
    const currentDate = new Date();
    const currentMonth = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
    
    if (monthSelector && !monthSelector.value) {
        monthSelector.value = currentMonth;
    }
    
    updateSalesReport();
    
    if (monthSelector) {
        monthSelector.addEventListener('change', updateSalesReport);
    }
}

function updateSalesReport() {
    const monthSelector = document.getElementById('monthSelector');
    if (!monthSelector || !monthSelector.value) return;
    
    const [year, month] = monthSelector.value.split('-').map(Number);
    const orders = getOrdersByMonth(year, month - 1); // month is 0-indexed in JS
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toFixed(2);
    
    const ordersTableBody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem;">
                    No orders found for this month.
                </td>
            </tr>
        `;
        return;
    }
    
    const menuItems = getMenuItems();
    
    ordersTableBody.innerHTML = orders.map(order => {
        const orderDate = new Date(order.date);
        const itemsList = order.items.map(item => {
            const menuItem = menuItems.find(m => m.id === item.itemId);
            return menuItem ? `${menuItem.name} (${item.quantity}x)` : 'Unknown Item';
        }).join(', ');
        
        return `
            <tr>
                <td>${order.id}</td>
                <td>${orderDate.toLocaleString('en-IN')}</td>
                <td>${itemsList}</td>
                <td>₹${order.total.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

function exportCSV() {
    const monthSelector = document.getElementById('monthSelector');
    if (!monthSelector || !monthSelector.value) {
        alert('Please select a month first.');
        return;
    }
    
    const [year, month] = monthSelector.value.split('-').map(Number);
    const orders = getOrdersByMonth(year, month - 1);
    const menuItems = getMenuItems();
    
    if (orders.length === 0) {
        alert('No orders to export for this month.');
        return;
    }
    
    let csv = 'Order ID,Date,Items,Total\n';
    
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        const itemsList = order.items.map(item => {
            const menuItem = menuItems.find(m => m.id === item.itemId);
            return menuItem ? `${menuItem.name} (${item.quantity}x)` : 'Unknown Item';
        }).join('; ');
        
        csv += `"${order.id}","${orderDate.toLocaleString('en-IN')}","${itemsList}","${order.total.toFixed(2)}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${year}-${String(month).padStart(2, '0')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function initializeSalesReport() {
    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportCSV);
    }
}

function loadAdminData() {
    loadCategories();
    loadMenuTable();
    loadSalesReport();
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    initializeLogin();
    initializeLogout();
    initializeTabs();
    initializeCategoryManagement();
    initializeMenuManagement();
    initializeSalesReport();
});

