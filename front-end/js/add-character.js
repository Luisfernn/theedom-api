// Obter BL ID da URL
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');

if (!blId) {
    alert('BL não informado');
    window.history.back();
}

let characterCount = 1; // Começamos com 1 personagem

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    // ⚠️ Nome do BL depois deve vir do backend
    const blNameEl = document.getElementById('current-bl');
    if (blNameEl) {
        blNameEl.textContent = `BL #${blId}`;
    }

    const form = document.getElementById('add-character-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

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

function handleSubmit(e) {
    e.preventDefault();

    const characters = [];

    for (let i = 1; i <= characterCount; i++) {
        const section = document.getElementById(`character-section-${i}`);
        if (!section) continue;

        const name = document.getElementById(`character-name-${i}`)?.value.trim();
        const actor = document.getElementById(`actor-name-${i}`)?.value.trim();
        const role = document.getElementById(`role-type-${i}`)?.value;

        if (name && actor && role) {
            characters.push({ name, actor, role });
        }
    }

    if (characters.length === 0) {
        showMessage('error', 'Preencha pelo menos um personagem completo.');
        return;
    }

    const requestData = {
        blId: Number(blId),
        characters
    };

    console.log('Payload:', requestData);

    showMessage(
        'success',
        `${characters.length} personagem(ns) adicionado(s) com sucesso!`
    );

    document.getElementById('characters-container').innerHTML = '';
    characterCount = 0;
    addCharacterSection();
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