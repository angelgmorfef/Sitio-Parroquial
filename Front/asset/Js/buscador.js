document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const mainContent = document.querySelector('main');
    const searchNavButtons = document.getElementById('search-nav-buttons'); // si no existe, no pasa nada

    // Guardamos el HTML original para poder restaurarlo
    let originalContent = mainContent.innerHTML;
    let highlights = [];
    let currentHighlightIndex = -1;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        searchAndHighlight(searchTerm);
    });

    // Escapa caracteres especiales para usar en RegExp
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function searchAndHighlight(term) {
        removeHighlights();

        if (!term) {
            if (searchNavButtons) searchNavButtons.style.display = 'none';
            return;
        }

        // Construimos regexp escapando caracteres y buscando en modo insensible
        const safe = escapeRegExp(term);
        const regex = new RegExp(`(${safe})`, 'gi');

        // Reemplazamos por span con clase highlight
        let newContent = originalContent.replace(regex, '<span class="highlight">$1</span>');
        mainContent.innerHTML = newContent;

        highlights = Array.from(document.querySelectorAll('.highlight'));
        currentHighlightIndex = -1;

        if (highlights.length > 0) {
            if (searchNavButtons) searchNavButtons.style.display = 'flex';
            scrollToHighlight(0);

            // Añadimos un listener de documento que se ejecuta una sola vez y quita el resaltado
            // Usamos setTimeout para evitar que el mismo click que envió el formulario borre inmediatamente
            setTimeout(() => {
                document.addEventListener('click', function onDocClick() {
                    removeHighlights();
                    if (searchNavButtons) searchNavButtons.style.display = 'none';
                }, { once: true });
            }, 0);

        } else {
            if (searchNavButtons) searchNavButtons.style.display = 'none';
            alert('No se encontraron coincidencias.');
        }
    }

    function removeHighlights() {
        // Restauramos el HTML original (quita todos los spans de highlight)
        mainContent.innerHTML = originalContent;
        highlights = [];
        currentHighlightIndex = -1;
    }

    function scrollToHighlight(index) {
        if (index >= 0 && index < highlights.length) {
            if (highlights[currentHighlightIndex]) {
                highlights[currentHighlightIndex].classList.remove('active');
            }
            currentHighlightIndex = index;
            const highlightElement = highlights[currentHighlightIndex];
            highlightElement.classList.add('active');
            highlightElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // (Opcional) soporte de navegación con teclas para pasar por coincidencias
    document.addEventListener('keydown', (e) => {
        if (!highlights || highlights.length === 0) return;
        if (e.key === 'ArrowDown' || e.key === 'n') {
            e.preventDefault();
            let next = (currentHighlightIndex + 1) % highlights.length;
            scrollToHighlight(next);
        } else if (e.key === 'ArrowUp' || e.key === 'p') {
            e.preventDefault();
            let prev = (currentHighlightIndex - 1 + highlights.length) % highlights.length;
            scrollToHighlight(prev);
        }
    });

});
