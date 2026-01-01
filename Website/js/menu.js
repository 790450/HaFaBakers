// Menu display and filtering functionality

let currentFilter = 'all';

function displayMenuItems() {
    const menuGrid = document.getElementById('menuGrid');
    const menuItems = getMenuItems();
    
    // Filter items based on current filter
    let filteredItems = menuItems;
    if (currentFilter !== 'all') {
        filteredItems = menuItems.filter(item => item.type === currentFilter);
    }
    
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🍰</div>
                <p>No items found in this category.</p>
            </div>
        `;
        return;
    }
    
    menuGrid.innerHTML = filteredItems.map(item => {
        // Get price based on pricing type
        let displayPrice = item.price || 0;
        if (item.pricingType === 'piece' && item.pricePerPiece) {
            displayPrice = item.pricePerPiece;
        }
        
        const displayWeight = item.weight ? `${item.weight}g` : '';
        const priceInfo = item.pricingType === 'piece' 
            ? `<small class="price-per-unit">(Per Piece)</small>`
            : (item.weight ? `<small class="price-per-unit">(${item.weight}g)</small>` : '');
        
        return `
        <div class="menu-item" data-item-id="${item.id}">
            <div class="menu-item-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='🍰'">` : 
                    '🍰'
                }
            </div>
            <div class="menu-item-info">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-category">${item.category}</p>
                ${displayWeight ? `<p class="menu-item-weight">Weight: ${displayWeight}</p>` : (item.pricingType === 'piece' ? '<p class="menu-item-weight">Priced per piece</p>' : '')}
                <span class="menu-item-type">${item.type === 'egg' ? '🥚 Egg' : '🌱 Eggless'}</span>
                <div class="menu-item-footer">
                    <div class="price-container">
                        <span class="menu-item-price">₹${displayPrice.toFixed(2)}</span>
                        ${priceInfo}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    // Add click event to menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking the button
            if (!e.target.classList.contains('add-to-cart-btn')) {
                const itemId = item.dataset.itemId;
                addToCart(itemId);
            }
        });
    });
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Update current filter
            currentFilter = btn.dataset.filter;
            // Refresh menu display
            displayMenuItems();
        });
    });
}

// Initialize menu on page load
if (document.getElementById('menuGrid')) {
    displayMenuItems();
    initializeFilters();
}

