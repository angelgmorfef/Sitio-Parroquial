document.addEventListener('DOMContentLoaded', () => {
    const monthYear = document.getElementById('monthYear');
    const calendarBody = document.getElementById('calendar-body');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!monthYear || !calendarBody || !prevBtn || !nextBtn) {
        console.error("Los elementos del calendario no se encontraron.");
        return;
    }

    let date = new Date();

    function renderCalendar() {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const startDay = firstDay.getDay();

        monthYear.textContent = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        calendarBody.innerHTML = '';

        let row = document.createElement('tr');

        // Crea celdas vacías para los días antes del primer día del mes
        for (let i = 0; i < startDay; i++) {
            const cell = document.createElement('td');
            cell.classList.add('empty-cell');
            row.appendChild(cell);
        }

        // Crea las celdas para cada día del mes
        for (let i = 1; i <= daysInMonth; i++) {
            if (row.children.length === 7) {
                calendarBody.appendChild(row);
                row = document.createElement('tr');
            }

            const cell = document.createElement('td');
            cell.textContent = i;

            // Marca el día de hoy
            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('today');
            }

            row.appendChild(cell);
        }

        // Rellena la última fila con celdas vacías
        while (row.children.length < 7) {
            const cell = document.createElement('td');
            cell.classList.add('empty-cell');
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }

    prevBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});