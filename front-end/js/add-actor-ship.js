// ====== BL vindo pela URL ======
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

let shipCount = 1;

document.addEventListener('DOMContentLoaded', async function () {
    requireAuth();
    await loadSeriesInfo();

    const form = document.getElementById('add-ship-form');
    form.addEventListener('submit', handleSubmit);
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

function addShipSection() {
    shipCount++;
    const shipsContainer = document.getElementById('ships-container');

    const shipSection = document.createElement('div');
    shipSection.className = 'ship-section';
    shipSection.id = `ship-section-${shipCount}`;

    shipSection.innerHTML = `
        <div class="ship-header">
            <h3 class="ship-title">Ship ${shipCount}</h3>
            <button type="button" class="remove-ship-button" onclick="removeShipSection(${shipCount})">
                × Remover
            </button>
        </div>

        <div class="form-group">
            <label for="ship-name-${shipCount}">Nome do Ship</label>
            <input 
                type="text" 
                id="ship-name-${shipCount}" 
                class="form-input"
                placeholder="Ex: BrightWin"
                required
            >
        </div>

        <div class="form-group">
            <label for="actor-1-${shipCount}">Ator 1</label>
            <input 
                type="text" 
                id="actor-1-${shipCount}" 
                class="form-input"
                placeholder="Nome do primeiro ator"
                required
            >
        </div>

        <div class="form-group">
            <label for="actor-2-${shipCount}">Ator 2</label>
            <input 
                type="text" 
                id="actor-2-${shipCount}" 
                class="form-input"
                placeholder="Nome do segundo ator"
                required
            >
        </div>
    `;

    shipsContainer.appendChild(shipSection);
}

function removeShipSection(shipNumber) {
    const shipSection = document.getElementById(`ship-section-${shipNumber}`);
    if (shipSection) {
        shipSection.remove();
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    const ships = [];

    for (let i = 1; i <= shipCount; i++) {
        const section = document.getElementById(`ship-section-${i}`);
        if (!section) continue;

        const shipName = document.getElementById(`ship-name-${i}`)?.value.trim();
        const actor1 = document.getElementById(`actor-1-${i}`)?.value.trim();
        const actor2 = document.getElementById(`actor-2-${i}`)?.value.trim();

        if (shipName && actor1 && actor2) {
            ships.push({
                ship_name: shipName,
                actor1_nickname: actor1,
                actor2_nickname: actor2
            });
        }
    }

    if (ships.length === 0) {
        showMessage('error', 'Preencha todos os campos de pelo menos um ship.');
        return;
    }

    try {
        let successCount = 0;

        for (const ship of ships) {
            const response = await fetch(`${API_BASE_URL}/series/${blId}/ship-actors-by-name`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ship)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Erro ao criar ship');
            }

            successCount++;
        }

        showMessage('success', `${successCount} ship(s) criado(s) com sucesso!`);
        setTimeout(() => goBackToDetails(), 2000);
    } catch (error) {
        showMessage('error', error.message);
    }
}

function showMessage(type, text) {
    const success = document.getElementById('success-message');
    const error = document.getElementById('error-message');

    success.style.display = 'none';
    error.style.display = 'none';

    if (type === 'success') {
        success.querySelector('.message-text').textContent = text;
        success.style.display = 'flex';
        setTimeout(() => success.style.display = 'none', 5000);
    }

    if (type === 'error') {
        error.querySelector('.message-text').textContent = text;
        error.style.display = 'flex';
        setTimeout(() => error.style.display = 'none', 5000);
    }
}