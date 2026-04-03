/* ============================================
   CHECKOUT PAGE — No emojis, Lucide icons
   ============================================ */

async function renderCheckoutPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.hash = '#/login';
        return;
    }

    const cart = getCart();
    if (cart.length === 0) {
        window.location.hash = '#/cart';
        return;
    }

    const products = await getAllProducts();
    let subtotal = 0;
    const orderItems = cart.map(c => {
        const p = products.find(pr => pr.id === c.productId);
        if (!p) return null;
        subtotal += p.price * c.qty;
        return { id: p.id, name: p.name, price: p.price, qty: c.qty, image: p.image };
    }).filter(Boolean);

    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div class="checkout-page">
            <div class="breadcrumb">
                <a href="#/cart">Cart</a>
                <span>›</span>
                <span>Checkout</span>
            </div>
            <h1><i data-lucide="package"></i> Checkout</h1>

            <div class="checkout-grid">
                <!-- Address Form -->
                <div class="checkout-form-card">
                    <h2><i data-lucide="map-pin"></i> Delivery Address</h2>
                    <form id="checkout-form" onsubmit="handlePlaceOrder(event)">
                        <div class="form-group">
                            <label class="form-label">Full Name *</label>
                            <input type="text" class="form-input" id="addr-name" placeholder="Enter your full name" required value="${user.name || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number *</label>
                            <input type="tel" class="form-input" id="addr-phone" placeholder="Enter your phone number" required pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Address Line 1 *</label>
                            <input type="text" class="form-input" id="addr-line1" placeholder="House/Flat No., Street Name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Address Line 2</label>
                            <input type="text" class="form-input" id="addr-line2" placeholder="Landmark, Area (optional)">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">City *</label>
                                <input type="text" class="form-input" id="addr-city" placeholder="City" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Pincode *</label>
                                <input type="text" class="form-input" id="addr-pincode" placeholder="6-digit pincode" required pattern="[0-9]{6}" title="Please enter a valid 6-digit pincode">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">State *</label>
                            <input type="text" class="form-input" id="addr-state" placeholder="State" required>
                        </div>

                        <button type="submit" class="btn btn-primary btn-lg w-full mt-2" id="place-order-btn" style="width: 100%;">
                            Place Order — ₹${subtotal}
                        </button>
                    </form>
                </div>

                <!-- Order Summary -->
                <div class="order-summary-card">
                    <h2><i data-lucide="receipt"></i> Order Summary</h2>
                    ${orderItems.map(item => `
                        <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--clr-border-light);">
                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;" onerror="this.style.display='none'">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 0.9rem;">${item.name}</div>
                                <div style="font-size: 0.8rem; color: var(--clr-text-muted);">₹${item.price} × ${item.qty}</div>
                            </div>
                            <div style="font-weight: 700; color: var(--clr-accent);">₹${item.price * item.qty}</div>
                        </div>
                    `).join('')}

                    <div class="cart-summary-row mt-2">
                        <span>Subtotal</span>
                        <span>₹${subtotal}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span>Delivery</span>
                        <span style="color: var(--clr-success); font-weight: 600;">FREE</span>
                    </div>
                    <div class="cart-summary-row total">
                        <span>Total</span>
                        <span style="color: var(--clr-accent);">₹${subtotal}</span>
                    </div>

                    <div class="cod-badge">
                        <span class="cod-icon"><i data-lucide="banknote"></i></span>
                        <div>
                            <div class="cod-text">Cash on Delivery</div>
                            <div class="cod-sub">Pay when your order arrives</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

async function handlePlaceOrder(event) {
    event.preventDefault();

    const user = getCurrentUser();
    const cart = getCart();
    const products = await getAllProducts();

    const items = cart.map(c => {
        const p = products.find(pr => pr.id === c.productId);
        return p ? { id: p.id, name: p.name, price: p.price, qty: c.qty } : null;
    }).filter(Boolean);

    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    const address = {
        name: document.getElementById('addr-name').value,
        phone: document.getElementById('addr-phone').value,
        line1: document.getElementById('addr-line1').value,
        line2: document.getElementById('addr-line2').value,
        city: document.getElementById('addr-city').value,
        pincode: document.getElementById('addr-pincode').value,
        state: document.getElementById('addr-state').value
    };

    const order = await createOrder({
        username: user.username,
        customerName: address.name,
        items,
        total,
        address,
        paymentMethod: 'Cash on Delivery'
    });

    clearCart();
    renderNavbar();

    // Show confirmation
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div style="text-align: center; padding: 80px 2rem; max-width: 600px; margin: 0 auto; animation: scaleIn 0.5s ease;">
            <div style="margin-bottom: 20px;"><i data-lucide="check-circle-2" style="width: 80px; height: 80px; stroke: var(--clr-success); stroke-width: 1.5;"></i></div>
            <h1 style="font-size: 2rem; margin-bottom: 12px; color: var(--clr-success); font-family: var(--font-heading);">Order Placed Successfully!</h1>
            <p style="font-size: 1.1rem; color: var(--clr-text-secondary); margin-bottom: 8px;">
                Your order <strong>#${order.id}</strong> has been confirmed
            </p>
            <p style="color: var(--clr-text-muted); margin-bottom: 32px;">
                Payment: Cash on Delivery · Total: ₹${total}
            </p>
            <div style="display: flex; gap: 16px; justify-content: center;">
                <button class="btn btn-primary" onclick="window.location.hash='#/orders'" id="view-orders-btn">
                    View My Orders
                </button>
                <button class="btn btn-outline" onclick="window.location.hash='#/'" id="continue-shopping-btn">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}
