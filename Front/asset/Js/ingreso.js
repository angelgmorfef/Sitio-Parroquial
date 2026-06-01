document.addEventListener('DOMContentLoaded', () => {
    const loginForm    = document.getElementById('login-form');
    const loginBtn     = document.getElementById('login-btn');
    const errorDiv     = document.getElementById('auth-error');
    const togglePwdBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password-input');

    // Toggle ver/ocultar contraseña
    togglePwdBtn?.addEventListener('click', () => {
        const isText = passwordInput.type === 'text';
        passwordInput.type = isText ? 'password' : 'text';
        togglePwdBtn.textContent = isText ? '👁' : '🙈';
    });

    function showError(msg) {
        if (errorDiv) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
        } else {
            alert(msg);
        }
    }

    function hideError() {
        if (errorDiv) errorDiv.style.display = 'none';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideError();

            const emailInput    = document.getElementById('email-input').value.trim();
            const passwordValue = document.getElementById('password-input').value;

            if (!emailInput || !passwordValue) {
                showError('Por favor completa todos los campos.');
                return;
            }

            // Estado de carga
            if (loginBtn) { loginBtn.disabled = true; loginBtn.textContent = 'Ingresando...'; }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo: emailInput, password: passwordValue })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('username', data.nombre || 'Usuario');
                    window.location.href = 'perfil.html';
                } else {
                    showError(data.msg || 'Credenciales inválidas. Verifícalas e intenta de nuevo.');
                }
            } catch (error) {
                showError('No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.');
            } finally {
                if (loginBtn) { loginBtn.disabled = false; loginBtn.textContent = 'Ingresar'; }
            }
        });
    }
});