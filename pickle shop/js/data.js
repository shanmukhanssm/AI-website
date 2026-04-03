/* ============================================
   DATA LAYER — Node API & localStorage Helpers
   ============================================ */

const API_BASE = '/api';

const Store = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key)); }
        catch { return null; }
    },
    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

/* --- Product Helpers --- */
function getDiscountedPrice(product) {
    if (!product || !product.price) return 0;
    if (product.discount && product.discount > 0) {
        return Math.floor(product.price * (1 - (product.discount / 100)));
    }
    return product.price;
}

async function getAllProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        throw error;
    }
}

async function getProductById(id) {
    try {
        const products = await getAllProducts();
        return products.find(p => p.id === parseInt(id));
    } catch (error) {
        console.error('Error in getProductById:', error);
        throw error;
    }
}

async function getAllTags() {
    try {
        const products = await getAllProducts();
        const tagSet = new Set();
        products.forEach(p => {
            if (p.tags && Array.isArray(p.tags)) {
                p.tags.forEach(t => tagSet.add(t.toLowerCase()));
            }
        });
        return [...tagSet].sort();
    } catch (error) {
        console.error('Error in getAllTags:', error);
        throw error;
    }
}

async function getPopularTags(limit = 12) {
    try {
        const products = await getAllProducts();
        const tagCount = {};
        products.forEach(p => {
            if (p.tags && Array.isArray(p.tags)) {
                p.tags.forEach(t => {
                    const tag = t.toLowerCase();
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                });
            }
        });
        return Object.entries(tagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([tag, count]) => ({ tag, count }));
    } catch (error) {
        console.error('Error in getPopularTags:', error);
        throw error;
    }
}

async function searchProducts(query, tag) {
    try {
        let products = await getAllProducts();
        if (query) {
            const normalize = (s) => s.toLowerCase().replace(/[-\s]+/g, ' ').trim();
            const q = normalize(query);
            products = products.filter(p => {
                if (normalize(p.name).includes(q)) return true;
                if (p.ingredients && normalize(p.ingredients).includes(q)) return true;
                if (p.tags && p.tags.some(t => normalize(t) === q)) return true;
                return false;
            });
        }
        if (tag) {
            const tagLower = tag.toLowerCase();
            products = products.filter(p =>
                p.tags && p.tags.some(t => t.toLowerCase() === tagLower)
            );
        }
        return products;
    } catch (error) {
        console.error('Error in searchProducts:', error);
        throw error;
    }
}

async function saveProduct(product) {
    try {
        const res = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!res.ok) {
            throw new Error(`Failed to save product: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error in saveProduct:', error);
        throw error;
    }
}

async function deleteProduct(id) {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            throw new Error(`Failed to delete product: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        throw error;
    }
}

/* --- Cart Helpers --- */
function getCart() {
    return Store.get('cart') || [];
}

function addToCart(productId, qty = 1) {
    const cart = getCart();
    const existing = cart.find(c => c.productId === parseInt(productId));
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ productId: parseInt(productId), qty });
    }
    Store.set('cart', cart);
}

function updateCartQty(productId, qty) {
    let cart = getCart();
    if (qty <= 0) {
        cart = cart.filter(c => c.productId !== parseInt(productId));
    } else {
        const item = cart.find(c => c.productId === parseInt(productId));
        if (item) item.qty = qty;
    }
    Store.set('cart', cart);
}

function removeFromCart(productId) {
    const cart = getCart().filter(c => c.productId !== parseInt(productId));
    Store.set('cart', cart);
}

function clearCart() {
    Store.set('cart', []);
}

function getCartCount() {
    return getCart().reduce((sum, c) => sum + c.qty, 0);
}

async function getCartTotal() {
    const cart = getCart();
    const products = await getAllProducts();
    return cart.reduce((sum, c) => {
        const p = products.find(pr => pr.id === c.productId);
        return sum + (p ? getDiscountedPrice(p) * c.qty : 0);
    }, 0);
}

/* --- Order Helpers --- */
async function getAllOrders() {
    try {
        const res = await fetch(`${API_BASE}/orders`);
        if (!res.ok) {
            throw new Error(`Failed to fetch orders: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        throw error;
    }
}

async function getUserOrders(username) {
    try {
        const res = await fetch(`${API_BASE}/orders/${username}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch user orders: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        throw error;
    }
}

async function createOrder(orderData) {
    try {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (!res.ok) {
            throw new Error(`Failed to create order: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error in createOrder:', error);
        throw error;
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) {
            throw new Error(`Failed to update order status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        throw error;
    }
}

/* --- Auth Helpers --- */
function getCurrentUser() {
    return Store.get('currentUser');
}

async function loginUser(username, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            throw new Error(`Login failed: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
            Store.set('currentUser', data.user);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error in loginUser:', error);
        return false;
    }
}

async function registerUser(name, username, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password })
        });
        if (!res.ok) {
            throw new Error(`Registration failed: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
            Store.set('currentUser', data.user);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error in registerUser:', error);
        return false;
    }
}

function logoutUser() {
    Store.remove('currentUser');
}

/* --- Admin Auth --- */
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'pickle@2026'
};

function isAdminLoggedIn() {
    return sessionStorage.getItem('adminAuth') === 'true';
}

function loginAdmin(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminAuth', 'true');
        return true;
    }
    return false;
}

function logoutAdmin() {
    sessionStorage.removeItem('adminAuth');
}

function initSeedData() {
    if (!Store.get('cart')) Store.set('cart', []);
}
initSeedData();
