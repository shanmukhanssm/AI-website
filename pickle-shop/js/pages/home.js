/* ============================================
   HOME / EXPLORE PAGE — Veg / Non-Veg browse
   ============================================ */

function renderHomePage() {
    const products = getAllProducts();
    const featured = products.slice(0, 8);
    const vegCount = products.filter(p => p.tags && p.tags.includes('veg')).length;
    const nonVegCount = products.filter(p => p.tags && p.tags.includes('non-veg')).length;

    const root = document.getElementById('app-root');
    root.innerHTML = `
        <!-- Hero Section with photo background -->
        <section class="hero" style="background-image: url('assets/hero_bg.png');">
            <div class="hero-content">
                <h1>Handcrafted Pickles,<br>Delivered Fresh</h1>
                <p class="hero-subtitle">
                    From our kitchen to yours — authentic recipes passed down through generations. 
                    Made with hand-picked ingredients, cold-pressed oils, and the perfect blend of spices.
                </p>
                <div class="hero-search search-container" id="hero-search">
                    <span class="search-icon"><i data-lucide="search"></i></span>
                    <input type="text" class="search-input" id="home-search-input" placeholder="Search pickles... try 'chicken', 'mango', or 'spicy'" />
                    <button class="search-btn" id="home-search-btn" onclick="handleHomeSearch()">Search</button>
                </div>
                <p class="hero-trust-line">100% Handmade · No Preservatives · Cold-pressed Oils · Cash on Delivery</p>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- Browse by Type -->
        <section class="categories-section">
            <h2 class="section-title">Browse by Type</h2>
            <p class="section-subtitle">Choose your preference</p>
            <div class="type-cards">
                <a class="type-card" href="#/search?tag=veg" id="browse-veg">
                    <i data-lucide="leaf" class="type-icon"></i>
                    <div class="type-info">
                        <span class="type-name">Vegetarian</span>
                        <span class="type-count">${vegCount} pickles</span>
                    </div>
                    <i data-lucide="arrow-right" class="type-arrow"></i>
                </a>
                <a class="type-card" href="#/search?tag=non-veg" id="browse-nonveg">
                    <i data-lucide="drumstick" class="type-icon"></i>
                    <div class="type-info">
                        <span class="type-name">Non-Vegetarian</span>
                        <span class="type-count">${nonVegCount} pickles</span>
                    </div>
                    <i data-lucide="arrow-right" class="type-arrow"></i>
                </a>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- Featured Products -->
        <section class="featured-section">
            <h2 class="section-title">Featured Pickles</h2>
            <p class="section-subtitle">Our most popular and loved pickles</p>
            <div class="product-grid">
                ${featured.map(p => renderProductCard(p)).join('')}
            </div>
        </section>

        <!-- Footer -->
        <footer class="site-footer">
            <p><strong class="footer-brand">Pickle Palace</strong> — Handcrafted with love</p>
            <p style="margin-top: 6px;">© 2026 All rights reserved</p>
        </footer>
    `;

    document.getElementById('home-search-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleHomeSearch();
    });

    if (window.lucide) lucide.createIcons();
}

function handleHomeSearch() {
    const query = document.getElementById('home-search-input').value.trim();
    if (query) {
        window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
    }
}
