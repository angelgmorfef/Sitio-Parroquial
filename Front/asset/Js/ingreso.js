document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional.

            // Obtiene los valores de los campos de usuario y contraseña.
            // Asegúrate de que los IDs 'username-input' y 'password-input'
            // coincidan con los de tu archivo ingreso.html.
            const usernameInput = document.getElementById('username-input').value;
            const passwordInput = document.getElementById('password-input').value;

            try {
                // Realiza la petición POST al backend con la URL completa para evitar errores.
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: usernameInput,
                        password: passwordInput
                    })
                });

                // Parsea la respuesta del servidor a JSON.
                const data = await response.json();

                if (response.ok) {
                    // Si el inicio de sesión es exitoso, el backend nos envía el token.
                    localStorage.setItem('authToken', data.token);
                    
                    alert('¡Inicio de sesión exitoso!');
                    
                    // Obtiene la URL guardada. Si no existe, usa 'index.html' como respaldo.
                    const redirectTo = localStorage.getItem('redirectAfterLogin') || 'index.html';
                    
                    // Elimina la clave para que no se use en futuras sesiones.
                    localStorage.removeItem('redirectAfterLogin');
                    
                    // Redirige al usuario a la página deseada.
                    window.location.href = redirectTo; 
                } else {
                    // Muestra un mensaje de error si las credenciales son incorrectas.
                    alert(data.msg || 'Credenciales inválidas.');
                }

            } catch (error) {
                console.error('Error al intentar iniciar sesión:', error);
                alert('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
            }
        });
    }
});