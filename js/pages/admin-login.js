/* ============================================
   ADMIN LOGIN PAGE — No emojis, Lucide icons
   ============================================ */

async function renderAdminLoginPage() {
    const root = document.getElementById('app-root');

    root.innerHTML = `
        <div class="auth-page-centered">
            <div class="auth-card">
                <div class="auth-header">
                    <div class="auth-icon"><i data-lucide="shield" style="width:48px;height:48px;stroke:var(--clr-primary);stroke-width:1.5;"></i></div>
                    <h1>Admin Access</h1>
                    <p>Enter admin credentials to manage your store</p>
                </div>

                <form id="admin-login-form" onsubmit="handleAdminLogin(event)">
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" class="form-input" id="admin-username" placeholder="Admin username" required autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" id="admin-password" placeholder="Admin password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg w-full" id="admin-login-btn" style="width: 100%;">
                        Login as Admin
                    </button>
                </form>

                <p style="text-align: center; margin-top: 20px; font-size: 0.82rem; color: var(--clr-text-muted);">
                    This area is restricted to authorized personnel only.
                </p>
            </div>
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

function handleAdminLogin(event) {
    event.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;

    if (loginAdmin(username, password)) {
        showToast('Welcome, Admin!');
        renderNavbar();
        window.location.hash = '#/admin/products';
    } else {
        showToast('Invalid admin credentials', 'error');
    }
}
