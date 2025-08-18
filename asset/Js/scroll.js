// asset/Js/scroll.js
document.addEventListener('DOMContentLoaded', () => {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return; // Si no existe el botón, salimos.

  const SHOW_THRESHOLD = 300; // px de scroll para mostrar el botón
  let ticking = false;

  // Comprueba si se debe mostrar u ocultar el botón
  function checkScroll() {
    const y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (y > SHOW_THRESHOLD) backToTopBtn.classList.add('show');
    else backToTopBtn.classList.remove('show');
  }

  // Handler optimizado con requestAnimationFrame
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Inicializa el estado al cargar
  checkScroll();

  // Listeners de scroll/resize (passive para mejor performance)
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Función para hacer scroll al top respetando prefers-reduced-motion
  function scrollToTop() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Click y accesibilidad por teclado
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToTop();
    backToTopBtn.blur(); // quitar foco visual después de clic
  });

  backToTopBtn.addEventListener('keydown', (e) => {
    // Soporte para activar con Enter o Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      backToTopBtn.click();
    }
  });

  // Opcional: si el usuario tabula hasta el botón, aseguramos que esté visible
  backToTopBtn.addEventListener('focus', () => backToTopBtn.classList.add('show'));
});
