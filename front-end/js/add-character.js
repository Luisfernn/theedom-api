// Obter BL ID da URL
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');

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

document.addEventListener('DOMContentLoaded', async function () {
    requireAuth();
    await loadSeriesInfo();

    const form = document.getElementById('add-character-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
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
    } catch (error) {
        console.error('Erro ao carregar serie:', error);
        alert('Erro ao verificar BL.');
        window.location.href = 'bl-list.html';
    }
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
            <input
                type="text"
                id="actor-name-${characterCount}"
                class="form-input"
                required
            >
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
        const role = document.getElementById(`role-type-${i}`)?.value;

        if (name && role) {
            characters.push({ name, role_type: role });
        }
    }

    if (characters.length === 0) {
        showMessage('error', 'Preencha pelo menos um personagem completo.');
        return;
    }

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

        if (successCount > 0) {
            showMessage('success', `${successCount} personagem(ns) adicionado(s) com sucesso!`);
            setTimeout(() => goBackToDetails(), 2000);
        }

        if (errors.length > 0) {
            showMessage('error', errors.join(', '));
        }
    } catch (error) {
        showMessage('error', error.message);
    }
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