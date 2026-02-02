// ====== BL e flow vindos da URL ======
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

let seriesTitle = '';
let existingTags = [];
let newTagFieldCount = 1;

document.addEventListener('DOMContentLoaded', async function () {
    requireAuth();
    await loadSeriesInfo();
    await loadExistingTags();
    renderExistingTags();

    document
        .getElementById('add-tags-form')
        .addEventListener('submit', handleSubmit);

    if (isCreateFlow) {
        renderFlowNavigation();
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
        seriesTitle = series.title;
        document.getElementById('current-bl').textContent = series.title;
    } catch (error) {
        console.error('Erro ao carregar serie:', error);
        alert('Erro ao verificar BL.');
        window.location.href = 'bl-list.html';
    }
}

async function loadExistingTags() {
    try {
        const response = await fetch(`${API_BASE_URL}/tags`);
        if (response.ok) {
            existingTags = await response.json();
        }
    } catch (error) {
        console.error('Erro ao carregar tags:', error);
        existingTags = [];
    }
}

function renderExistingTags() {
    const list = document.getElementById('existing-tags-list');
    list.innerHTML = '';

    existingTags.forEach(tag => {
        const div = document.createElement('div');
        div.className = 'tag-checkbox-item';

        div.innerHTML = `
            <input type="checkbox" value="${tag.id}">
            <label>${tag.name}</label>
        `;

        list.appendChild(div);
    });
}

function addNewTagField() {
    newTagFieldCount++;

    const container = document.getElementById('new-tags-container');
    const div = document.createElement('div');
    div.className = 'new-tag-field';
    div.id = `new-tag-${newTagFieldCount}`;

    div.innerHTML = `
        <input type="text" class="form-input" placeholder="Nome da tag">
        <button type="button" class="remove-tag-button" onclick="removeNewTagField(${newTagFieldCount})">×</button>
    `;

    container.appendChild(div);
}

function removeNewTagField(id) {
    const field = document.getElementById(`new-tag-${id}`);
    if (field) field.remove();
}

async function handleSubmit(e) {
    e.preventDefault();

    const selectedTagNames = [];
    document
        .querySelectorAll('#existing-tags-list input:checked')
        .forEach(cb => {
            const tagId = parseInt(cb.value);
            const tag = existingTags.find(t => t.id === tagId);
            if (tag) selectedTagNames.push(tag.name);
        });

    const newTags = [];
    document
        .querySelectorAll('#new-tags-container input')
        .forEach(input => {
            if (input.value.trim()) newTags.push(input.value.trim());
        });

    const allTags = [...selectedTagNames, ...newTags];

    if (allTags.length === 0) {
        showMessage('error', 'Selecione ou crie pelo menos uma tag.');
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/series/${blId}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tags: allTags })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Erro ao vincular tags');
        }

        showMessage('success', isCreateFlow ? 'Tags vinculadas com sucesso! Redirecionando para detalhes do BL...' : 'Tags vinculadas com sucesso!');
        setTimeout(() => goBackToDetails(), 2000);
    } catch (error) {
        showMessage('error', error.message);
    } finally {
        setLoading(false);
    }
}

function setLoading(loading) {
    const btn = document.querySelector('.submit-button');
    if (!btn) return;
    btn.disabled = loading;
    const text = btn.querySelector('.btn-text');
    const dots = btn.querySelector('.btn-dots');
    if (text) text.style.display = loading ? 'none' : 'inline';
    if (dots) dots.style.display = loading ? 'inline-flex' : 'none';
}

function showMessage(type, text) {
    const success = document.getElementById('success-message');
    const error = document.getElementById('error-message');

    success.style.display = 'none';
    error.style.display = 'none';

    const target = type === 'success' ? success : error;
    target.querySelector('.message-text').textContent = text;
    target.style.display = 'flex';

    setTimeout(() => target.style.display = 'none', 5000);
}

function renderFlowNavigation() {
    const container = document.querySelector('.content-container');
    const nav = document.createElement('div');
    nav.className = 'flow-navigation';
    nav.innerHTML = `
        <button type="button" class="flow-btn flow-btn-home" onclick="window.location.href='index.html'">
            Voltar para Home
        </button>
        <button type="button" class="flow-btn flow-btn-next" onclick="window.location.href='bl-details.html?blId=${blId}'">
            Concluir →
        </button>
    `;
    container.appendChild(nav);
}