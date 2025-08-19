document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) return;

    const SHOW_THRESHOLD = 300;
    let ticking = false;

    function checkScroll() {
        const y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (y > SHOW_THRESHOLD) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    checkScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    function scrollToTop() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToTop();
        backToTopBtn.blur();
    });

    backToTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            backToTopBtn.click();
        }
    });

    backToTopBtn.addEventListener('focus', () => backToTopBtn.classList.add('show'));
});