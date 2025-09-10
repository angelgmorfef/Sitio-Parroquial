document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    //  VARIABLES Y ELEMENTOS DEL DOM
    // ----------------------------------------------------
    const monthYearDisplay = document.getElementById('monthYear');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const calendarBody = document.getElementById('calendar-body');
    const eventListContainer = document.getElementById('event-list');
    const modal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.close-btn');
    const eventForm = document.getElementById('event-form');
    const eventDateInput = document.getElementById('event-date');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;

    // Obtener eventos del almacenamiento local del navegador
    let events = JSON.parse(localStorage.getItem('parroquiaEvents')) || [];

    // ----------------------------------------------------
    //  FUNCIONES DEL CALENDARIO
    // ----------------------------------------------------

    // Función para renderizar el calendario
    function renderCalendar() {
        calendarBody.innerHTML = '';
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        monthYearDisplay.textContent = new Date(currentYear, currentMonth).toLocaleString('es-ES', { month: 'long', year: 'numeric' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayDay = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    const cell = document.createElement('td');
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    break;
                } else {
                    const cell = document.createElement('td');
                    cell.textContent = date;
                    
                    const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const dayAsDate = new Date(currentYear, currentMonth, date);
                    
                    if (date === todayDay && currentMonth === todayMonth && currentYear === todayYear) {
                        cell.classList.add('today');
                    }

                    if (events.some(event => event.date === fullDate)) {
                        cell.classList.add('has-event');
                    }
                    
                    if (dayAsDate < today) {
                        cell.classList.add('past-date');
                    } else {
                        cell.addEventListener('click', () => {
                            selectedDate = fullDate;
                            showModal();
                            renderEventsForDate(selectedDate);
                        });
                    }
                    
                    row.appendChild(cell);
                    date++;
                }
            }
            calendarBody.appendChild(row);
        }
    }

    // Función para mostrar la lista de eventos de una fecha específica
    function renderEventsForDate(date) {
        eventListContainer.innerHTML = '';

        const eventsForDate = events.filter(event => event.date === date);

        if (eventsForDate.length === 0) {
            eventListContainer.innerHTML = '<p>No hay eventos programados para esta fecha.</p>';
            return;
        }

        eventsForDate.sort((a, b) => {
            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;
            return 0;
        });

        eventsForDate.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');
            eventItem.innerHTML = `
                <h3>${event.title}</h3>
                <p>Fecha: ${event.date}</p>
                <p>Hora: ${event.time}</p>
                <p>Descripción: ${event.description}</p>
                <button class="delete-event-btn" data-id="${event.id}">Eliminar</button>
            `;
            eventListContainer.appendChild(eventItem);
        });
    }

    // Función para eliminar un evento
    function deleteEvent(eventId) {
        events = events.filter(event => event.id != eventId);
        localStorage.setItem('parroquiaEvents', JSON.stringify(events));

        renderCalendar();
        renderEventsForDate(selectedDate);
    }

    // ----------------------------------------------------
    //  LÓGICA DEL MODAL Y GESTIÓN DE EVENTOS
    // ----------------------------------------------------

    // Muestra el modal
    function showModal() {
        modal.style.display = 'flex';
        eventDateInput.value = selectedDate;
    }

    // Oculta el modal y reinicia el formulario
    function hideModal() {
        modal.style.display = 'none';
        eventForm.reset();
    }
    
    // Asigna el evento para cerrar el modal con la X
    closeBtn.addEventListener('click', hideModal);

    // Asigna el evento para cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Maneja el envío del formulario para guardar un nuevo evento
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newEvent = {
            id: Date.now(),
            date: eventDateInput.value,
            title: document.getElementById('event-title').value,
            time: document.getElementById('event-time').value,
            description: document.getElementById('event-description').value
        };

        events.push(newEvent);
        localStorage.setItem('parroquiaEvents', JSON.stringify(events));

        renderCalendar();
        renderEventsForDate(selectedDate);
        hideModal();
    });

    // Manejar clics en los botones de eliminar
    eventListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-event-btn')) {
            const eventId = e.target.dataset.id;
            deleteEvent(eventId);
        }
    });

    // ----------------------------------------------------
    //  NAVEGACIÓN DEL CALENDARIO
    // ----------------------------------------------------

    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // ----------------------------------------------------
    //  INICIO DE LA APLICACIÓN
    // ----------------------------------------------------
    renderCalendar();
});

