// Dados de exemplo do BL (virão do backend em JSON)
const bl_data = {
    id: 1,
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
    synopsis: "Uma história romântica envolvente que se passa sob a luz do luar, onde dois jovens descobrem o amor enquanto enfrentam desafios pessoais e sociais. A narrativa explora temas de identidade, aceitação e a coragem de seguir o coração.",
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

document.addEventListener('DOMContentLoaded', function () {
    load_bl_details();
});

function load_bl_details() {
    // Informações principais
    document.getElementById('bl-title').textContent = bl_data.title;
    document.getElementById('country').textContent = bl_data.country;
    document.getElementById('release_date').textContent = bl_data.release_date;
    document.getElementById('genre').textContent = bl_data.genre;
    document.getElementById('platform').textContent = bl_data.platform;
    document.getElementById('status').textContent = bl_data.status;
    document.getElementById('rating').textContent = bl_data.rating;
    document.getElementById('producer').textContent = bl_data.producer;
    document.getElementById('start_date').textContent = bl_data.start_date;
    document.getElementById('end_date').textContent = bl_data.end_date;
    document.getElementById('synopsis').textContent = bl_data.synopsis;

    render_characters(bl_data.characters);
    render_actors(bl_data.actors);
    render_character_ships(bl_data.character_ships);
    render_actor_ships(bl_data.actor_ships);
}

function render_characters(characters) {
    const list = document.getElementById('characters-list');
    const empty = document.getElementById('characters-empty');

    list.innerHTML = '';

    if (!characters || characters.length === 0) {
        empty.classList.add('show');
        return;
    }

    empty.classList.remove('show');

    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-name">${character.name}</div>
            <div class="item-detail">Ator: ${character.actor}</div>
        `;
        list.appendChild(card);
    });
}

function render_actors(actors) {
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
        card.innerHTML = `
            <div class="actor-name">${actor.name}</div>
        `;
        list.appendChild(card);
    });
}

function render_character_ships(ships) {
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

function render_actor_ships(ships) {
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

// Ações futuras
function linkCharacter() {
    alert('Abrir modal/tela para vincular personagem');
}

function linkActor() {
    alert('Abrir modal/tela para vincular ator');
}

function linkCharacterShip() {
    alert('Abrir modal/tela para vincular ship de personagens');
}

function linkActorShip() {
    alert('Abrir modal/tela para vincular ship de atores');
}