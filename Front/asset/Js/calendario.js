document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    //  VARIABLES Y ELEMENTOS DEL DOM
    // ----------------------------------------------------
    const monthYearDisplay    = document.getElementById('monthYear');
    const prevBtn             = document.getElementById('prevBtn');
    const nextBtn             = document.getElementById('nextBtn');
    const calendarBody        = document.getElementById('calendar-body');
    const eventListContainer  = document.getElementById('event-list');
    const modal               = document.getElementById('eventModal');
    const eventForm           = document.getElementById('event-form');
    const eventDateInput      = document.getElementById('event-date');

    let currentDate  = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear  = currentDate.getFullYear();
    let selectedDate = null;
    let events       = [];

    // ----------------------------------------------------
    //  FETCH EVENTOS DEL BACKEND
    // ----------------------------------------------------
    async function fetchEvents() {
        try {
            const response = await fetch('/api/events');
            if (response.ok) {
                events = await response.json();
            } else {
                // fallback a localStorage si el backend no responde
                events = JSON.parse(localStorage.getItem('parroquiaEvents') || '[]');
            }
        } catch (error) {
            // Sin backend: usar localStorage
            events = JSON.parse(localStorage.getItem('parroquiaEvents') || '[]');
        }
        renderCalendar();
        if (selectedDate) renderEventsForDate(selectedDate);
    }

    // Guardar en localStorage (persistencia local)
    function saveLocalEvents() {
        localStorage.setItem('parroquiaEvents', JSON.stringify(events));
    }

    // ----------------------------------------------------
    //  RENDERIZAR CALENDARIO
    // ----------------------------------------------------
    function renderCalendar() {
        calendarBody.innerHTML = '';

        const firstDay     = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth  = new Date(currentYear, currentMonth + 1, 0).getDate();
        const monthNames   = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

        monthYearDisplay.textContent =
            monthNames[currentMonth].charAt(0).toUpperCase() +
            monthNames[currentMonth].slice(1) + ' ' + currentYear;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            let hasContent = false;

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');

                if (i === 0 && j < firstDay) {
                    // Celdas vacías antes del primer día
                    cell.setAttribute('data-empty', 'true');
                    row.appendChild(cell);
                    continue;
                }

                if (date > daysInMonth) {
                    // Fin del mes
                    row.appendChild(cell);
                    continue;
                }

                hasContent = true;
                const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                const dayAsDate = new Date(currentYear, currentMonth, date);

                // Número del día con wrapper
                const dayNum = document.createElement('span');
                dayNum.classList.add('day-num');
                dayNum.textContent = date;
                cell.appendChild(dayNum);

                // Clases condicionales
                if (
                    date === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear()
                ) {
                    cell.classList.add('today');
                }

                if (events.some(ev => ev.date === fullDate)) {
                    cell.classList.add('has-event');
                }

                if (dayAsDate < today) {
                    cell.classList.add('past-date');
                } else {
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        // Quitar selección previa
                        document.querySelectorAll('.calendar-table td.selected').forEach(td => td.classList.remove('selected'));
                        cell.classList.add('selected');

                        selectedDate = fullDate;
                        renderEventsForDate(selectedDate);
                        showModal();
                    });
                }

                // También permitir clic en día de hoy
                if (cell.classList.contains('today') && !cell.classList.contains('past-date')) {
                    cell.style.cursor = 'pointer';
                    if (!cell.onclick) {
                        cell.addEventListener('click', () => {
                            document.querySelectorAll('.calendar-table td.selected').forEach(td => td.classList.remove('selected'));
                            cell.classList.add('selected');
                            selectedDate = fullDate;
                            renderEventsForDate(selectedDate);
                            showModal();
                        });
                    }
                }

                row.appendChild(cell);
                date++;
            }

            // No agregar filas completamente vacías al final
            if (hasContent || i === 0) {
                calendarBody.appendChild(row);
            }
        }
    }

    // ----------------------------------------------------
    //  RENDERIZAR EVENTOS PARA UNA FECHA
    // ----------------------------------------------------
    function renderEventsForDate(date) {
        eventListContainer.innerHTML = '';

        const eventsForDate = events.filter(ev => ev.date === date);

        if (eventsForDate.length === 0) {
            eventListContainer.innerHTML = `
                <div class="no-events-msg">
                    <span>📅</span>
                    <p>No hay eventos para esta fecha.<br>Haz clic en <strong>Guardar</strong> para agregar uno.</p>
                </div>`;
            return;
        }

        eventsForDate.sort((a, b) => {
            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;
            return 0;
        });

        // Título de la fecha
        const [y, m, d] = date.split('-');
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        const opts = { weekday: 'long', day: 'numeric', month: 'long' };
        const dateTitle = document.createElement('p');
        dateTitle.style.cssText = 'font-size:0.82rem;color:var(--primary);font-weight:700;letter-spacing:0.5px;text-transform:capitalize;margin-bottom:8px;';
        dateTitle.textContent = dateObj.toLocaleDateString('es-ES', opts);
        eventListContainer.appendChild(dateTitle);

        eventsForDate.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');
            eventItem.innerHTML = `
                <h3>${event.title}</h3>
                <p>🕐 ${event.time}</p>
                <p>📝 ${event.description}</p>
                <button class="delete-event-btn" data-id="${event._id || event.id}">🗑 Eliminar</button>
            `;
            eventListContainer.appendChild(eventItem);
        });
    }

    // ----------------------------------------------------
    //  ELIMINAR EVENTO
    // ----------------------------------------------------
    async function deleteEvent(eventId) {
        // Intento en backend
        let backendOk = false;
        try {
            const response = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
            backendOk = response.ok;
        } catch (e) { /* sin backend */ }

        // Siempre eliminar localmente
        events = events.filter(ev => (ev._id !== eventId && ev.id !== eventId));
        saveLocalEvents();
        renderCalendar();
        if (selectedDate) renderEventsForDate(selectedDate);
    }

    // Evento delegado para botones "Eliminar"
    eventListContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-event-btn');
        if (btn) deleteEvent(btn.dataset.id);
    });

    // ----------------------------------------------------
    //  MODAL
    // ----------------------------------------------------
    function showModal() {
        modal.style.display = 'flex';
        eventDateInput.value = selectedDate;
        document.getElementById('event-title')?.focus();
    }

    function hideModal() {
        modal.style.display = 'none';
        eventForm.reset();
    }

    // Cerrar con botones .modal-close y backdrop
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', hideModal);
    });
    modal.querySelector('.modal-backdrop')?.addEventListener('click', hideModal);

    // Tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideModal();
    });

    // ----------------------------------------------------
    //  ENVÍO DEL FORMULARIO
    // ----------------------------------------------------
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newEvent = {
            id:          Date.now().toString(),
            date:        eventDateInput.value,
            title:       document.getElementById('event-title').value.trim(),
            time:        document.getElementById('event-time').value,
            description: document.getElementById('event-description').value.trim()
        };

        // Intentar guardar en backend
        let savedFromBackend = false;
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent)
            });
            if (response.ok) {
                const saved = await response.json();
                events.push(saved);
                savedFromBackend = true;
            }
        } catch (err) { /* sin backend */ }

        // Guardar localmente si no se pudo en backend
        if (!savedFromBackend) {
            events.push(newEvent);
        }

        saveLocalEvents();
        renderCalendar();
        renderEventsForDate(selectedDate);
        hideModal();
    });

    // ----------------------------------------------------
    //  NAVEGACIÓN
    // ----------------------------------------------------
    prevBtn?.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar();
    });

    nextBtn?.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar();
    });

    // ----------------------------------------------------
    //  INICIO
    // ----------------------------------------------------
    fetchEvents();
});
