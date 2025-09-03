document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email-input').value;
            const passwordInput = document.getElementById('password-input').value;

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo: emailInput,
                        password: passwordInput
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('username', data.username);
                    alert('¡Inicio de sesión exitoso!');
                    window.location.href = 'perfil.html';
                } else {
                    alert(data.msg || 'Credenciales inválidas.');
                }
            } catch (error) {
                console.error('Error al intentar iniciar sesión:', error);
                alert('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
            }
        });
    }
});