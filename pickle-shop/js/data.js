/* ============================================
   DATA LAYER — Seed Data & localStorage Helpers
   Tag-based filtering (no categories/subcategories)
   ============================================ */

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

/* --- Seed Products (with tags) --- */
const SEED_PRODUCTS = [
    {
        id: 1, name: "Classic Mango Pickle",
        tags: ["veg", "mango", "spicy", "traditional", "tangy", "fruit"],
        image: "assets/pickle_mango.png",
        ingredients: "Raw Mangoes, Mustard Oil, Fenugreek Seeds, Fennel Seeds, Red Chili Powder, Turmeric, Salt, Asafoetida",
        price: 120, discount: 10, rating: 4.8, reviews: [
            { name: "Priya S.", date: "2026-02-15", rating: 5, text: "Tastes just like my grandmother used to make! Absolutely authentic." },
            { name: "Rahul M.", date: "2026-01-20", rating: 5, text: "The perfect balance of spice and tang. Will order again!" },
            { name: "Anita K.", date: "2025-12-10", rating: 4, text: "Very good quality, slightly too oily for my taste but delicious!" }
        ]
    },
    {
        id: 2, name: "Tangy Lemon Pickle",
        tags: ["veg", "lemon", "tangy", "sour", "citrus", "traditional"],
        image: "assets/pickle_lemon.png",
        ingredients: "Fresh Lemons, Mustard Oil, Red Chili Powder, Fenugreek Seeds, Mustard Seeds, Turmeric, Salt",
        price: 100, rating: 4.6, reviews: [
            { name: "Sneha R.", date: "2026-03-01", rating: 5, text: "Perfect tangy flavor! Goes great with dal rice." },
            { name: "Vikram T.", date: "2026-02-10", rating: 4, text: "Good lemon pickle, nice and sour." }
        ]
    },
    {
        id: 3, name: "Spicy Chicken Pickle",
        tags: ["non-veg", "chicken", "spicy", "meat", "hot", "premium"],
        image: "assets/pickle_chicken.png",
        ingredients: "Boneless Chicken, Gingelly Oil, Red Chili Powder, Garlic, Ginger, Fenugreek Seeds, Mustard Seeds, Curry Leaves, Salt",
        price: 250, rating: 4.9, reviews: [
            { name: "Arjun D.", date: "2026-03-10", rating: 5, text: "Best chicken pickle I've ever had! Incredibly flavorful." },
            { name: "Meera P.", date: "2026-02-25", rating: 5, text: "Spicy, tender chicken pieces. Absolutely addictive!" },
            { name: "Kiran V.", date: "2026-01-15", rating: 5, text: "Premium quality! You can taste the freshness." }
        ]
    },
    {
        id: 4, name: "Kerala Prawn Pickle",
        tags: ["non-veg", "prawn", "seafood", "kerala", "spicy", "premium", "coastal"],
        image: "assets/pickle_prawn.png",
        ingredients: "Fresh Prawns, Coconut Oil, Kodampuli (Malabar Tamarind), Red Chili, Garlic, Ginger, Curry Leaves, Fenugreek, Salt",
        price: 300, rating: 4.7, reviews: [
            { name: "Thomas J.", date: "2026-02-20", rating: 5, text: "Authentic Kerala taste! The prawns are perfectly spiced." },
            { name: "Deepa N.", date: "2026-01-30", rating: 4, text: "Really good prawn pickle. Slightly pricey but worth it." }
        ]
    },
    {
        id: 5, name: "Traditional Fish Pickle",
        tags: ["non-veg", "fish", "seafood", "traditional", "goan", "spicy"],
        image: "assets/pickle_fish.png",
        ingredients: "King Fish, Gingelly Oil, Red Chili Powder, Garlic, Vinegar, Fenugreek Seeds, Mustard Seeds, Turmeric, Salt",
        price: 280, rating: 4.5, reviews: [
            { name: "Suresh G.", date: "2026-03-05", rating: 5, text: "Reminds me of Goa! Excellent fish pickle." },
            { name: "Lakshmi R.", date: "2026-02-15", rating: 4, text: "Great product. Fish pieces are generous and well-marinated." }
        ]
    },
    {
        id: 6, name: "Mixed Vegetable Pickle",
        tags: ["veg", "mixed", "vegetables", "crunchy", "mild", "traditional"],
        image: "assets/pickle_mixed_veg.png",
        ingredients: "Carrots, Cauliflower, Green Chilies, Raw Mango, Mustard Oil, Fenugreek, Mustard Seeds, Turmeric, Red Chili, Salt",
        price: 110, rating: 4.4, reviews: [
            { name: "Geeta M.", date: "2026-02-28", rating: 4, text: "Lovely mix of vegetables. Good crunchy texture." },
            { name: "Sanjay K.", date: "2026-01-25", rating: 5, text: "My whole family loves this. Great taste and value." }
        ]
    },
    {
        id: 7, name: "Hot Garlic Pickle",
        tags: ["veg", "garlic", "hot", "spicy", "pungent", "bold"],
        image: "assets/pickle_mango.png",
        ingredients: "Garlic Cloves, Mustard Oil, Red Chili Powder, Fenugreek Seeds, Vinegar, Mustard Seeds, Salt",
        price: 130, rating: 4.3, reviews: [
            { name: "Ravi P.", date: "2026-03-12", rating: 4, text: "Nice garlic punch! Goes perfectly with parathas." }
        ]
    },
    {
        id: 8, name: "Amla (Gooseberry) Pickle",
        tags: ["veg", "amla", "gooseberry", "fruit", "tangy", "healthy", "sour"],
        image: "assets/pickle_lemon.png",
        ingredients: "Indian Gooseberry (Amla), Mustard Oil, Fenugreek Seeds, Red Chili Powder, Mustard Seeds, Turmeric, Asafoetida, Salt",
        price: 140, rating: 4.6, reviews: [
            { name: "Kavita D.", date: "2026-02-18", rating: 5, text: "Healthy and delicious! Love the sourness of amla in this." },
            { name: "Mohan S.", date: "2026-01-12", rating: 4, text: "Good quality amla pickle. Tangy and flavorful." }
        ]
    },
    {
        id: 9, name: "Red Chili Pickle",
        tags: ["veg", "chili", "hot", "spicy", "fiery", "stuffed"],
        image: "assets/pickle_chicken.png",
        ingredients: "Stuffed Red Chilies, Mustard Seeds, Fennel Seeds, Fenugreek, Mustard Oil, Amchur, Salt",
        price: 90, rating: 4.2, reviews: [
            { name: "Ajay T.", date: "2026-03-08", rating: 4, text: "Fiery and fantastic! Not for the faint-hearted." }
        ]
    },
    {
        id: 10, name: "Mutton Pickle",
        tags: ["non-veg", "mutton", "meat", "premium", "rich", "spicy"],
        image: "assets/pickle_fish.png",
        ingredients: "Tender Mutton, Gingelly Oil, Red Chili Powder, Garlic, Ginger, Curry Leaves, Fenugreek, Mustard Seeds, Salt",
        price: 350, rating: 4.8, reviews: [
            { name: "Farah K.", date: "2026-02-22", rating: 5, text: "Rich and succulent! The mutton just melts in your mouth." },
            { name: "Prakash R.", date: "2026-01-18", rating: 5, text: "Never tasted such good mutton pickle. Premium quality." }
        ]
    },
    {
        id: 11, name: "Sweet Lime Pickle",
        tags: ["veg", "lime", "sweet", "tangy", "fruit", "mild", "kids"],
        image: "assets/pickle_lemon.png",
        ingredients: "Sweet Lime, Sugar, Red Chili Powder, Mustard Seeds, Fenugreek, Salt, Vinegar",
        price: 115, rating: 4.1, reviews: [
            { name: "Neha G.", date: "2026-03-15", rating: 4, text: "Sweet and sour, very unique taste. Kids love it!" }
        ]
    },
    {
        id: 12, name: "Gongura Pickle",
        tags: ["veg", "gongura", "andhra", "regional", "tangy", "traditional", "south indian"],
        image: "assets/pickle_mixed_veg.png",
        ingredients: "Gongura Leaves, Gingelly Oil, Red Chili Powder, Garlic, Mustard Seeds, Fenugreek, Cumin Seeds, Salt",
        price: 160, rating: 4.7, reviews: [
            { name: "Srinivas B.", date: "2026-03-02", rating: 5, text: "Authentic Andhra gongura! Taste is spot on." },
            { name: "Padma L.", date: "2026-02-05", rating: 5, text: "This takes me back home. Perfect gongura pickle." }
        ]
    },
    {
        id: 13, name: "Spicy & Sweet Combo (Mango + Lime)",
        tags: ["combo", "veg", "gift", "mixed"],
        image: "assets/pickle_mango.png",
        ingredients: "",
        isCombo: true,
        comboItems: [1, 11],
        price: 235,
        discount: 15,
        rating: 4.9, reviews: [
            { name: "Customer X.", date: "2026-03-25", rating: 5, text: "Great combo offer, perfect flavors together!" }
        ]
    }
];

/* --- Init seed data if not present --- */
function initSeedData() {
    if (!Store.get('products') || !Store.get('productsV3')) {
        // Force re-seed with combos and discounts
        Store.set('products', SEED_PRODUCTS);
        Store.set('productsV3', true);
    }
    if (!Store.get('orders')) {
        Store.set('orders', []);
    }
    if (!Store.get('users')) {
        Store.set('users', []);
    }
    if (!Store.get('nextProductId')) {
        Store.set('nextProductId', 14);
    }
    if (!Store.get('nextOrderId')) {
        Store.set('nextOrderId', 1001);
    }
}

/* --- Product Helpers --- */
function getDiscountedPrice(product) {
    if (!product || !product.price) return 0;
    if (product.discount && product.discount > 0) {
        return Math.floor(product.price * (1 - (product.discount / 100)));
    }
    return product.price;
}

function getAllProducts() {
    return Store.get('products') || [];
}

function getProductById(id) {
    return getAllProducts().find(p => p.id === parseInt(id));
}

/* Get all unique tags from all products */
function getAllTags() {
    const products = getAllProducts();
    const tagSet = new Set();
    products.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
            p.tags.forEach(t => tagSet.add(t.toLowerCase()));
        }
    });
    return [...tagSet].sort();
}

/* Get popular tags (sorted by frequency) */
function getPopularTags(limit = 12) {
    const products = getAllProducts();
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
}

/* Search products by query string and/or tag filter */
function searchProducts(query, tag) {
    let products = getAllProducts();
    if (query) {
        const normalize = (s) => s.toLowerCase().replace(/[-\s]+/g, ' ').trim();
        const q = normalize(query);
        products = products.filter(p => {
            // Check name and ingredients with substring match
            if (normalize(p.name).includes(q)) return true;
            if (normalize(p.ingredients).includes(q)) return true;
            // Check tags with EXACT match (so "veg" won't match "non veg")
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
}

function saveProduct(product) {
    const products = getAllProducts();
    const idx = products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
        products[idx] = product;
    } else {
        products.push(product);
    }
    Store.set('products', products);
}

function deleteProduct(id) {
    const products = getAllProducts().filter(p => p.id !== parseInt(id));
    Store.set('products', products);
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

function getCartTotal() {
    const cart = getCart();
    const products = getAllProducts();
    return cart.reduce((sum, c) => {
        const p = products.find(pr => pr.id === c.productId);
        return sum + (p ? getDiscountedPrice(p) * c.qty : 0);
    }, 0);
}

/* --- Order Helpers --- */
function getAllOrders() {
    return Store.get('orders') || [];
}

function getUserOrders(username) {
    return getAllOrders().filter(o => o.username === username);
}

function createOrder(orderData) {
    const orders = getAllOrders();
    const id = Store.get('nextOrderId') || 1001;
    const order = {
        id,
        ...orderData,
        status: 'Pending',
        date: new Date().toISOString()
    };
    orders.push(order);
    Store.set('orders', orders);
    Store.set('nextOrderId', id + 1);
    return order;
}

function updateOrderStatus(orderId, status) {
    const orders = getAllOrders();
    const order = orders.find(o => o.id === parseInt(orderId));
    if (order) {
        order.status = status;
        Store.set('orders', orders);
    }
}

/* --- Auth Helpers --- */
function getCurrentUser() {
    return Store.get('currentUser');
}

function loginUser(username, password) {
    const users = Store.get('users') || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        Store.set('currentUser', { username: user.username, name: user.name });
        return true;
    }
    return false;
}

function registerUser(name, username, password) {
    const users = Store.get('users') || [];
    if (users.find(u => u.username === username)) return false;
    users.push({ name, username, password });
    Store.set('users', users);
    Store.set('currentUser', { username, name });
    return true;
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

/* --- Init on load --- */
initSeedData();
