let allBls = [];
let currentBls = [];

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    const searchInput = document.getElementById('search-input');

    loadBls();

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === '') {
            currentBls = [...allBls];
        } else {
            currentBls = allBls.filter(bl =>
                bl.title.toLowerCase().includes(searchTerm)
            );
        }

        renderBlList(currentBls);
    });
});

async function loadBls() {
    try {
        const response = await fetch(`${API_BASE_URL}/series`);

        if (!response.ok) {
            throw new Error('Erro ao buscar BLs');
        }

        const data = await response.json();

        allBls = data;
        currentBls = [...allBls];

        renderBlList(currentBls);

    } catch (error) {
        console.error(error);
        renderBlList([]);
    }
}

function renderBlList(bls) {
    const blList = document.getElementById('bl-list');
    const emptyState = document.getElementById('empty-state');

    blList.innerHTML = '';

    if (bls.length === 0) {
        blList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    blList.style.display = 'flex';
    emptyState.style.display = 'none';

    bls.forEach(bl => {
        const blCard = createBlCard(bl);
        blList.appendChild(blCard);
    });
}

function createBlCard(bl) {
    const card = document.createElement('div');
    card.className = 'bl-card';
    card.onclick = () => goToBlDetails(bl.id);

    const statusClass =
        bl.status === 'Completed'
            ? 'status-completed'
            : 'status-dropped';

    card.innerHTML = `
        <div class="bl-info">
            <div class="bl-title">${bl.title}</div>
            <div class="bl-meta">
                <div class="bl-meta-item">
                    <span>País:</span> ${bl.country ?? '-'}
                </div>
                <div class="bl-meta-item">
                    <span>Ano:</span> ${bl.release_date ?? '-'}
                </div>
            </div>
        </div>
        <div class="bl-status">
            <span class="status-badge ${statusClass}">
                ${bl.status}
            </span>
            <span class="bl-arrow">→</span>
        </div>
    `;

    return card;
}

function goToBlDetails(blId) {
    window.location.href = `bl-details.html?blId=${blId}`;
}