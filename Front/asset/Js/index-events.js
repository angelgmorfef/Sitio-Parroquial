document.addEventListener('DOMContentLoaded', () => {
    const homeEventListContainer = document.getElementById('home-event-list');

    function loadAndDisplayHomeEvents() {
        const storedEvents = JSON.parse(localStorage.getItem('parroquiaEvents')) || [];
        homeEventListContainer.innerHTML = ''; // Limpiar la lista

        // Obtener la fecha actual para filtrar solo eventos futuros o de hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetear la hora para comparar solo por día

        // Filtrar eventos futuros y ordenarlos por fecha y luego por hora
        const upcomingEvents = storedEvents
            .filter(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0); // Resetear la hora del evento para comparar
                return eventDate >= today; // Incluye hoy y fechas futuras
            })
            .sort((a, b) => {
                // Primero ordenar por fecha
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA.getTime() !== dateB.getTime()) {
                    return dateA - dateB;
                }
                // Si las fechas son iguales, ordenar por hora
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
            });

        if (upcomingEvents.length === 0) {
            homeEventListContainer.innerHTML = '<p>No hay eventos próximos programados.</p>';
            return;
        }

        // Mostrar solo los primeros 5-10 eventos para no saturar el index
        const eventsToShow = upcomingEvents.slice(0, 5); // Por ejemplo, los 5 eventos más próximos

        eventsToShow.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item-home'); // Una clase diferente para diferenciar los estilos del index
            eventItem.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p><strong>Hora:</strong> ${event.time}</p>
                <p>${event.description}</p>
            `;
            homeEventListContainer.appendChild(eventItem);
        });
    }

    // Cargar y mostrar eventos cuando el DOM esté listo
    loadAndDisplayHomeEvents();
});