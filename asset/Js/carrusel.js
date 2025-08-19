document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    const slide = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    if (!slides || slide.length === 0 || !prevBtn || !nextBtn) {
        console.error("El carrusel no se pudo iniciar. Faltan elementos.");
        return;
    }

    let currentIndex = 0;

    function goToSlide(index) {
        if (index < 0 || index >= slide.length) return; // Evita errores si el índice es incorrecto
        const offset = -index * 100;
        slides.style.transform = `translateX(${offset}%)`;
        currentIndex = index;
    }

    prevBtn.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
            newIndex = slide.length - 1;
        }
        goToSlide(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= slide.length) {
            newIndex = 0;
        }
        goToSlide(newIndex);
    });

    setInterval(() => {
        let newIndex = currentIndex + 1;
        if (newIndex >= slide.length) {
            newIndex = 0;
        }
        goToSlide(newIndex);
    }, 3000); // Cambia de diapositiva cada 5 segundos
});

