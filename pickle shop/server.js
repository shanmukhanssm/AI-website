const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(__dirname));

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'db.json');

// Ensure data dir exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const SEED_PRODUCTS = [
    {
        id: 1, name: "Classic Mango Pickle",
        tags: ["veg", "mango", "spicy", "traditional", "tangy", "fruit"],
        image: "assets/pickle_mango.png",
        ingredients: "Raw Mangoes, Mustard Oil, Fenugreek Seeds, Fennel Seeds, Red Chili Powder, Turmeric, Salt, Asafoetida",
        price: 120, discount: 10, rating: 4.8, reviews: [
            { name: "Priya S.", date: "2026-02-15", rating: 5, text: "Tastes just like my grandmother used to make! Absolutely authentic." },
            { name: "Rahul M.", date: "2026-01-20", rating: 5, text: "The perfect balance of spice and tang. Will order again!" }
        ]
    },
    {
        id: 2, name: "Tangy Lemon Pickle",
        tags: ["veg", "lemon", "tangy", "sour", "citrus", "traditional"],
        image: "assets/pickle_lemon.png",
        ingredients: "Fresh Lemons, Mustard Oil, Red Chili Powder, Fenugreek Seeds, Mustard Seeds, Turmeric, Salt",
        price: 100, rating: 4.6, reviews: []
    },
    {
        id: 3, name: "Spicy Chicken Pickle",
        tags: ["non-veg", "chicken", "spicy", "meat", "hot", "premium"],
        image: "assets/pickle_chicken.png",
        ingredients: "Boneless Chicken, Gingelly Oil, Red Chili Powder, Garlic, Ginger",
        price: 250, rating: 4.9, reviews: []
    },
    {
        id: 13, name: "Spicy & Sweet Combo (Mango + Lime)",
        tags: ["combo", "veg", "gift", "mixed"],
        image: "assets/pickle_mango.png",
        ingredients: "",
        isCombo: true,
        comboItems: [1, 2],
        price: 235,
        discount: 15,
        rating: 4.9, reviews: []
    }
];

function initDb() {
    if (!fs.existsSync(dbPath)) {
        const initialData = {
            products: SEED_PRODUCTS,
            orders: [],
            users: [{ name: "Test User", username: "test", password: "123" }],
            nextOrderId: 1001,
            nextProductId: 14
        };
        fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    }
}
initDb();

function readDb() {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
}

function writeDb(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
    const db = readDb();
    res.json(db.products);
});

app.post('/api/products', (req, res) => {
    const db = readDb();
    const product = req.body;
    
    // Add or update
    const idx = db.products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
        db.products[idx] = product;
    } else {
        if (!product.id) {
            product.id = db.nextProductId++;
        }
        db.products.push(product);
    }
    writeDb(db);
    res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    db.products = db.products.filter(p => p.id !== id);
    writeDb(db);
    res.json({ success: true });
});

// --- ORDERS API ---
app.get('/api/orders', (req, res) => {
    const db = readDb();
    res.json(db.orders);
});

app.get('/api/orders/:username', (req, res) => {
    const db = readDb();
    const orders = db.orders.filter(o => o.username === req.params.username);
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const db = readDb();
    const order = req.body;
    
    order.id = db.nextOrderId++;
    order.status = 'Pending';
    order.date = new Date().toISOString();
    
    db.orders.push(order);
    writeDb(db);
    
    res.json(order);
});

app.put('/api/orders/:id/status', (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    const order = db.orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        writeDb(db);
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// --- USERS & AUTH API ---
app.post('/api/auth/login', (req, res) => {
    const db = readDb();
    const { username, password } = req.body;
    const user = db.users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, user: { username: user.username, name: user.name } });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

app.post('/api/auth/register', (req, res) => {
    const db = readDb();
    const { name, username, password } = req.body;
    if (db.users.find(u => u.username === username)) {
        res.status(400).json({ success: false, error: 'Username taken' });
    } else {
        const newUser = { name, username, password };
        db.users.push(newUser);
        writeDb(db);
        res.json({ success: true, user: { username, name } });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
