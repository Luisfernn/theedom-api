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

    const name = document.getElementById('actor_name').value.trim();
    const nickname = document.getElementById('actor_nickname').value.trim();
    const nationality = document.getElementById('actor_nationality').value.trim();
    const gender = document.getElementById('actor_gender').value.trim();
    const birthday = document.getElementById('actor_birthday').value.trim() || null;
    const agency = document.getElementById('actor_agency').value.trim() || null;
    const ig = document.getElementById('actor_ig').value.trim() || null;

    if (!name || !nickname || !nationality || !gender) {
        showMessage('error', 'Preencha os campos obrigatórios.');
        return;
    }

    setLoading(true);
    try {
        // 1. Criar ator (backend retorna existente se nickname já existe)
        const createResponse = await fetch(`${API_BASE_URL}/actors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, nickname, nationality, gender, birthday, agency, ig })
        });

        if (!createResponse.ok) {
            const error = await createResponse.json();
            throw new Error(error.detail || 'Erro ao criar ator');
        }

        // 2. Vincular ator à série
        const linkResponse = await fetch(`${API_BASE_URL}/series/${blId}/actors-by-nickname`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actor_nickname: nickname })
        });

        if (!linkResponse.ok) {
            const error = await linkResponse.json();
            throw new Error(error.detail || 'Erro ao vincular ator à série');
        }

        showMessage('success', `Ator "${nickname}" criado e vinculado com sucesso!`);

        // Limpar formulário
        document.getElementById('add_actor_form').reset();

    } catch (error) {
        showMessage('error', error.message);
    } finally {
        setLoading(false);
    }
}

function setLoading(loading) {
    const btn = document.querySelector('.submit-button');
    const text = btn.querySelector('.btn-text');
    const dots = btn.querySelector('.btn-dots');
    btn.disabled = loading;
    text.style.display = loading ? 'none' : 'inline';
    dots.style.display = loading ? 'inline-flex' : 'none';
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
