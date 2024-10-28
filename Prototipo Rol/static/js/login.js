document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Aquí realizarías la llamada a tu API de backend
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                message.textContent = 'Login exitoso!';
                message.style.color = '#4ECDC4';
                setTimeout(() => {
                    window.location.href = '/index';
                }, 2000);
            } else {
                message.textContent = 'Usuario o contraseña incorrectos';
                message.style.color = '#FF6B6B';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            message.textContent = 'Error en el servidor';
            message.style.color = '#FF6B6B';
        });
    });
});