// Dados de exemplo do BL
const blData = {
    id: 1,
    name: "Love in the Moonlight"
};

let shipCount = 1; // Começamos com 1 ship

document.addEventListener('DOMContentLoaded', function() {
    // Carregar nome do BL
    document.getElementById('current-bl').textContent = blData.name;
    
    // Configurar formulário
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
                name="ship-name-${shipCount}" 
                class="form-input"
                placeholder="Ex: PhayaTharn"
                required
            >
        </div>

        <div class="form-group">
            <label for="character-1-${shipCount}">Personagem 1</label>
            <input 
                type="text" 
                id="character-1-${shipCount}" 
                name="character-1-${shipCount}" 
                class="form-input"
                placeholder="Nome do primeiro personagem"
                required
            >
        </div>

        <div class="form-group">
            <label for="character-2-${shipCount}">Personagem 2</label>
            <input 
                type="text" 
                id="character-2-${shipCount}" 
                name="character-2-${shipCount}" 
                class="form-input"
                placeholder="Nome do segundo personagem"
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
    
    // Coletar dados de todos os ships
    for (let i = 1; i <= shipCount; i++) {
        const shipSection = document.getElementById(`ship-section-${i}`);
        
        // Verificar se o ship ainda existe (pode ter sido removido)
        if (!shipSection) continue;
        
        const shipName = document.getElementById(`ship-name-${i}`);
        const character1 = document.getElementById(`character-1-${i}`);
        const character2 = document.getElementById(`character-2-${i}`);
        
        if (shipName && character1 && character2) {
            const shipData = {
                shipName: shipName.value.trim(),
                characters: [
                    character1.value.trim(),
                    character2.value.trim()
                ]
            };
            
            if (shipData.shipName && shipData.characters[0] && shipData.characters[1]) {
                ships.push(shipData);
            }
        }
    }
    
    if (ships.length === 0) {
        showMessage('error', 'Por favor, preencha pelo menos um ship completo.');
        return;
    }
    
    const requestData = {
        blId: blData.id,
        ships: ships
    };
    
    // Aqui você faria a chamada ao backend
    // fetch('/api/bls/' + blData.id + '/character-ships', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(requestData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     showMessage('success', data.message || `💞 ${ships.length} ship(s) adicionado(s) com sucesso!`);
    //     // Limpar formulário
    //     document.getElementById('ships-container').innerHTML = '';
    //     shipCount = 0;
    //     addShipSection(); // Adicionar o primeiro ship novamente
    // })
    // .catch(error => {
    //     showMessage('error', 'Erro ao adicionar ships. Tente novamente.');
    // });
    
    // Simulação de sucesso (remover quando implementar o backend real)
    console.log('Dados dos ships:', requestData);
    const shipsText = ships.length === 1 ? '1 ship foi adicionado' : `${ships.length} ships foram adicionados`;
    showMessage('success', `💞 ${shipsText} com sucesso!`);
    
    // Limpar formulário
    document.getElementById('ships-container').innerHTML = '';
    shipCount = 0;
    addShipSection(); // Adicionar o primeiro ship novamente
}

function showMessage(type, text) {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Esconder todas as mensagens primeiro
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Mostrar mensagem apropriada
    if (type === 'success') {
        successMessage.querySelector('.message-text').textContent = text;
        successMessage.style.display = 'flex';
        
        // Auto-esconder após 5 segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    } else if (type === 'error') {
        errorMessage.querySelector('.message-text').textContent = text;
        errorMessage.style.display = 'flex';
        
        // Auto-esconder após 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}