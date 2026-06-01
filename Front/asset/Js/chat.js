/**
 * chat.js — Lógica del widget de chat flotante
 */
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle  = document.getElementById('chat-toggle');
    const chatWindow  = document.getElementById('chat-window');
    const chatClose   = document.getElementById('chat-close');
    const chatBody    = document.getElementById('chat-body');
    const chatFooter  = document.getElementById('chat-footer');

    // Fallback: algunos botones de chat se generan dinámicamente (ej. sección contacto)
    // Seleccionamos todos los .chat-toggle-btn que no sean el flotante principal
    document.querySelectorAll('.chat-toggle-btn:not(#chat-toggle)').forEach(btn => {
        btn.addEventListener('click', () => openChat());
    });

    // Verificar sesión
    const isLoggedIn = () => !!localStorage.getItem('authToken');

    function updateChatContent() {
        if (!chatBody || !chatFooter) return;
        if (isLoggedIn()) {
            chatBody.innerHTML = '<p>¡Hola! ¿En qué podemos ayudarte?</p>';
            chatFooter.style.display = 'flex';
        } else {
            chatBody.innerHTML = `
                <p>Debes iniciar sesión para usar el chat.</p>
                <button onclick="window.location.href='ingreso.html'" class="login-button">
                    Ir a Iniciar Sesión
                </button>
            `;
            chatFooter.style.display = 'none';
        }
    }

    function openChat() {
        chatWindow?.classList.add('open');
        updateChatContent();
    }

    function closeChat() {
        chatWindow?.classList.remove('open');
    }

    chatToggle?.addEventListener('click', () => {
        const isOpen = chatWindow?.classList.contains('open');
        isOpen ? closeChat() : openChat();
    });

    chatClose?.addEventListener('click', closeChat);

    // Enviar mensaje (placeholder)
    chatFooter?.querySelector('button')?.addEventListener('click', () => {
        const input = chatFooter.querySelector('input');
        if (!input?.value.trim()) return;
        const msg = input.value.trim();
        input.value = '';

        // Agregar mensaje del usuario
        const userBubble = document.createElement('p');
        userBubble.textContent = msg;
        userBubble.style.cssText = 'background:var(--primary);color:white;border-radius:12px 12px 2px 12px;margin-left:auto;margin-top:10px;max-width:80%;text-align:right;';
        chatBody?.appendChild(userBubble);

        // Respuesta automática
        setTimeout(() => {
            const botBubble = document.createElement('p');
            botBubble.textContent = 'Gracias por tu mensaje. Un miembro de nuestra parroquia te responderá pronto. 🙏';
            botBubble.style.marginTop = '10px';
            chatBody?.appendChild(botBubble);
            if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
        }, 800);

        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    });

    // También enviar con Enter
    chatFooter?.querySelector('input')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') chatFooter.querySelector('button')?.click();
    });

    // Estado inicial
    updateChatContent();
});