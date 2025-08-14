document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const mainContent = document.querySelector('main');
    const searchNavButtons = document.getElementById('search-nav-buttons');
    
    let originalContent = mainContent.innerHTML;
    let highlights = [];
    let currentHighlightIndex = -1;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        searchAndHighlight(searchTerm);
    });

    function searchAndHighlight(term) {
        removeHighlights();

        if (!term) {
            if (searchNavButtons) searchNavButtons.style.display = 'none';
            return;
        }
        
        const regex = new RegExp(`(${term})`, 'gi');
        let newContent = originalContent.replace(regex, '<span class="highlight">$1</span>');
        mainContent.innerHTML = newContent;
        
        highlights = document.querySelectorAll('.highlight');
        currentHighlightIndex = -1;

        if (highlights.length > 0) {
            if (searchNavButtons) searchNavButtons.style.display = 'flex';
            scrollToHighlight(0);
        } else {
            if (searchNavButtons) searchNavButtons.style.display = 'none';
            alert('No se encontraron coincidencias.');
        }
    }

    function removeHighlights() {
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

});