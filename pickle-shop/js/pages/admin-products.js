/* ============================================
   ADMIN: PRODUCT MANAGEMENT — Tag-based & Combos
   ============================================ */

let editingProduct = null;
let isComboModal = false;

function renderAdminProductsPage() {
    const products = getAllProducts();
    const root = document.getElementById('app-root');

    root.innerHTML = `
        <div class="admin-page">
            <div class="admin-header">
                <div>
                    <h1><i data-lucide="settings"></i> Product Management</h1>
                    <p class="admin-subtitle">Create, edit, and manage your pickle products & combos</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <a href="#/admin/orders" class="btn btn-ghost" style="margin-right: 1rem;">Manage Orders</a>
                    <button class="btn btn-secondary" onclick="openComboModal()" id="create-combo-btn">+ New Combo</button>
                    <button class="btn btn-primary" onclick="openProductModal()" id="create-product-btn">+ New Product</button>
                </div>
            </div>
            <div class="admin-table">
                <table>
                    <thead><tr><th>Product</th><th>Tags</th><th>Price</th><th>Rating</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${products.map(p => `
                            <tr id="admin-product-row-${p.id}">
                                <td><div class="product-cell"><img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'"><div><strong>${p.name}</strong></div></div></td>
                                <td><div style="display:flex;flex-wrap:wrap;gap:4px;">${p.isCombo ? '<span class="admin-tag" style="background:var(--clr-primary);color:var(--clr-surface);">COMBO</span>' : ''}${(p.tags || []).filter(t=>t!=='combo').slice(0, 4).map(t => `<span class="admin-tag">${t}</span>`).join('')}${(p.tags || []).filter(t=>t!=='combo').length > 4 ? `<span class="admin-tag" style="opacity:0.6;">+${(p.tags || []).filter(t=>t!=='combo').length - 4}</span>` : ''}</div></td>
                                <td style="font-weight:700;">₹${p.discount ? getDiscountedPrice(p) + ' <small style="text-decoration:line-through;color:var(--clr-text-muted);">₹'+p.price+'</small> <span style="color:var(--clr-danger);font-size:0.8rem;">(-'+p.discount+'%)</span>' : p.price}</td>
                                <td><span style="color:var(--clr-accent);">★</span> ${p.rating}</td>
                                <td><div class="actions">
                                    <button class="btn btn-ghost btn-sm" onclick="${p.isCombo ? `openComboModal(${p.id})` : `openProductModal(${p.id})`}">Edit</button>
                                    <button class="btn btn-ghost btn-sm" onclick="handleDeleteProduct(${p.id})" style="color:var(--clr-danger);">Delete</button>
                                </div></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${products.length === 0 ? '<div class="empty-state mt-4"><div class="empty-icon"><i data-lucide="box"></i></div><h3>No products yet</h3><p>Start by creating your first product or combo!</p></div>' : ''}
        </div>
        <div id="product-modal-container"></div>
    `;
    if (window.lucide) lucide.createIcons();
}

function openProductModal(productId) {
    editingProduct = productId ? getProductById(productId) : null;
    isComboModal = false;
    const isEdit = !!editingProduct;
    const tagsStr = isEdit ? (editingProduct.tags || []).join(', ') : '';

    const container = document.getElementById('product-modal-container');
    container.innerHTML = `
        <div class="modal-overlay" onclick="closeProductModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <h2>${isEdit ? 'Edit Product' : 'Create New Product'}</h2>
                <form id="product-form" onsubmit="handleSaveProduct(event)">
                    <div class="form-group">
                        <label class="form-label">Product Name *</label>
                        <input type="text" class="form-input" id="prod-name" placeholder="e.g., Spicy Mango Pickle" required value="${isEdit ? editingProduct.name : ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tags / Keywords *</label>
                        <input type="text" class="form-input" id="prod-tags" placeholder="e.g., veg, mango, spicy, tangy, fruit" required value="${tagsStr}">
                        <span style="font-size: 0.75rem; color: var(--clr-text-muted);">Enter comma-separated keywords. Example: veg, mango, spicy</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Image URL</label>
                        <input type="text" class="form-input" id="prod-image" value="${isEdit ? editingProduct.image : 'assets/pickle_mango.png'}">
                    </div>
                    <div class="form-group" id="ingredients-group" style="display:flex; flex-direction:column; gap:6px;">
                        <label class="form-label">Ingredients *</label>
                        <textarea class="form-textarea form-input" id="prod-ingredients" required placeholder="e.g., Raw Mangoes, Mustard Oil, Red Chili Powder, Salt...">${isEdit ? editingProduct.ingredients : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Price per 100gm (₹) *</label>
                        <input type="number" class="form-input" id="prod-price" placeholder="e.g., 150" required min="1" value="${isEdit ? editingProduct.price : ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Discount (%) (Optional)</label>
                        <input type="number" class="form-input" id="prod-discount" placeholder="e.g., 10" min="0" max="100" value="${isEdit ? (editingProduct.discount || '') : ''}">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-ghost" onclick="closeProductModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="save-product-btn">${isEdit ? 'Save Changes' : 'Create Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function openComboModal(productId) {
    editingProduct = productId ? getProductById(productId) : null;
    isComboModal = true;
    const isEdit = !!editingProduct;
    // Filter out "combo" tag from display to avoid confusing users
    const tagsArr = isEdit ? (editingProduct.tags || []).filter(t => t !== 'combo') : [];
    const tagsStr = tagsArr.join(', ');

    const container = document.getElementById('product-modal-container');
    container.innerHTML = `
        <div class="modal-overlay" onclick="closeProductModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <h2>${isEdit ? 'Edit Combo' : 'Create New Combo'}</h2>
                <form id="combo-form" onsubmit="handleSaveProduct(event)">
                    <div class="form-group">
                        <label class="form-label">Combo Name *</label>
                        <input type="text" class="form-input" id="prod-name" placeholder="e.g., Spicy Trial Pack" required value="${isEdit ? editingProduct.name : ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tags / Keywords</label>
                        <input type="text" class="form-input" id="prod-tags" placeholder="e.g., spicy, trial, gift" value="${tagsStr}">
                        <span style="font-size: 0.75rem; color: var(--clr-text-muted);">Enter comma-separated keywords. "combo" tag is added automatically.</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Image URL</label>
                        <input type="text" class="form-input" id="prod-image" value="${isEdit ? editingProduct.image : 'assets/pickle_mango.png'}">
                    </div>
                    
                    <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                        <label class="form-label">Select Combo Items *</label>
                        <div style="max-height:150px; overflow-y:auto; border:1.5px solid var(--clr-border); padding:10px; border-radius: var(--radius-md); background:var(--clr-surface);">
                            ${getAllProducts().filter(p => !p.isCombo).map(p => `
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                                    <input type="checkbox" class="combo-item-checkbox" value="${p.id}" ${(isEdit && editingProduct.comboItems && editingProduct.comboItems.includes(p.id)) ? 'checked' : ''}>
                                    <label>${p.name} (₹${p.price})</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Total Combo Price (₹) *</label>
                        <input type="number" class="form-input" id="prod-price" placeholder="e.g., 400" required min="1" value="${isEdit ? editingProduct.price : ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Combo Discount (%) (Optional)</label>
                        <input type="number" class="form-input" id="prod-discount" placeholder="e.g., 15" min="0" max="100" value="${isEdit ? (editingProduct.discount || '') : ''}">
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-ghost" onclick="closeProductModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="save-combo-btn">${isEdit ? 'Save Changes' : 'Create Combo'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function closeProductModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('product-modal-container').innerHTML = '';
    editingProduct = null;
    isComboModal = false;
}

function handleSaveProduct(event) {
    event.preventDefault();

    const rawTags = (document.getElementById('prod-tags').value || '');
    const tags = rawTags.split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

    const comboItems = [];
    if (isComboModal) {
        document.querySelectorAll('.combo-item-checkbox:checked').forEach(cb => {
            comboItems.push(parseInt(cb.value));
        });
        if (comboItems.length === 0) {
            alert("Please select at least one item for the combo.");
            return;
        }
        if (!tags.includes('combo')) tags.unshift('combo');
    }

    const discountVal = parseInt(document.getElementById('prod-discount').value);

    const product = {
        id: editingProduct ? editingProduct.id : (Store.get('nextProductId') || 13),
        name: document.getElementById('prod-name').value.trim(),
        tags: tags,
        image: document.getElementById('prod-image').value.trim() || 'assets/pickle_mango.png',
        ingredients: isComboModal ? '' : document.getElementById('prod-ingredients').value.trim(),
        isCombo: isComboModal,
        comboItems: isComboModal ? comboItems : undefined,
        discount: isNaN(discountVal) ? 0 : discountVal,
        price: parseInt(document.getElementById('prod-price').value),
        rating: editingProduct ? editingProduct.rating : 0,
        reviews: editingProduct ? editingProduct.reviews : []
    };

    if (!editingProduct) {
        Store.set('nextProductId', product.id + 1);
    }

    saveProduct(product);
    closeProductModal();
    renderAdminProductsPage();
    showToast(editingProduct ? (isComboModal ? 'Combo updated!' : 'Product updated!') : (isComboModal ? 'Combo created!' : 'Product created!'));
}

function handleDeleteProduct(id) {
    if (confirm('Delete this product/combo?')) {
        deleteProduct(id);
        renderAdminProductsPage();
        showToast('Deleted successfully', 'info');
    }
}
