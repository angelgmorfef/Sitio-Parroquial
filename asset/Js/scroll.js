// Obtén el botón
const backToTopBtn = document.getElementById("back-to-top-btn");

// Muestra u oculta el botón cuando se hace scroll
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    // Si el usuario ha hecho scroll más de 20px desde la parte superior
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.classList.add("show"); // Añade la clase 'show'
    } else {
        backToTopBtn.classList.remove("show"); // Remueve la clase 'show'
    }
}

// Cuando el usuario hace clic en el botón, regresa al inicio de la página
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Hace el scroll con una animación suave
    });
});