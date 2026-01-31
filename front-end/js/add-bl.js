document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    const form = document.getElementById('add-bl-form');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const payload = {
            title: document.getElementById('title').value,
            country: document.getElementById('country').value || null,
            release_date: document.getElementById('release_date').value || null,
            genre: document.getElementById('genre').value || null,
            synopsis: document.getElementById('synopsis').value || null,
            platform: document.getElementById('platform').value || null,
            rate: document.getElementById('rate').value
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
            alert('BL criado com sucesso! 🌙');
            window.location.href = 'bl-details.html?blId=' + data.id;

        } catch (error) {
            alert(error.message);
        }
    });
});