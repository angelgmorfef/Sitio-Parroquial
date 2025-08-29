document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Captura todos los valores de los nuevos campos
      const nombre = document.getElementById('nombre-input').value;
      const apellido = document.getElementById('apellido-input').value;
      const correo = document.getElementById('email-input').value;
      const username = document.getElementById('username-input').value;
      const password = document.getElementById('password-input').value;
            
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nombre, apellido, correo, username, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.msg);
          window.location.href = 'ingreso.html';
        } else {
          alert(data.msg || 'Error al registrar el usuario. Inténtelo de nuevo.');
        }
      } catch (error) {
        console.error('Error en el registro:', error);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }
});