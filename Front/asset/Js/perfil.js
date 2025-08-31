document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Si no hay token, redirige al usuario a la página de login
        window.location.href = 'ingreso.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envía el token en el encabezado
            }
        });

        const data = await response.json();

        if (response.ok) {
            const welcomeMessage = document.getElementById('welcome-message');
            welcomeMessage.textContent = `¡Bienvenido, ${data.username}!`;

            const profileDiv = document.getElementById('user-profile');
            profileDiv.innerHTML = `
                <p><strong>Nombre:</strong> ${data.nombre}</p>
                <p><strong>Apellido:</strong> ${data.apellido}</p>
                <p><strong>Correo:</strong> ${data.correo}</p>
                <p><strong>Fecha de Registro:</strong> ${new Date(data.date).toLocaleDateString()}</p>
            `;
        } else {
            alert(data.msg || 'Error al cargar el perfil.');
            // Si hay un error, el token puede ser inválido, así que redirigimos
            localStorage.removeItem('authToken');
            window.location.href = 'ingreso.html';
        }

    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        alert('No se pudo conectar con el servidor.');
        localStorage.removeItem('authToken');
        window.location.href = 'ingreso.html';
    }
});