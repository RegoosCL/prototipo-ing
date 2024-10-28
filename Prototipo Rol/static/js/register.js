document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const message = document.getElementById('message');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            message.textContent = 'Las contraseñas no coinciden';
            message.style.color = '#FF6B6B';
            return;
        }

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                message.textContent = 'Registro exitoso!';
                message.style.color = '#4ECDC4';
                setTimeout(() => {
                    window.location.href = '';
                }, 2000);
            } else {
                message.textContent = data.message || 'Error en el registro';
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