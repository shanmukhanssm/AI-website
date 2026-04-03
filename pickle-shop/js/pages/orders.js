/* ============================================
   MY ORDERS PAGE — No emojis, Lucide icons
   ============================================ */

function renderOrdersPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.hash = '#/login';
        return;
    }

    const orders = getUserOrders(user.username).sort((a, b) => new Date(b.date) - new Date(a.date));
    const root = document.getElementById('app-root');

    root.innerHTML = `
        <div class="orders-page">
            <h1><i data-lucide="package"></i> My Orders</h1>

            ${orders.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-icon"><i data-lucide="package-open"></i></div>
                    <h3>No orders yet</h3>
                    <p>Your order history will appear here once you place your first order.</p>
                    <button class="btn btn-primary mt-3" onclick="window.location.hash='#/'">Start Shopping</button>
                </div>
            ` : orders.map(order => {
                const statusClass = order.status.toLowerCase();
                return `
                    <div class="order-card" id="order-${order.id}">
                        <div class="order-card-header" onclick="toggleOrderCard(${order.id})">
                            <div>
                                <div class="order-id">Order #${order.id}</div>
                                <div class="order-date">${new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 14px;">
                                <span class="status-badge status-${statusClass}">
                                    ${order.status}
                                </span>
                                <span style="font-family: var(--font-heading); font-weight: 800; font-size: 1.1rem; color: var(--clr-accent);">₹${order.total}</span>
                                <span style="color: var(--clr-text-muted);">▼</span>
                            </div>
                        </div>
                        <div class="order-card-body" id="order-body-${order.id}">
                            <div style="margin-bottom: 14px;">
                                <strong style="font-size: 0.85rem; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Items</strong>
                            </div>
                            ${order.items.map(item => `
                                <div class="order-item-row">
                                    <span>${item.name} × ${item.qty}</span>
                                    <span style="font-weight: 600;">₹${item.price * item.qty}</span>
                                </div>
                            `).join('')}
                            <div class="order-item-row" style="border-top: 1px solid var(--clr-border-light); margin-top: 8px; padding-top: 12px; font-weight: 700;">
                                <span>Total</span>
                                <span style="color: var(--clr-accent);">₹${order.total}</span>
                            </div>

                            <div class="order-address">
                                <strong>Delivery Address</strong><br>
                                ${order.address.name}, ${order.address.phone}<br>
                                ${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}<br>
                                ${order.address.city} - ${order.address.pincode}, ${order.address.state}
                            </div>

                            <div style="margin-top: 14px; padding: 12px; background: var(--clr-bg-warm); border-radius: var(--radius-md); font-size: 0.88rem;">
                                <strong>Payment:</strong> ${order.paymentMethod}
                            </div>

                            <!-- Status Tracker -->
                            <div style="margin-top: 20px;">
                                <strong style="font-size: 0.85rem; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Order Tracking</strong>
                                <div style="display: flex; align-items: center; gap: 0; margin-top: 14px;">
                                    ${renderStatusTracker(order.status)}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

function renderStatusTracker(currentStatus) {
    const steps = ['Pending', 'Packed', 'Shipped', 'Delivered'];
    const colors = ['var(--clr-pending)', 'var(--clr-packed)', 'var(--clr-shipped)', 'var(--clr-delivered)'];
    const currentIdx = steps.indexOf(currentStatus);

    return steps.map((step, i) => {
        const isActive = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return `
            <div style="flex: 1; text-align: center; position: relative;">
                <div style="width: 36px; height: 36px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;
                    background: ${isActive ? colors[i] : 'var(--clr-border-light)'}; color: ${isActive ? 'white' : 'var(--clr-text-muted)'}; 
                    ${isCurrent ? 'box-shadow: 0 0 0 4px ' + colors[i] + '33;' : ''}
                    transition: all 0.3s ease;">
                    ${i + 1}
                </div>
                <div style="font-size: 0.72rem; margin-top: 6px; font-weight: ${isActive ? '700' : '400'}; color: ${isActive ? colors[i] : 'var(--clr-text-muted)'};">${step}</div>
            </div>
            ${i < steps.length - 1 ? `<div style="flex: 1; height: 3px; background: ${i < currentIdx ? colors[i] : 'var(--clr-border-light)'}; margin-bottom: 22px; border-radius: 2px; transition: all 0.3s ease;"></div>` : ''}
        `;
    }).join('');
}

function toggleOrderCard(orderId) {
    const body = document.getElementById(`order-body-${orderId}`);
    if (body) {
        body.classList.toggle('open');
    }
}
