
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const modal = document.getElementById('characterModal');
    const closeBtn = document.querySelector('.close-btn');
    const createButtons = document.querySelectorAll('.create-btn');
    const characterForm = document.getElementById('characterForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Mostrar modal al hacer clic en los botones de crear
    createButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'block';
            // Obtener el tipo de personaje del id del padre
            const characterType = button.parentElement.id;
            sessionStorage.setItem('selectedCharacterType', characterType);
        });
    });

    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Manejar envío del formulario
    characterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(characterForm);
        const characterType = sessionStorage.getItem('selectedCharacterType');

        try {
            const response = await fetch('/create_character', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    race: formData.get('race'),
                    characterType: characterType
                })
            });

            const data = await response.json();
            if (data.success) {
                showNotification('¡Personaje creado con éxito!', 'success');
                modal.style.display = 'none';
                characterForm.reset();
            } else {
                showNotification('Error al crear el personaje', 'error');
            }
        } catch (error) {
            showNotification('Error de conexión', 'error');
        }
    });

    // Función para mostrar notificaciones
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Animaciones para las tarjetas de personajes
    const cards = document.querySelectorAll('.character-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Manejar cierre de sesión
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = '/';
            }
        } catch (error) {
            showNotification('Error al cerrar sesión', 'error');
        }
    });
});