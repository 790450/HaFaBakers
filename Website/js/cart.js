function sendWhatsAppNotification(orderDetails) {
    const numbers = ["6385858767"];

    numbers.forEach(num => {
        const url = `https://wa.me/91${num}?text=${encodeURIComponent(orderDetails)}`;
        window.open(url, "_blank");
    });
}

function addToCart(itemId) {
    const menuItems = getMenuItems();
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    let itemPrice = item.price || 0;
    if (item.pricingType === "piece" && item.pricePerPiece) {
        itemPrice = item.pricePerPiece;
    }

    const cart = getCart();
    const existingItem = cart.find(c => c.itemId === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            itemId,
            name: item.name,
            quantity: 1,
            price: itemPrice
        });
    }

    saveCart(cart);
    updateCartDisplay();
    updateCartCount();
}

function removeFromCart(itemId) {
    saveCart(getCart().filter(c => c.itemId !== itemId));
    updateCartDisplay();
    updateCartCount();
}

function updateQuantity(itemId, change) {
    const cart = getCart();
    const item = cart.find(c => c.itemId === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    saveCart(cart);
    updateCartDisplay();
    updateCartCount();
}

function clearCart(silent = false) {
    if (!silent && !confirm("Clear cart?")) return;
    saveCart([]);
    updateCartDisplay();
    updateCartCount();
}

function calculateTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function updateCartDisplay() {
    const cartItemsEl = document.getElementById("cartItems");
    const cart = getCart();

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>`;
        document.getElementById("cartTotal").textContent = "0";
        return;
    }

    cartItemsEl.innerHTML = cart.map(i => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${i.name}</div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity('${i.itemId}', -1)">-</button>
                    <span>${i.quantity}</span>
                    <button onclick="updateQuantity('${i.itemId}', 1)">+</button>
                    <button onclick="removeFromCart('${i.itemId}')">Remove</button>
                </div>
            </div>
            <div class="cart-item-total">₹${(i.price * i.quantity).toFixed(2)}</div>
        </div>
    `).join("");

    document.getElementById("cartTotal").textContent = calculateTotal().toFixed(2);
}

function updateCartCount() {
    const el = document.getElementById("cartCount");
    if (el) el.textContent = getCart().reduce((s, i) => s + i.quantity, 0);
}

function generateBill() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // 🔐 CUSTOMER VALIDATION
    const customerName = document.getElementById("custName").value.trim();
    const customerMobile = document.getElementById("custMobile").value.trim();

    if (!customerName || !customerMobile) {
        alert("Please enter Customer Name and Mobile Number before printing the bill.");
        return;
    }

    const orderId = "HB-" + Date.now().toString().slice(-6);
    const orderDate = new Date().toLocaleString("en-IN");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    // COMPANY HEADER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("HAFA BAKERS", 105, y, { align: "center" });

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Freshly baked with love", 105, y, { align: "center" });

    y += 10;
    doc.line(20, y, 190, y);
    y += 8;

    // ORDER INFO
    doc.setFontSize(11);
    doc.text(`Order ID: ${orderId}`, 20, y);
    doc.text(`Date: ${orderDate}`, 120, y);

    y += 8;
    doc.text(`Customer Name: ${customerName}`, 20, y);
    y += 6;
    doc.text(`Mobile Number: ${customerMobile}`, 20, y);

    y += 10;
    doc.line(20, y, 190, y);
    y += 8;

    // ORDER DETAILS
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.text("Item", 20, y);
    doc.text("Qty", 120, y);
    doc.text("Amount (Rs.)", 155, y);

    y += 4;
    doc.line(20, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        doc.text(item.name, 20, y);
        doc.text(String(item.quantity), 125, y);
        doc.text(`Rs. ${itemTotal.toFixed(2)}`, 155, y);

        y += 6;
    });

    y += 6;
    doc.line(20, y, 190, y);
    y += 8;

    // TOTAL
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`Total Amount: Rs. ${total.toFixed(2)}`, 20, y);

    y += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for ordering from HAFA Bakers!", 105, y, { align: "center" });

    // 📥 AUTO DOWNLOAD PDF
    doc.save(`HAFA_Bakers_Order_${orderId}.pdf`);
}



function initializeCart() {
    const cartBtn = document.getElementById("cartBtn");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");
    const printBillBtn = document.getElementById("printBill");
    const clearCartBtn = document.getElementById("clearCart");
    const placeOrderBtn = document.getElementById("placeOrder");

    cartBtn?.addEventListener("click", () => {
        cartSidebar.classList.add("active");
        cartOverlay.classList.add("active");
        updateCartDisplay();
    });

    closeCart?.addEventListener("click", () => {
        cartSidebar.classList.remove("active");
        cartOverlay.classList.remove("active");
    });

    cartOverlay?.addEventListener("click", () => {
        cartSidebar.classList.remove("active");
        cartOverlay.classList.remove("active");
    });

    clearCartBtn?.addEventListener("click", clearCart);
    printBillBtn?.addEventListener("click", generateBill);

    // ✅ PLACE ORDER BUTTON (WhatsApp)
    placeOrderBtn?.addEventListener("click", () => {
        const name = document.getElementById("custName").value.trim();
        const mobile = document.getElementById("custMobile").value.trim();
        const address = document.getElementById("custAddress").value.trim();
        const customizations = document.getElementById("custNotes").value.trim();

        if (!name || !mobile || !address) {
            alert("Please fill customer details");
            return;
        }

        const cart = getCart();
        if (cart.length === 0) {
            alert("Cart is empty");
            return;
        }

        let itemsText = "";
        let total = 0;

        cart.forEach(i => {
            itemsText += `* ${i.name} x ${i.quantity}\n`;
            total += i.price * i.quantity;
        });

        const message = `
🧾 *New Order Received*

👤 Name: ${name}
📞 Mobile: ${mobile}
🏠 Address: ${address}
📝 Customizations:
${customizations ? customizations : "No customizations"}

📦 Order Items:
${itemsText}

💰 Total Amount: ₹${total.toFixed(2)}

📌 Payment: Cash / UPI (Manual)
`;

        sendWhatsAppNotification(message);
        clearCart(true);
        document.getElementById("custNotes").value = "";
        alert("Order placed successfully!");
    });

    updateCartCount();
}

initializeCart();
