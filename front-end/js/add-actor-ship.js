// ====== BL vindo pela URL ======
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');
const blName = urlParams.get('blName'); // opcional

if (!blId) {
    alert('BL não informado');
    window.history.back();
}

let shipCount = 1;

document.addEventListener('DOMContentLoaded', function () {
    // Mostrar nome do BL (se vier pela URL)
    if (blName) {
        document.getElementById('current-bl').textContent = blName;
    }

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

function handleSubmit(e) {
    e.preventDefault();

    const ships = [];

    for (let i = 1; i <= shipCount; i++) {
        const section = document.getElementById(`ship-section-${i}`);
        if (!section) continue;

        const shipName = document.getElementById(`ship-name-${i}`);
        const actor1 = document.getElementById(`actor-1-${i}`);
        const actor2 = document.getElementById(`actor-2-${i}`);

        if (
            shipName?.value.trim() &&
            actor1?.value.trim() &&
            actor2?.value.trim()
        ) {
            ships.push({
                shipName: shipName.value.trim(),
                actors: [
                    actor1.value.trim(),
                    actor2.value.trim()
                ]
            });
        }
    }

    if (ships.length === 0) {
        showMessage('error', 'Preencha pelo menos um ship completo.');
        return;
    }

    const requestData = {
        blId: Number(blId),
        ships
    };

    console.log('Dados enviados:', requestData);

    showMessage('success', `💞 ${ships.length} ship(s) adicionado(s) com sucesso!`);

    document.getElementById('ships-container').innerHTML = '';
    shipCount = 0;
    addShipSection();
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