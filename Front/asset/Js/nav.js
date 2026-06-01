/**
 * nav.js — Lógica compartida de la barra de navegación
 * Maneja: scroll effect, hamburger menu, auth state en navbar
 */
document.addEventListener('DOMContentLoaded', () => {
    const navbar       = document.getElementById('main-navbar');
    const hamburger    = document.getElementById('nav-hamburger');
    const mobileMenu   = document.getElementById('nav-mobile-menu');
    const overlay      = document.getElementById('nav-overlay');
    const navAuthBtns  = document.getElementById('nav-auth-btns');
    const mobileAuth   = document.getElementById('nav-mobile-auth');

    // -------------------------------------------------------
    // 1. Scroll effect: agregar clase "scrolled" al bajar
    // -------------------------------------------------------
    const onScroll = () => {
        if (window.scrollY > 40) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // ejecutar al inicio

    // -------------------------------------------------------
    // 2. Hamburger menu
    // -------------------------------------------------------
    const openMenu  = () => { mobileMenu?.classList.add('open'); overlay?.classList.add('open'); hamburger?.setAttribute('aria-expanded', 'true'); };
    const closeMenu = () => { mobileMenu?.classList.remove('open'); overlay?.classList.remove('open'); hamburger?.setAttribute('aria-expanded', 'false'); };

    hamburger?.addEventListener('click', () => {
        const isOpen = mobileMenu?.classList.contains('open');
        isOpen ? closeMenu() : openMenu();
    });
    overlay?.addEventListener('click', closeMenu);
    mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // -------------------------------------------------------
    // 3. Auth state: mostrar/ocultar botones según sesión
    // -------------------------------------------------------
    const token    = localStorage.getItem('authToken');
    const username = localStorage.getItem('username') || 'Mi Perfil';

    if (token) {
        // Desktop
        if (navAuthBtns) {
            navAuthBtns.innerHTML = `
                <a href="perfil.html" class="btn btn-outline" title="${username}">👤 ${username}</a>
                <button class="btn btn-primary" id="logout-btn">Cerrar Sesión</button>
            `;
        }
        // Mobile
        if (mobileAuth) {
            mobileAuth.innerHTML = `
                <a href="perfil.html" class="btn btn-outline">👤 ${username}</a>
                <button class="btn btn-primary" id="logout-btn-mobile">Cerrar Sesión</button>
            `;
        }

        const doLogout = () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        };
        document.getElementById('logout-btn')?.addEventListener('click', doLogout);
        document.getElementById('logout-btn-mobile')?.addEventListener('click', doLogout);
    }
});

// Función global de logout (usada también en chat.js)
function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}
