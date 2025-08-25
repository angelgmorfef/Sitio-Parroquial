// Espera a que el documento HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene el formulario de registro por su ID
    const registerForm = document.getElementById('registerForm');

    // Escucha el evento de 'submit' (cuando se envía el formulario)
    registerForm.addEventListener('submit', async (event) => {
        // Evita que el formulario se envíe de la manera tradicional (recargando la página)
        event.preventDefault();

        // Obtiene los valores de los campos del formulario
        const username = document.getElementById('reg-email').value; // Usamos el correo como nombre de usuario
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        // Validación simple de que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            return; // Detiene la función si hay un error
        }

        try {
            // Envía los datos al servidor usando la ruta /register
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Convierte los datos del formulario a formato JSON
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            // Revisa si la respuesta del servidor es exitosa
            if (response.ok) {
                alert('¡Registro exitoso! Ya puedes iniciar sesión.');
                // Aquí podrías redirigir al usuario a la página de ingreso
                window.location.href = 'login.html';
            } else {
                // Si la respuesta no es exitosa, muestra un mensaje de error
                const errorText = await response.text();
                alert(`Error en el registro: ${errorText}`);
            }
        } catch (error) {
            // Maneja errores de conexión o de la red
            alert('Hubo un problema de conexión. Por favor, inténtalo más tarde.');
            console.error('Error de red:', error);
        }
    });
});