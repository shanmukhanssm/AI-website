/* ============================================
   APP ROUTER & INITIALIZATION
   ============================================ */

function parseHash() {
    const hash = window.location.hash || '#/';
    const [path, queryString] = hash.slice(1).split('?');
    const params = new URLSearchParams(queryString || '');
    return { path, params };
}

async function router() {
    const { path, params } = parseHash();

    // Re-render navbar on every route change
    renderNavbar();

    // Animate page content
    const root = document.getElementById('app-root');
    root.style.animation = 'none';
    root.offsetHeight; // trigger reflow
    root.style.animation = 'fadeIn 0.35s ease';

    // Route matching
    if (path === '/' || path === '') {
        await renderHomePage();
    } else if (path === '/search') {
        await renderSearchPage(params);
    } else if (path.startsWith('/product/')) {
        const productId = path.split('/')[2];
        await renderProductPage(productId);
    } else if (path === '/cart') {
        await renderCartPage();
    } else if (path === '/checkout') {
        await renderCheckoutPage();
    } else if (path === '/orders') {
        await renderOrdersPage();
    } else if (path === '/login') {
        await renderLoginPage();
    } else if (path === '/admin') {
        // Redirect /admin to login or products
        window.location.hash = isAdminLoggedIn() ? '#/admin/products' : '#/admin/login';
        return;
    } else if (path === '/admin/login') {
        // Admin login page (always accessible)
        if (isAdminLoggedIn()) {
            window.location.hash = '#/admin/products';
            return;
        }
        await renderAdminLoginPage();
    } else if (path === '/admin/products') {
        // Protected: require admin auth
        if (!isAdminLoggedIn()) {
            showToast('Please login as admin first', 'warning');
            window.location.hash = '#/admin/login';
            return;
        }
        await renderAdminProductsPage();
    } else if (path === '/admin/orders') {
        // Protected: require admin auth
        if (!isAdminLoggedIn()) {
            showToast('Please login as admin first', 'warning');
            window.location.hash = '#/admin/login';
            return;
        }
        await renderAdminOrdersPage();
    } else {
        // 404
        root.innerHTML = `
            <div class="empty-state" style="padding-top: 120px;">
                <div class="empty-icon"><i data-lucide="search"></i></div>
                <h3>Page Not Found</h3>
                <p>The page you're looking for doesn't exist.</p>
                <button class="btn btn-primary mt-3" onclick="window.location.hash='#/'">Go Home</button>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
}

// Listen for hash changes
window.addEventListener('hashchange', router);

// Initial route
window.addEventListener('DOMContentLoaded', () => {
    initSeedData();
    router();
});
