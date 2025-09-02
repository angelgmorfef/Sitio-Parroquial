document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerButton = document.getElementById('register-button');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerButton.disabled = true;
            registerButton.textContent = 'Registrando...';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

            try {
                const nombre = document.getElementById('nombre-input').value.trim();
                const apellido = document.getElementById('apellido-input').value.trim();
                const correo = document.getElementById('email-input').value.trim();
                const username = document.getElementById('username-input').value.trim();
                const password = document.getElementById('password-input').value.trim();
            
                if (!nombre || !apellido || !correo || !username || !password) {
                    alert('Por favor, complete todos los campos.');
                    return;
                }

                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, apellido, correo, username, password }),
                    signal: controller.signal // Asocia el timeout a la solicitud
                });

                clearTimeout(timeoutId); // Limpia el timeout si la solicitud es exitosa

                const data = await response.json();

                if (response.ok) {
                    alert(data.msg);
                    window.location.href = 'ingreso.html';
                } else {
                    alert(data.msg || 'Error al registrar el usuario. Inténtelo de nuevo.');
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    alert('La solicitud ha tardado demasiado en responder. Inténtelo de nuevo.');
                } else {
                    console.error('Error en el registro:', error);
                    alert('No se pudo conectar con el servidor.');
                }
            } finally {
                registerButton.disabled = false;
                registerButton.textContent = 'Registrarse';
            }
        });
    }
});