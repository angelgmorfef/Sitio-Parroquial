/**
 * index-events.js — Muestra próximos eventos en el sidebar del index
 * Intenta obtener del backend (/api/events) y usa localStorage como fallback.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('home-event-list');
    if (!container) return;

    let events = [];

    // 1. Intentar backend
    try {
        const res = await fetch('/api/events');
        if (res.ok) {
            events = await res.json();
        } else {
            throw new Error('Backend no disponible');
        }
    } catch {
        // 2. Fallback: localStorage
        events = JSON.parse(localStorage.getItem('parroquiaEvents') || '[]');
    }

    // Filtrar eventos futuros/de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events
        .filter(ev => {
            const d = new Date(ev.date + 'T00:00:00');
            return d >= today;
        })
        .sort((a, b) => {
            const dateComp = new Date(a.date) - new Date(b.date);
            if (dateComp !== 0) return dateComp;
            return a.time < b.time ? -1 : 1;
        })
        .slice(0, 5);

    container.innerHTML = '';

    if (upcoming.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:24px 0;">
                <p style="color:var(--text-muted);font-size:0.9rem;">No hay eventos próximos programados.</p>
                <a href="calendario.html" style="color:var(--primary);font-weight:600;font-size:0.88rem;">Agregar un evento →</a>
            </div>`;
        return;
    }

    upcoming.forEach(event => {
        const dateObj = new Date(event.date + 'T00:00:00');
        const dateStr = dateObj.toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const item = document.createElement('div');
        item.classList.add('event-item-home');
        item.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Fecha:</strong> ${dateStr}</p>
            <p><strong>Hora:</strong> ${event.time}</p>
            ${event.description ? `<p>${event.description.slice(0, 80)}${event.description.length > 80 ? '…' : ''}</p>` : ''}
        `;
        container.appendChild(item);
    });
});