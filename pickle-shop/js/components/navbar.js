/* ============================================
   NAVBAR COMPONENT — Lucide Icons, No Emojis
   ============================================ */

function renderNavbar() {
    const nav = document.getElementById('main-navbar');
    const user = getCurrentUser();
    const cartCount = getCartCount();
    const currentHash = window.location.hash || '#/';
    const adminLoggedIn = isAdminLoggedIn();

    const isActive = (hash) => currentHash.startsWith(hash) ? 'active' : '';

    nav.innerHTML = `
        <div class="navbar">
            <a class="navbar-brand" href="#/" id="nav-brand">
                <i data-lucide="flask-conical" class="brand-icon"></i>
                <span>Pickle Palace</span>
            </a>
            <div class="navbar-links">
                <a class="nav-link ${isActive('#/') && !currentHash.includes('admin') && !currentHash.includes('cart') && !currentHash.includes('orders') && !currentHash.includes('login') && !currentHash.includes('checkout') ? 'active' : ''}" href="#/" id="nav-explore">
                    <i data-lucide="compass" class="nav-icon"></i>
                    <span class="nav-text">Explore</span>
                </a>
                <a class="nav-link ${isActive('#/cart')}" href="#/cart" id="nav-cart" style="position: relative;">
                    <i data-lucide="shopping-cart" class="nav-icon"></i>
                    <span class="nav-text">Cart</span>
                    ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
                </a>
                ${user ? `
                    <a class="nav-link ${isActive('#/orders')}" href="#/orders" id="nav-orders">
                        <i data-lucide="package" class="nav-icon"></i>
                        <span class="nav-text">My Orders</span>
                    </a>
                    <a class="nav-link" href="#" id="nav-logout" onclick="logoutUser(); window.location.hash='#/'; return false;">
                        <i data-lucide="log-out" class="nav-icon"></i>
                        <span class="nav-text">${user.name.split(' ')[0]}</span>
                    </a>
                ` : `
                    <a class="nav-link ${isActive('#/login')}" href="#/login" id="nav-login">
                        <i data-lucide="user" class="nav-icon"></i>
                        <span class="nav-text">Login</span>
                    </a>
                `}
                ${adminLoggedIn ? `
                    <span style="width: 1px; height: 28px; background: rgba(255,255,255,0.15); margin: 0 4px;"></span>
                    <a class="nav-link ${isActive('#/admin/products')}" href="#/admin/products" id="nav-admin-products">
                        <i data-lucide="box" class="nav-icon"></i>
                        <span class="nav-text">Products</span>
                    </a>
                    <a class="nav-link ${isActive('#/admin/orders')}" href="#/admin/orders" id="nav-admin-orders">
                        <i data-lucide="clipboard-list" class="nav-icon"></i>
                        <span class="nav-text">Orders</span>
                    </a>
                    <a class="nav-link" href="#" id="nav-admin-logout" onclick="logoutAdmin(); renderNavbar(); showToast('Admin logged out', 'info'); window.location.hash='#/'; return false;">
                        <i data-lucide="lock" class="nav-icon"></i>
                        <span class="nav-text">Logout</span>
                    </a>
                ` : ``}

            </div>
        </div>
    `;

    // Initialize Lucide icons in navbar
    if (window.lucide) lucide.createIcons();
}
