let searchTimeout = null;

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    loadFilters();
    loadBls();

    document.getElementById('search-input').addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadBls(), 300);
    });

    document.getElementById('filter-country').addEventListener('change', loadBls);
    document.getElementById('filter-status').addEventListener('change', loadBls);
    document.getElementById('filter-year').addEventListener('change', loadBls);
});

async function loadFilters() {
    try {
        const response = await fetch(`${API_BASE_URL}/series/filters`);
        if (!response.ok) return;

        const filters = await response.json();

        const countrySelect = document.getElementById('filter-country');
        filters.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });

        const statusSelect = document.getElementById('filter-status');
        filters.statuses.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            statusSelect.appendChild(option);
        });

        const yearSelect = document.getElementById('filter-year');
        filters.years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar filtros:', error);
    }
}

async function loadBls() {
    try {
        const params = new URLSearchParams();

        const search = document.getElementById('search-input').value.trim();
        const country = document.getElementById('filter-country').value;
        const status = document.getElementById('filter-status').value;
        const year = document.getElementById('filter-year').value;

        if (search) params.append('search', search);
        if (country) params.append('country', country);
        if (status) params.append('status', status);
        if (year) params.append('year', year);

        const url = params.toString()
            ? `${API_BASE_URL}/series?${params}`
            : `${API_BASE_URL}/series`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar BLs');
        }

        const data = await response.json();
        renderBlList(data);

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

    const year = bl.release_date ? bl.release_date.substring(0, 4) : '-';

    card.innerHTML = `
        <div class="bl-info">
            <div class="bl-title">${bl.title}</div>
            <div class="bl-meta">
                <div class="bl-meta-item">
                    <span>País:</span> ${bl.country ?? '-'}
                </div>
                <div class="bl-meta-item">
                    <span>Ano:</span> ${year}
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
