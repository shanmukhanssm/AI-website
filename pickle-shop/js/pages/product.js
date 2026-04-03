/* ============================================
   PRODUCT DETAIL PAGE — Tags instead of category
   ============================================ */

let pdQuantity = 1;

function renderProductPage(productId) {
    const product = getProductById(productId);
    if (!product) {
        document.getElementById('app-root').innerHTML = `
            <div class="empty-state" style="padding-top: 120px;">
                <div class="empty-icon"><i data-lucide="package-x"></i></div>
                <h3>Product not found</h3>
                <p>This pickle doesn't exist or has been removed.</p>
                <button class="btn btn-primary mt-3" onclick="window.location.hash='#/'">Go Home</button>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    pdQuantity = 1;
    const tags = product.tags || [];
    const primaryTag = tags[0] || '';
    const root = document.getElementById('app-root');

    const currentPrice = getDiscountedPrice(product);
    const hasDiscount = product.discount && product.discount > 0;
    const priceDisplay = hasDiscount
        ? `<span class="price-original">₹${product.price}</span>₹${currentPrice} <span class="discount-badge" style="position:relative;top:0;right:0;margin-left:8px;font-size:0.9rem;">-${product.discount}%</span>`
        : `₹${product.price}`;

    let detailsSection = '';
    if (product.isCombo) {
        const comboProducts = (product.comboItems || []).map(id => getProductById(id)).filter(Boolean);
        detailsSection = `
            <strong>Combo Includes:</strong>
            <ul style="margin-top: 8px; padding-left: 20px; color: var(--clr-text-secondary);">
                ${comboProducts.map(p => `<li>${p.name}</li>`).join('')}
            </ul>
        `;
    } else {
        detailsSection = `
            <strong>Ingredients</strong>
            <p style="margin-top: 4px;">${product.ingredients}</p>
        `;
    }

    root.innerHTML = `
        <div class="product-detail-page">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                <a href="#/">Home</a>
                <span>›</span>
                ${primaryTag ? `<a href="#/search?tag=${encodeURIComponent(primaryTag)}">${primaryTag}</a><span>›</span>` : ''}
                <span>${product.name}</span>
            </div>

            <!-- Product Top Section -->
            <div class="product-detail-top">
                <div class="product-detail-image" style="animation: scaleIn 0.5s ease;">
                    <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
                </div>
                <div class="product-detail-info" style="animation: slideUp 0.5s ease 0.1s both;">
                    <!-- Tags as clickable pills -->
                    <div class="pd-tags">
                        ${tags.map(t => `<a href="#/search?tag=${encodeURIComponent(t)}" class="pd-tag">${t}</a>`).join('')}
                    </div>

                    <h1 class="pd-name">${product.name}</h1>

                    <div class="pd-ingredients">
                        ${detailsSection}
                    </div>

                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="pd-price" data-price="${currentPrice}">${priceDisplay} <span>${product.isCombo ? '' : '/ 100gm'}</span></span>
                        <span style="font-size: 0.85rem; color: var(--clr-success); font-weight: 600;">In Stock</span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 6px; color: var(--clr-accent); font-size: 1rem;">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span style="color: var(--clr-text-muted); font-size: 0.85rem; margin-left: 4px;">${product.rating} (${product.reviews.length} reviews)</span>
                    </div>

                    <div class="pd-quantity">
                        <label>Quantity (100gm packs):</label>
                        <button class="qty-btn" onclick="changePdQty(-1)" id="pd-qty-minus">−</button>
                        <span class="qty-value" id="pd-qty-val">${pdQuantity}</span>
                        <button class="qty-btn" onclick="changePdQty(1)" id="pd-qty-plus">+</button>
                    </div>

                    <p style="font-size: 0.9rem; color: var(--clr-text-secondary);">
                        Total: <strong style="color: var(--clr-accent); font-size: 1.1rem;">₹<span id="pd-total">${currentPrice * pdQuantity}</span></strong>
                    </p>

                    <div class="pd-actions">
                        <button class="btn btn-primary btn-lg" onclick="handleBuyNow(${product.id})" id="buy-now-btn">
                            Buy Now
                        </button>
                        <button class="btn btn-outline btn-lg" onclick="addToCart(${product.id}, pdQuantity); showToast('Added to cart!'); renderNavbar();" id="add-to-cart-btn">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <!-- Reviews Section -->
            <div class="reviews-section" style="animation: slideUp 0.5s ease 0.3s both;">
                <h2>Customer Reviews (${product.reviews.length})</h2>
                ${product.reviews.map(r => `
                    <div class="review-card">
                        <div class="review-header">
                            <div class="review-avatar">${r.name.charAt(0)}</div>
                            <div class="review-meta">
                                <div class="review-name">${r.name}</div>
                                <div class="review-date">${new Date(r.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                        </div>
                        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                        <p class="review-text">${r.text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

function changePdQty(delta) {
    pdQuantity = Math.max(1, pdQuantity + delta);
    document.getElementById('pd-qty-val').textContent = pdQuantity;
    const price = parseInt(document.querySelector('.pd-price').dataset.price);
    document.getElementById('pd-total').textContent = price * pdQuantity;
}

function handleBuyNow(productId) {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to place an order', 'warning');
        window.location.hash = '#/login';
        return;
    }
    addToCart(productId, pdQuantity);
    renderNavbar();
    window.location.hash = '#/checkout';
}
