// ====== BL vindo da URL ======
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');

if (!blId) {
    alert('BL não informado');
    window.history.back();
}

// Apenas visual (temporário até backend)
const blName = "Love in the Moonlight";

let shipCount = 1;

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    document.getElementById('current-bl').textContent = blName;

    const form = document.getElementById('add-ship-form');
    form.addEventListener('submit', handleSubmit);
});

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

function handleSubmit(e) {
    e.preventDefault();

    const ships = [];

    for (let i = 1; i <= shipCount; i++) {
        const section = document.getElementById(`ship-section-${i}`);
        if (!section) continue;

        const shipName = document.getElementById(`ship-name-${i}`).value.trim();
        const c1 = document.getElementById(`character-1-${i}`).value.trim();
        const c2 = document.getElementById(`character-2-${i}`).value.trim();

        if (shipName && c1 && c2) {
            ships.push({
                shipName,
                characters: [c1, c2]
            });
        }
    }

    if (ships.length === 0) {
        showMessage('error', 'Preencha pelo menos um ship.');
        return;
    }

    const requestData = {
        blId: blId,
        ships: ships
    };

    console.log('Payload:', requestData);

    showMessage('success', 'Ships adicionados com sucesso!');

    document.getElementById('ships-container').innerHTML = '';
    shipCount = 0;
    addShipSection();
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