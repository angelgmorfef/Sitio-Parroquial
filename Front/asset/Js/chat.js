document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.querySelector('.chat-toggle-btn');
    const chatWindow = document.querySelector('.chat-window');
    const closeButton = document.querySelector('.chat-close-btn');
    const chatBody = document.querySelector('.chat-body');
    const chatFooter = document.querySelector('.chat-footer');

    // Function to check if the user is logged in by looking for the token.
    const isUserLoggedIn = () => {
        return localStorage.getItem('authToken') !== null;
    };

    // Function to update the chat window content based on login status.
    const updateChatContent = () => {
        if (isUserLoggedIn()) {
            // If the user is logged in, show the full chat functionality.
            chatBody.innerHTML = '<p>¡Hola! ¿En qué podemos ayudarte?</p>';
            chatFooter.style.display = 'flex';
        } else {
            // If the user is NOT logged in, show a message and a link to log in.
            chatBody.innerHTML = `
                <p>Debes iniciar sesión para usar el chat.</p>
                <button onclick="window.location.href='ingreso.html'" class="login-button">Ir a Iniciar Sesión</button>
            `;
            chatFooter.style.display = 'none';
        }
    };

    // Event listener for the main chat button.
    chatButton.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        updateChatContent(); // This will refresh the chat content every time it's opened.
    });

    // Event listener for the close button.
    closeButton.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Call this function once when the page loads to set the initial chat state.
    updateChatContent();
});

// Función para cerrar la sesión
const logoutUser = () => {
    // Elimina el token del almacenamiento local
    localStorage.removeItem('authToken');
    // Puedes eliminar cualquier otro dato de usuario si lo guardaste
    // localStorage.removeItem('userName');

    // Redirige al usuario a la página de inicio
    window.location.href = 'index.html'; 
};

document.addEventListener('DOMContentLoaded', () => {
    // ... (Tu código actual para el chat) ...

    const headerButtonsContainer = document.querySelector('.header-buttons-container');

    // Función para actualizar la visibilidad de los botones del header
    const updateHeaderButtons = () => {
        const token = localStorage.getItem('authToken');

        if (token) {
            // Si el token existe, el usuario está logueado
            // Puedes obtener el nombre de usuario del token si lo guardaste al iniciar sesión
            // const username = localStorage.getItem('userName'); 

            headerButtonsContainer.innerHTML = `
                <a href="#" class="header-button" onclick="logoutUser()">Cerrar Sesión</a>
            `;
        } else {
            // Si no hay token, el usuario no está logueado
            headerButtonsContainer.innerHTML = `
                <a href="registro.html" class="header-button">Registro</a>
                <a href="ingreso.html" class="header-button">Ingreso</a>
            `;
        }
    };

    // Llama a esta función al cargar la página para establecer el estado inicial
    updateHeaderButtons();
});