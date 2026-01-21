// Obter BL pela URL
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');

if (!blId) {
    alert('BL não informado');
    window.history.back();
}

let messageTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    const blNameEl = document.getElementById('current-bl');
    const form = document.getElementById('add-actor-form');

    // Nome do BL será preenchido futuramente pelo backend
    if (blNameEl) {
        blNameEl.textContent = `BL #${blId}`;
    }

    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

function handleSubmit(event) {
    event.preventDefault();

    const actorNameInput = document.getElementById('actor-name');
    if (!actorNameInput) return;

    const actorName = actorNameInput.value.trim();

    if (!actorName) {
        showMessage('error', 'Por favor, digite o nome do ator.');
        return;
    }

    const requestData = {
        blId: blId,
        actorName: actorName
    };

    // Aqui entrará o fetch futuramente
    console.log('Dados enviados:', requestData);

    showMessage(
        'success',
        `Ator "${actorName}" foi vinculado com sucesso ao BL.`
    );

    actorNameInput.value = '';
}

function showMessage(type, text) {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    if (!successMessage || !errorMessage) return;

    if (messageTimeout) {
        clearTimeout(messageTimeout);
        messageTimeout = null;
    }

    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    if (type === 'success') {
        successMessage.querySelector('.message-text').textContent = text;
        successMessage.style.display = 'flex';

        messageTimeout = setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }

    if (type === 'error') {
        errorMessage.querySelector('.message-text').textContent = text;
        errorMessage.style.display = 'flex';

        messageTimeout = setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}