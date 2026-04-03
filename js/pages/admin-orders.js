/* ============================================
   ADMIN: ORDER MANAGEMENT — No emojis
   ============================================ */

async function renderAdminOrdersPage() {
    const orders = (await getAllOrders()).sort((a, b) => new Date(b.date) - new Date(a.date));
    const root = document.getElementById('app-root');

    const statusCounts = {
        all: orders.length,
        Pending: orders.filter(o => o.status === 'Pending').length,
        Packed: orders.filter(o => o.status === 'Packed').length,
        Shipped: orders.filter(o => o.status === 'Shipped').length,
        Delivered: orders.filter(o => o.status === 'Delivered').length,
    };

    root.innerHTML = `
        <div class="admin-page">
            <div class="admin-header">
                <div>
                    <h1><i data-lucide="clipboard-list"></i> Order Management</h1>
                    <p class="admin-subtitle">Track and manage all customer orders</p>
                </div>
                <a href="#/admin/products" class="btn btn-ghost">Manage Products</a>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 30px;">
                <div class="glass-card" style="padding: 20px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); color: var(--clr-text);">${statusCounts.all}</div>
                    <div style="font-size: 0.82rem; color: var(--clr-text-muted);">Total Orders</div>
                </div>
                <div class="glass-card" style="padding: 20px; text-align: center; border-left: 3px solid var(--clr-pending);">
                    <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); color: var(--clr-pending);">${statusCounts.Pending}</div>
                    <div style="font-size: 0.82rem; color: var(--clr-text-muted);">Pending</div>
                </div>
                <div class="glass-card" style="padding: 20px; text-align: center; border-left: 3px solid var(--clr-packed);">
                    <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); color: var(--clr-packed);">${statusCounts.Packed}</div>
                    <div style="font-size: 0.82rem; color: var(--clr-text-muted);">Packed</div>
                </div>
                <div class="glass-card" style="padding: 20px; text-align: center; border-left: 3px solid var(--clr-shipped);">
                    <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); color: var(--clr-shipped);">${statusCounts.Shipped}</div>
                    <div style="font-size: 0.82rem; color: var(--clr-text-muted);">Shipped</div>
                </div>
                <div class="glass-card" style="padding: 20px; text-align: center; border-left: 3px solid var(--clr-delivered);">
                    <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); color: var(--clr-delivered);">${statusCounts.Delivered}</div>
                    <div style="font-size: 0.82rem; color: var(--clr-text-muted);">Delivered</div>
                </div>
            </div>

            ${orders.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-icon"><i data-lucide="clipboard"></i></div>
                    <h3>No orders yet</h3>
                    <p>Orders from customers will appear here.</p>
                </div>
            ` : `
                <div class="admin-table">
                    <table>
                        <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            ${orders.map(order => `
                                <tr id="admin-order-row-${order.id}">
                                    <td><strong>#${order.id}</strong></td>
                                    <td><div>${order.customerName || order.username}</div><div style="font-size: 0.75rem; color: var(--clr-text-muted);">${order.address ? order.address.city + ', ' + order.address.state : ''}</div></td>
                                    <td><div style="font-size: 0.85rem;">${order.items.map(i => `${i.name} ×${i.qty}`).join('<br>')}</div></td>
                                    <td style="font-weight: 700; color: var(--clr-accent);">₹${order.total}</td>
                                    <td style="font-size: 0.85rem; color: var(--clr-text-muted);">${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                                    <td>
                                        <select class="status-select" onchange="handleStatusChange(${order.id}, this.value)" id="status-select-${order.id}">
                                            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                            <option value="Packed" ${order.status === 'Packed' ? 'selected' : ''}>Packed</option>
                                            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

async function handleStatusChange(orderId, newStatus) {
    await updateOrderStatus(orderId, newStatus);
    await renderAdminOrdersPage();
    showToast(`Order #${orderId} → ${newStatus}`, 'info');
}
