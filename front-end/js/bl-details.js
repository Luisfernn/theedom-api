// Obter BL ID da URL
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');

if (!blId) {
    alert('BL não informado');
    window.history.back();
}

// Mock simulando resposta do backend
function getMockBlData(blId) {
    return {
        id: Number(blId),
        title: "Love in the Moonlight",
        country: "Tailândia",
        release_date: "2024-01",
        genre: "Romance, Drama",
        platform: "GMMTV",
        status: "Completed",
        rating: "9.5",
        producer: "GMMTV Studio",
        start_date: "2024-01",
        end_date: "2024-03",
        synopsis:
            "Uma história romântica envolvente que se passa sob a luz do luar...",
        characters: [
            { name: "Phaya", actor: "Billy Patchanon" },
            { name: "Tharn", actor: "Babe Tanatat" }
        ],
        actors: [
            { name: "Billy Patchanon" },
            { name: "Babe Tanatat" }
        ],
        character_ships: [
            { name: "PhayaTharn", characters: "Phaya × Tharn" }
        ],
        actor_ships: [
            { name: "BillyBabe", actors: "Billy × Babe" }
        ]
    };
}

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    loadBlDetails();
});

function loadBlDetails() {
    // FUTURO:
    // fetch(`/api/bls/${blId}`).then(...)

    const blData = getMockBlData(blId);

    document.getElementById('bl-title').textContent = blData.title;
    document.getElementById('country').textContent = blData.country;
    document.getElementById('release_date').textContent = blData.release_date;
    document.getElementById('genre').textContent = blData.genre;
    document.getElementById('platform').textContent = blData.platform;
    document.getElementById('status').textContent = blData.status;
    document.getElementById('rating').textContent = blData.rating;
    document.getElementById('producer').textContent = blData.producer;
    document.getElementById('start_date').textContent = blData.start_date;
    document.getElementById('end_date').textContent = blData.end_date;
    document.getElementById('synopsis').textContent = blData.synopsis;

    renderCharacters(blData.characters);
    renderActors(blData.actors);
    renderCharacterShips(blData.character_ships);
    renderActorShips(blData.actor_ships);
}

function renderCharacters(characters) {
    const list = document.getElementById('characters-list');
    const empty = document.getElementById('characters-empty');

    list.innerHTML = '';

    if (!characters || characters.length === 0) {
        empty.classList.add('show');
        return;
    }

    empty.classList.remove('show');

    characters.forEach(c => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-name">${c.name}</div>
            <div class="item-detail">Ator: ${c.actor}</div>
        `;
        list.appendChild(card);
    });
}

function renderActors(actors) {
    const list = document.getElementById('actors-list');
    const empty = document.getElementById('actors-empty');

    list.innerHTML = '';

    if (!actors || actors.length === 0) {
        empty.classList.add('show');
        return;
    }

    empty.classList.remove('show');

    actors.forEach(actor => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `<div class="actor-name">${actor.name}</div>`;
        list.appendChild(card);
    });
}

function renderCharacterShips(ships) {
    const list = document.getElementById('character-ships-list');
    const empty = document.getElementById('character-ships-empty');

    list.innerHTML = '';

    if (!ships || ships.length === 0) {
        empty.classList.add('show');
        return;
    }

    empty.classList.remove('show');

    ships.forEach(ship => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-name">${ship.name}</div>
            <div class="ship-characters">${ship.characters}</div>
        `;
        list.appendChild(card);
    });
}

function renderActorShips(ships) {
    const list = document.getElementById('actor-ships-list');
    const empty = document.getElementById('actor-ships-empty');

    list.innerHTML = '';

    if (!ships || ships.length === 0) {
        empty.classList.add('show');
        return;
    }

    empty.classList.remove('show');

    ships.forEach(ship => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-name">${ship.name}</div>
            <div class="ship-actors">${ship.actors}</div>
        `;
        list.appendChild(card);
    });
}