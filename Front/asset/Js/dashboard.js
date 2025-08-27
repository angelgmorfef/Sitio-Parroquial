document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar si existe un token
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Si no hay token, redirige al usuario a la página de inicio de sesión
        window.location.href = '/'; 
        return;
    }

    // Opcional: Decodificar el token para mostrar información del usuario
    // Esta parte es solo para demostración en el frontend. La verificación real ocurre en el servidor.
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv) {
        userInfoDiv.textContent = `Usuario autenticado: ${payload.username}`;
    }

    // 2. Manejar el cierre de sesión
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Elimina el token del almacenamiento local
            localStorage.removeItem('authToken');
            // Redirige al usuario a la página de inicio de sesión
            window.location.href = '/';
        });
    }
});