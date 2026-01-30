// ====== BL vindo da URL ======
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
            <label>Nome do Ship</label>
            <input type="text" id="ship-name-${shipCount}" class="form-input" required>
        </div>

        <div class="form-group">
            <label>Personagem 1</label>
            <input type="text" id="character-1-${shipCount}" class="form-input" required>
        </div>

        <div class="form-group">
            <label>Personagem 2</label>
            <input type="text" id="character-2-${shipCount}" class="form-input" required>
        </div>
    `;

    shipsContainer.appendChild(shipSection);
}

function removeShipSection(shipNumber) {
    const shipSection = document.getElementById(`ship-section-${shipNumber}`);
    if (shipSection) shipSection.remove();
}

async function handleSubmit(e) {
    e.preventDefault();

    const ships = [];

    for (let i = 1; i <= shipCount; i++) {
        const section = document.getElementById(`ship-section-${i}`);
        if (!section) continue;

        const shipName = document.getElementById(`ship-name-${i}`)?.value.trim();
        const character1 = document.getElementById(`character-1-${i}`)?.value.trim();
        const character2 = document.getElementById(`character-2-${i}`)?.value.trim();

        if (shipName && character1 && character2) {
            ships.push({
                ship_name: shipName,
                character1_name: character1,
                character2_name: character2
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
            const response = await fetch(`${API_BASE_URL}/series/${blId}/ship-characters-by-name`, {
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

        showMessage('success', `${successCount} ship(s) de personagens criado(s)!`);
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

    const target = type === 'success' ? success : error;
    target.querySelector('.message-text').textContent = text;
    target.style.display = 'flex';

    setTimeout(() => target.style.display = 'none', 5000);
}