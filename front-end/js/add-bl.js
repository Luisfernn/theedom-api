document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    const form = document.getElementById('add-bl-form');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const payload = {
            title: document.getElementById('title').value,
            country: document.getElementById('country').value,
            release_date: document.getElementById('release_date').value,
            episode_number: Number(document.getElementById('episode_number').value),
            genre: document.getElementById('genre').value,
            synopsis: document.getElementById('synopsis').value,
            platform: document.getElementById('platform').value,
            rate: document.getElementById('rate').value !== ''
                ? Number(document.getElementById('rate').value)
                : null,
            status: document.getElementById('status').value || null,
            production_company: document.getElementById('production_company').value || null,
            date_start: document.getElementById('date_start').value || null,
            date_watched: document.getElementById('date_watched').value || null
        };

        try {
            const response = await fetch(`${API_BASE_URL}/series`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Erro ao criar BL');
            }

            const data = await response.json();
            showSuccessModal(data.id);

        } catch (error) {
            alert(error.message);
        }
    });
});

function showSuccessModal(blId) {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'flex';

    document.getElementById('modal-btn-yes').onclick = function () {
        window.location.href = 'add-actor-to-bl.html?blId=' + blId + '&flow=create';
    };
    document.getElementById('modal-btn-no').onclick = function () {
        window.location.href = 'bl-details.html?blId=' + blId;
    };
}