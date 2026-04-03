/* ============================================
   CART PAGE — No emojis, Lucide icons
   ============================================ */

function renderCartPage() {
    const cart = getCart();
    const products = getAllProducts();
    const root = document.getElementById('app-root');

    if (cart.length === 0) {
        root.innerHTML = `
            <div class="cart-page">
                <h1><i data-lucide="shopping-cart"></i> Your Cart</h1>
                <div class="cart-empty">
                    <div class="empty-icon"><i data-lucide="shopping-cart"></i></div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any pickles yet!</p>
                    <button class="btn btn-primary btn-lg" onclick="window.location.hash='#/'" id="start-shopping-btn">Start Shopping</button>
                </div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    let subtotal = 0;
    let savings = 0;
    const cartItems = cart.map(c => {
        const p = products.find(pr => pr.id === c.productId);
        if (!p) return '';
        const currentPrice = getDiscountedPrice(p);
        const itemTotal = currentPrice * c.qty;
        subtotal += itemTotal;
        savings += (p.price - currentPrice) * c.qty;

        const priceDisplay = (p.discount && p.discount > 0)
            ? `<span style="text-decoration:line-through;color:var(--clr-text-muted);font-size:0.85rem;margin-right:6px;">₹${p.price}</span>₹${currentPrice}`
            : `₹${p.price}`;

        return `
            <div class="cart-item" id="cart-item-${p.id}">
                <div class="cart-item-img" style="position:relative;">
                    <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
                    ${p.isCombo ? `<span class="category-badge combo-badge" style="position:absolute;top:4px;left:4px;font-size:0.6rem;padding:2px 6px;">COMBO</span>` : ''}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${p.name}</div>
                    <div class="cart-item-price">${priceDisplay} ${p.isCombo ? '' : '/ 100gm'}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartItem(${p.id}, ${c.qty - 1})">−</button>
                    <span class="qty-value">${c.qty}</span>
                    <button class="qty-btn" onclick="updateCartItem(${p.id}, ${c.qty + 1})">+</button>
                </div>
                <div class="cart-item-total">₹${itemTotal}</div>
                <button class="cart-item-remove" onclick="removeCartItem(${p.id})" title="Remove">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;
    }).join('');

    const delivery = 0;
    const total = subtotal + delivery;

    root.innerHTML = `
        <div class="cart-page">
            <h1><i data-lucide="shopping-cart"></i> Your Cart</h1>
            ${cartItems}
            <div class="cart-summary">
                <div class="cart-summary-row">
                    <span>Subtotal (${cart.reduce((s, c) => s + c.qty, 0)} items)</span>
                    <span>₹${subtotal + savings}</span>
                </div>
                ${savings > 0 ? `
                <div class="cart-summary-row">
                    <span>Discount</span>
                    <span style="color: var(--clr-danger); font-weight: 600;">-₹${savings}</span>
                </div>` : ''}
                <div class="cart-summary-row">
                    <span>Delivery</span>
                    <span style="color: var(--clr-success); font-weight: 600;">FREE</span>
                </div>
                <div class="cart-summary-row total">
                    <span>Total</span>
                    <span style="color: var(--clr-accent);">₹${total}</span>
                </div>
                <button class="btn btn-primary btn-lg w-full mt-3" onclick="goToCheckout()" id="checkout-btn" style="width:100%;">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

function updateCartItem(productId, newQty) {
    updateCartQty(productId, newQty);
    renderNavbar();
    renderCartPage();
}

function removeCartItem(productId) {
    removeFromCart(productId);
    renderNavbar();
    renderCartPage();
    showToast('Item removed from cart', 'info');
}

function goToCheckout() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to checkout', 'warning');
        window.location.hash = '#/login';
        return;
    }
    window.location.hash = '#/checkout';
}
