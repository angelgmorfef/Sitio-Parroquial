document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = 'ingreso.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('user-name').textContent = data.nombre + ' ' + data.apellido;
            document.getElementById('user-email').textContent = data.correo;
            document.getElementById('welcome-message').textContent = `¡Bienvenido, ${data.nombre}!`;
            document.getElementById('user-display-name').textContent = data.nombre;
            document.getElementById('user-bio-name').textContent = data.nombre;

        } else {
            alert(data.msg || 'Error al cargar el perfil.');
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