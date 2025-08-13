const monthYear = document.getElementById('monthYear');
const calendarBody = document.getElementById('calendar-body');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDate = new Date();

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    monthYear.innerText = `${monthNames[month]} ${year}`;

    // Limpia la tabla de forma eficiente y segura
    while (calendarBody.firstChild) {
        calendarBody.removeChild(calendarBody.firstChild);
    }

    const today = new Date(); // Obtener la fecha de hoy una sola vez
    const fragment = document.createDocumentFragment(); // Usar fragmento para mejor rendimiento

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDayOfMonth) {
                // Celda vacía al inicio del mes
            } else if (date > lastDayOfMonth) {
                // Finaliza el mes
                break;
            } else {
                cell.innerText = date;

                // Marca el día actual de forma optimizada
                if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    cell.classList.add('today');
                }
                date++;
            }
            row.appendChild(cell);
        }
        fragment.appendChild(row);
    }
    calendarBody.appendChild(fragment); // Añade el fragmento al DOM de una sola vez
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();