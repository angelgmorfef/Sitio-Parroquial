document.addEventListener('DOMContentLoaded', () => {
  const chatButton = document.querySelector('.chat-toggle-btn');
  const chatWindow = document.querySelector('.chat-window');
  const closeButton = document.querySelector('.chat-close-btn');

  chatButton.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
  });

  closeButton.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });
});