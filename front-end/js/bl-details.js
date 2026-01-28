// Obter BL ID da URL
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');

if (!blId) {
    alert('BL não informado');
    window.location.href = 'bl-list.html';
}

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    loadBlDetails();
});

async function loadBlDetails() {
    try {
        const response = await fetch(`${API_BASE_URL}/series/${blId}`);

        if (!response.ok) {
            throw new Error('Erro ao carregar detalhes do BL');
        }

        const blData = await response.json();

        // Preencher informações básicas
        document.getElementById('bl_title').textContent = blData.title || 'Sem título';
        document.getElementById('country').textContent = blData.country || '-';
        document.getElementById('release_date').textContent = formatDate(blData.release_date);
        document.getElementById('genre').textContent = blData.genre || '-';
        document.getElementById('platform').textContent = blData.platform || '-';
        document.getElementById('status').textContent = blData.status || '-';
        document.getElementById('rating').textContent = blData.rate || '-';
        document.getElementById('producer').textContent = blData.production_company || '-';
        document.getElementById('start_date').textContent = formatDate(blData.date_start);
        document.getElementById('end_date').textContent = formatDate(blData.date_watched);
        document.getElementById('synopsis').textContent = blData.synopsis || '-';

        // Renderizar listas
        renderCharacters(blData.characters || []);
        renderActors(blData.actors || []);
        renderCharacterShips(blData.ship_characters || []);
        renderActorShips(blData.ship_actors || []);

    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        alert('Erro ao carregar detalhes do BL');
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function renderCharacters(characters) {
    const list = document.getElementById('characters_list');
    const empty = document.getElementById('characters_empty');

    list.innerHTML = '';

    if (!characters || characters.length === 0) {
        empty.style.display = 'block';
        list.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    list.style.display = 'grid';

    characters.forEach(c => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-name">${c.name}</div>
            <div class="item-detail">Tipo: ${c.role_type || '-'}</div>
        `;
        list.appendChild(card);
    });
}

function renderActors(actors) {
    const list = document.getElementById('actors_list');
    const empty = document.getElementById('actors_empty');

    list.innerHTML = '';

    if (!actors || actors.length === 0) {
        empty.style.display = 'block';
        list.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    list.style.display = 'grid';

    actors.forEach(actor => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `<div class="item-name">${actor.name}</div>`;
        list.appendChild(card);
    });
}

function renderCharacterShips(ships) {
    const list = document.getElementById('character_ships_list');
    const empty = document.getElementById('character_ships_empty');

    list.innerHTML = '';

    if (!ships || ships.length === 0) {
        empty.style.display = 'block';
        list.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    list.style.display = 'grid';

    ships.forEach(ship => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `<div class="item-name">${ship.name}</div>`;
        list.appendChild(card);
    });
}

function renderActorShips(ships) {
    const list = document.getElementById('actor_ships_list');
    const empty = document.getElementById('actor_ships_empty');

    list.innerHTML = '';

    if (!ships || ships.length === 0) {
        empty.style.display = 'block';
        list.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    list.style.display = 'grid';

    ships.forEach(ship => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `<div class="item-name">${ship.name}</div>`;
        list.appendChild(card);
    });
}

// Funções de navegação para vincular elementos
function linkCharacter() {
    window.location.href = `add-character.html?blId=${blId}`;
}

function linkActor() {
    window.location.href = `add-actor-to-bl.html?blId=${blId}`;
}

function linkCharacterShip() {
    window.location.href = `add-character-ship.html?blId=${blId}`;
}

function linkActorShip() {
    window.location.href = `add-actor-ship.html?blId=${blId}`;
}
