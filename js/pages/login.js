/* ============================================
   LOGIN / REGISTER PAGE — Split layout, no emojis
   ============================================ */

let authMode = 'login';

async function renderLoginPage() {
    authMode = 'login';
    renderAuthForm();
}

function renderAuthForm() {
    const root = document.getElementById('app-root');

    root.innerHTML = `
        <div class="auth-page">
            <div class="auth-image-side">
                <div class="auth-image-text">
                    <h2>Taste the<br>Tradition</h2>
                    <p>Authentic handcrafted pickles made with recipes passed down through generations. Every jar tells a story.</p>
                </div>
            </div>
            <div class="auth-form-side">
                <div class="auth-form-inner">
                    <div class="auth-header">
                        <h1>${authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                        <p>${authMode === 'login' ? 'Login to your Pickle Palace account' : 'Join Pickle Palace today'}</p>
                    </div>

                    <div class="auth-toggle">
                        <button class="auth-toggle-btn ${authMode === 'login' ? 'active' : ''}" onclick="switchAuth('login')" id="auth-login-tab">Login</button>
                        <button class="auth-toggle-btn ${authMode === 'register' ? 'active' : ''}" onclick="switchAuth('register')" id="auth-register-tab">Register</button>
                    </div>

                    <form id="auth-form" onsubmit="handleAuth(event)">
                        ${authMode === 'register' ? `
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-input" id="auth-name" placeholder="Enter your full name" required>
                            </div>
                        ` : ''}
                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-input" id="auth-username" placeholder="Choose a username" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-input" id="auth-password" placeholder="Enter your password" required minlength="4">
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg w-full" id="auth-submit-btn" style="width: 100%;">
                            ${authMode === 'login' ? 'Login' : 'Create Account'}
                        </button>
                    </form>

                    <p style="text-align: center; margin-top: 20px; font-size: 0.88rem; color: var(--clr-text-muted);">
                        ${authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <a href="#" onclick="switchAuth('${authMode === 'login' ? 'register' : 'login'}'); return false;" style="color: var(--clr-primary); font-weight: 600;">
                            ${authMode === 'login' ? 'Register' : 'Login'}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    `;
}

function switchAuth(mode) {
    authMode = mode;
    renderAuthForm();
}

async function handleAuth(event) {
    event.preventDefault();

    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;

    if (authMode === 'login') {
        const success = await loginUser(username, password);
        if (success) {
            showToast('Welcome back!');
            renderNavbar();
            window.location.hash = '#/';
        } else {
            showToast('Invalid username or password', 'error');
        }
    } else {
        const name = document.getElementById('auth-name').value.trim();
        const success = await registerUser(name, username, password);
        if (success) {
            showToast('Account created! Welcome!');
            renderNavbar();
            window.location.hash = '#/';
        } else {
            showToast('Username already exists', 'error');
        }
    }
}
