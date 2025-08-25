// Espera a que el documento HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene el formulario de ingreso por su ID
    const loginForm = document.getElementById('loginForm');

    // Escucha el evento de 'submit' del formulario
    loginForm.addEventListener('submit', async (event) => {
        // Evita que el formulario se envíe de forma tradicional
        event.preventDefault();

        // Obtiene los valores de los campos del formulario
        const email = document.getElementById('log-email').value;
        const password = document.getElementById('log-password').value;

        try {
            // Envía los datos al servidor usando la ruta /login (que crearemos en el backend)
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            });

            // Revisa si la respuesta del servidor es exitosa
            if (response.ok) {
                alert('¡Ingreso exitoso! Bienvenido de nuevo.');
                // Aquí podrías redirigir al usuario a la página de inicio
                window.location.href = 'index.html'; 
            } else {
                // Si hay un error, muestra un mensaje
                const errorText = await response.text();
                alert(`Error al ingresar: ${errorText}`);
            }
        } catch (error) {
            // Maneja errores de conexión
            alert('Hubo un problema de conexión. Por favor, inténtalo más tarde.');
            console.error('Error de red:', error);
        }
    });
});