document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username-input').value;
            const passwordInput = document.getElementById('password-input').value;

            try {
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

                // Parse the response to JSON once.
                const data = await response.json();

                if (response.ok) {
                    // Save the token and username from the parsed data
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('username', data.username);
                    
                    alert('¡Inicio de sesión exitoso!');
                    
                    const redirectTo = localStorage.getItem('redirectAfterLogin') || 'index.html';
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectTo; 
                } else {
                    // Display the error message from the parsed data
                    alert(data.msg || 'Credenciales inválidas.');
                }
            } catch (error) {
                console.error('Error al intentar iniciar sesión:', error);
                alert('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
            }
        });
    }
});