/* ============================================
   TOAST NOTIFICATIONS — Lucide icons
   ============================================ */

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const iconNames = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon"><i data-lucide="${iconNames[type] || 'check-circle'}"></i></span>
        <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);

    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
}
