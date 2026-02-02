// ====== BL e flow vindos pela URL ======
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

let shipCount = 1;

document.addEventListener('DOMContentLoaded', async function () {
    requireAuth();
    await loadSeriesInfo();

    const form = document.getElementById('add-ship-form');
    form.addEventListener('submit', handleSubmit);

    if (isCreateFlow) {
        renderFlowNavigation('add-character-ship.html');
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

    setLoading(true);
    try {
        let successCount = 0;
        const errors = [];

        for (const ship of ships) {
            const response = await fetch(`${API_BASE_URL}/series/${blId}/ship-actors-by-name`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ship)
            });

            if (response.ok) {
                successCount++;
            } else {
                const error = await response.json();
                errors.push(`${ship.ship_name}: ${error.detail || 'Erro desconhecido'}`);
            }
        }

        if (successCount > 0 && errors.length === 0) {
            showMessage('success', `${successCount} ship(s) criado(s) com sucesso!`);
            if (isCreateFlow) {
                setTimeout(() => { window.location.href = 'add-character-ship.html?blId=' + blId + '&flow=create'; }, 2000);
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