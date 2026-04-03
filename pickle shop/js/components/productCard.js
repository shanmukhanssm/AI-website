/* ============================================
   PRODUCT CARD COMPONENT — Tag-based badges
   ============================================ */

function renderProductCard(product) {
    let badgeTag = (product.tags && product.tags.length > 0) ? product.tags[0].toUpperCase() : '';
    let badgeClass = '';
    
    // Determine badge styling
    if (product.isCombo) {
        badgeTag = 'COMBO';
        badgeClass = 'combo-badge';
    } else {
        const isVeg = product.tags && product.tags.includes('veg');
        const isNonVeg = product.tags && product.tags.includes('non-veg');
        badgeClass = isNonVeg ? 'category-badge--nonveg' : (isVeg ? 'category-badge--veg' : '');
    }

    const hasDiscount = product.discount && product.discount > 0;
    const currentPrice = hasDiscount ? getDiscountedPrice(product) : product.price;
    const priceDisplay = hasDiscount 
        ? `<span class="price-original">₹${product.price}</span>₹${currentPrice}`
        : `₹${product.price}`;

    const desc = product.isCombo ? 'A special combo offering multiple items.' : product.ingredients;

    return `
        <div class="card product-card" onclick="window.location.hash='#/product/${product.id}'" id="product-card-${product.id}">
            <div class="product-image-wrap">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'">
                ${badgeTag ? `<span class="category-badge ${badgeClass}">${badgeTag}</span>` : ''}
                ${hasDiscount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-desc">${desc}</div>
                <div class="product-bottom">
                    <div class="product-price">${priceDisplay} <span>${product.isCombo ? '' : '/ 100gm'}</span></div>
                    <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id}); showToast('Added to cart!'); renderNavbar();" id="add-cart-${product.id}" title="Add to cart">+</button>
                </div>
            </div>
        </div>
    `;
}
