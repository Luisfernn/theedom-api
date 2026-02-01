// Obter BL e flow pela URL
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');
const isCreateFlow = urlParams.get('flow') === 'create';

// Função para voltar para bl-details (navegação explícita)
function goBackToDetails() {
    if (blId) {
        window.location.href = 'bl-details.html?blId=' + blId;
    } else {
        window.location.href = 'bl-list.html';
    }
}

if (!blId) {
    alert('BL não informado');
    window.location.href = 'bl-list.html';
}

let messageTimeout = null;

document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();
    await loadSeriesInfo();

    const form = document.getElementById('add_actor_form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    if (isCreateFlow) {
        renderFlowNavigation('add-character.html');
    }
});

async function loadSeriesInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/series/${blId}`);
        if (!response.ok) {
            alert('BL não encontrado.');
            window.location.href = 'bl-list.html';
            return;
        }
        const series = await response.json();
        document.getElementById('current_bl').textContent = series.title;
    } catch (error) {
        console.error('Erro ao carregar serie:', error);
        alert('Erro ao verificar BL.');
        window.location.href = 'bl-list.html';
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const actorNicknameInput = document.getElementById('actor_name');
    if (!actorNicknameInput) return;

    const actorNickname = actorNicknameInput.value.trim();

    if (!actorNickname) {
        showMessage('error', 'Por favor, digite o nickname do ator.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/series/${blId}/actors-by-nickname`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actor_nickname: actorNickname })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Erro ao vincular ator');
        }

        const result = await response.json();
        showMessage('success', result.message);

        // Limpar campo
        actorNicknameInput.value = '';

        // Redirecionar após 2 segundos
        if (isCreateFlow) {
            setTimeout(() => { window.location.href = 'add-character.html?blId=' + blId + '&flow=create'; }, 2000);
        } else {
            setTimeout(() => goBackToDetails(), 2000);
        }

    } catch (error) {
        showMessage('error', error.message);
    }
}

function showMessage(type, text) {
    const successMessage = document.getElementById('success_message');
    const errorMessage = document.getElementById('error_message');

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

function renderFlowNavigation(nextPage) {
    const container = document.querySelector('.content-container');
    const nav = document.createElement('div');
    nav.className = 'flow-navigation';
    nav.innerHTML = `
        <button type="button" class="flow-btn flow-btn-home" onclick="window.location.href='index.html'">
            Voltar para Home
        </button>
        <button type="button" class="flow-btn flow-btn-next" onclick="window.location.href='${nextPage}?blId=${blId}&flow=create'">
            Próximo →
        </button>
    `;
    container.appendChild(nav);
}
