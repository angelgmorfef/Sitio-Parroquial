document.addEventListener('DOMContentLoaded', () => {
    const token    = localStorage.getItem('authToken');
    const username = localStorage.getItem('username') || '';

    // Si no hay sesión, redirigir al login
    if (!token) {
        window.location.href = 'ingreso.html';
        return;
    }

    // Decodificar el JWT (sin verificar firma — solo para mostrar datos)
    let userData = {};
    try {
        const base64Payload = token.split('.')[1];
        const decoded = JSON.parse(atob(base64Payload));
        userData = decoded;
    } catch (e) {
        console.warn('No se pudo decodificar el token JWT:', e);
    }

    // Actualizar el nombre en la página
    const fullName   = username || userData.nombre || 'Usuario';
    const userEmail  = userData.correo || userData.email || '';
    const joinDate   = userData.iat
        ? new Date(userData.iat * 1000).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })
        : new Date().toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });

    // Actualizar DOM
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    setEl('user-name',         fullName);
    setEl('welcome-message',   `Bienvenido, ${fullName}`);
    setEl('user-display-name', fullName);
    setEl('user-email',        userEmail || 'No disponible');
    setEl('user-join-date',    joinDate);
    setEl('user-join-date-2',  joinDate);

    // Actualizar avatar con las iniciales
    const avatar = document.getElementById('profile-avatar');
    if (avatar) {
        const initials = fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=aa0000&color=fff&size=128&bold=true`;
        avatar.alt = `Foto de perfil de ${fullName}`;
    }

    // Botón logout dentro del perfil
    document.getElementById('logout-profile-btn')?.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });

    // Botón editar perfil (placeholder)
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
        alert('La edición de perfil estará disponible próximamente.');
    });

    // Botón cambiar contraseña (placeholder)
    document.getElementById('change-password-btn')?.addEventListener('click', () => {
        alert('El cambio de contraseña estará disponible próximamente.');
    });
});