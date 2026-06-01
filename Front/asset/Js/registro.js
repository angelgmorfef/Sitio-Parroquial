document.addEventListener('DOMContentLoaded', () => {
    const registerForm    = document.getElementById('registerForm');
    const registerButton  = document.getElementById('register-button');
    const errorDiv        = document.getElementById('auth-error');
    const togglePwdBtns   = document.querySelectorAll('.toggle-password');

    // Toggle ver/ocultar contraseñas
    togglePwdBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                const isText = input.type === 'text';
                input.type = isText ? 'password' : 'text';
                btn.textContent = isText ? '👁' : '🙈';
            }
        });
    });

    function showError(msg) {
        if (errorDiv) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert(msg);
        }
    }
    function hideError() {
        if (errorDiv) errorDiv.style.display = 'none';
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideError();

            const nombre          = document.getElementById('nombre-input').value.trim();
            const apellido        = document.getElementById('apellido-input').value.trim();
            const correo          = document.getElementById('email-input').value.trim();
            const password        = document.getElementById('password-input').value;
            const confirmPassword = document.getElementById('confirm-password-input').value;

            if (!nombre || !apellido || !correo || !password || !confirmPassword) {
                showError('Por favor completa todos los campos.');
                return;
            }

            if (password.length < 8) {
                showError('La contraseña debe tener al menos 8 caracteres.');
                return;
            }

            if (password !== confirmPassword) {
                showError('Las contraseñas no coinciden. Verifícalas e intenta de nuevo.');
                return;
            }

            registerButton.disabled = true;
            registerButton.textContent = 'Creando cuenta...';

            const controller = new AbortController();
            const timeoutId  = setTimeout(() => controller.abort(), 10000);

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, apellido, correo, password }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const data = await response.json();

                if (response.ok) {
                    // Mostrar éxito y redirigir
                    registerButton.textContent = '✅ ¡Cuenta creada!';
                    registerButton.style.background = 'linear-gradient(135deg, #22a06b, #38c793)';
                    setTimeout(() => { window.location.href = 'ingreso.html'; }, 1200);
                } else {
                    showError(data.msg || 'Error al registrar el usuario. Inténtalo de nuevo.');
                }
            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    showError('La solicitud tardó demasiado. Verifica tu conexión e inténtalo de nuevo.');
                } else {
                    showError('No se pudo conectar con el servidor.');
                }
            } finally {
                if (registerButton.textContent !== '✅ ¡Cuenta creada!') {
                    registerButton.disabled = false;
                    registerButton.textContent = 'Crear cuenta';
                }
            }
        });
    }
});