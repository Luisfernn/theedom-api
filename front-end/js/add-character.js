// Obter BL ID e flow da URL
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

let characterCount = 1;
let blActors = [];

document.addEventListener('DOMContentLoaded', async function () {
    requireAuth();
    await loadSeriesInfo();

    const form = document.getElementById('add-character-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    if (isCreateFlow) {
        renderFlowNavigation('add-actor-ship.html');
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
        document.getElementById('current-bl').textContent = series.title;

        blActors = series.actors || [];
        populateActorSelect(document.getElementById('actor-name-1'));
    } catch (error) {
        console.error('Erro ao carregar serie:', error);
        alert('Erro ao verificar BL.');
        window.location.href = 'bl-list.html';
    }
}

function populateActorSelect(select) {
    select.innerHTML = '<option value="">Selecione o ator/atriz...</option>';
    blActors.forEach(actor => {
        const option = document.createElement('option');
        option.value = actor.nickname;
        option.textContent = actor.nickname;
        select.appendChild(option);
    });
}

function addCharacterSection() {
    characterCount++;
    const charactersContainer = document.getElementById('characters-container');

    const characterSection = document.createElement('div');
    characterSection.className = 'character-section';
    characterSection.id = `character-section-${characterCount}`;

    characterSection.innerHTML = `
        <div class="character-header">
            <h3 class="character-title">Personagem ${characterCount}</h3>
            <button type="button" class="remove-character-button" onclick="removeCharacterSection(${characterCount})">
                × Remover
            </button>
        </div>

        <div class="form-group">
            <label for="character-name-${characterCount}">Nome do Personagem</label>
            <input
                type="text"
                id="character-name-${characterCount}"
                class="form-input"
                required
            >
        </div>

        <div class="form-group">
            <label for="actor-name-${characterCount}">Ator/Atriz</label>
            <select
                id="actor-name-${characterCount}"
                class="form-select"
                required
            >
                <option value="">Selecione o ator/atriz...</option>
            </select>
        </div>

        <div class="form-group">
            <label for="role-type-${characterCount}">Tipo de Papel</label>
            <select
                id="role-type-${characterCount}"
                class="form-select"
                required
            >
                <option value="">Selecione...</option>
                <option value="main">Main Role</option>
                <option value="support">Support Role</option>
            </select>
        </div>
    `;

    charactersContainer.appendChild(characterSection);
    populateActorSelect(document.getElementById(`actor-name-${characterCount}`));
}

function removeCharacterSection(characterNumber) {
    const section = document.getElementById(`character-section-${characterNumber}`);
    if (section) section.remove();
}

async function handleSubmit(e) {
    e.preventDefault();

    const characters = [];

    for (let i = 1; i <= characterCount; i++) {
        const section = document.getElementById(`character-section-${i}`);
        if (!section) continue;

        const name = document.getElementById(`character-name-${i}`)?.value.trim();
        const actorNickname = document.getElementById(`actor-name-${i}`)?.value;
        const role = document.getElementById(`role-type-${i}`)?.value;

        if (name && actorNickname && role) {
            characters.push({ name, actor_nickname: actorNickname, role_type: role });
        }
    }

    if (characters.length === 0) {
        showMessage('error', 'Preencha pelo menos um personagem completo.');
        return;
    }

    setLoading(true);
    try {
        let successCount = 0;
        const errors = [];

        for (const char of characters) {
            const response = await fetch(`${API_BASE_URL}/characters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: char.name,
                    series_id: Number(blId),
                    actor_nickname: char.actor_nickname,
                    role_type: char.role_type
                })
            });

            if (response.ok) {
                successCount++;
            } else {
                const error = await response.json();
                errors.push(`${char.name}: ${error.detail || 'Erro desconhecido'}`);
            }
        }

        if (successCount > 0 && errors.length === 0) {
            showMessage('success', `${successCount} personagem(ns) adicionado(s) com sucesso!`);
            if (isCreateFlow) {
                setTimeout(() => { window.location.href = 'add-actor-ship.html?blId=' + blId + '&flow=create'; }, 2000);
            } else {
                setTimeout(() => goBackToDetails(), 2000);
            }
        } else if (successCount > 0 && errors.length > 0) {
            showMessage('error', `${successCount} criado(s), ${errors.length} falha(s): ${errors.join('; ')}`);
        } else {
            showMessage('error', `Nenhum criado. Erros: ${errors.join('; ')}`);
        }
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
    const success = document.getElementById('success-message');
    const error = document.getElementById('error-message');

    success.style.display = 'none';
    error.style.display = 'none';

    const target = type === 'success' ? success : error;
    target.querySelector('.message-text').textContent = text;
    target.style.display = 'flex';

    setTimeout(() => {
        target.style.display = 'none';
    }, 5000);
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
