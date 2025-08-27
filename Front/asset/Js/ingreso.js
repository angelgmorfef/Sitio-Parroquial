document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

            const emailInput = document.getElementById('email-input').value;
            const passwordInput = document.getElementById('password-input').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailInput,
                        password: passwordInput
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Si el inicio de sesión es exitoso, el backend nos envía el token
                    const token = data.token;
                    // Almacena el token en el almacenamiento local del navegador
                    localStorage.setItem('authToken', token);
                    alert('¡Inicio de sesión exitoso!');
                    // Opcional: Redirige al usuario a otra página
                    window.location.href = 'dashboard.html';
                } else {
                    // Muestra un mensaje de error si las credenciales son incorrectas
                    alert(data.error);
                }

            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert('Error al intentar iniciar sesión.');
            }
        });
    }
});