// ====== BL vindo da URL ======
const urlParams = new URLSearchParams(window.location.search);
const blId = urlParams.get('blId');

if (!blId) {
    alert('BL não informado');
    window.history.back();
}

// Visual temporário
const blName = "Love in the Moonlight";

// Mock de tags (até backend)
const existingTags = [
    { id: 1, name: "Romance" },
    { id: 2, name: "Drama" },
    { id: 3, name: "Fantasia" }
];

let newTagFieldCount = 1;

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    document.getElementById('current-bl').textContent = blName;
    renderExistingTags();

    document
        .getElementById('add-tags-form')
        .addEventListener('submit', handleSubmit);
});

function renderExistingTags() {
    const list = document.getElementById('existing-tags-list');
    list.innerHTML = '';

    existingTags.forEach(tag => {
        const div = document.createElement('div');
        div.className = 'tag-checkbox-item';

        div.innerHTML = `
            <input type="checkbox" value="${tag.id}">
            <label>${tag.name}</label>
        `;

        list.appendChild(div);
    });
}

function addNewTagField() {
    newTagFieldCount++;

    const container = document.getElementById('new-tags-container');
    const div = document.createElement('div');
    div.className = 'new-tag-field';
    div.id = `new-tag-${newTagFieldCount}`;

    div.innerHTML = `
        <input type="text" class="form-input" placeholder="Nome da tag">
        <button type="button" class="remove-tag-button" onclick="removeNewTagField(${newTagFieldCount})">×</button>
    `;

    container.appendChild(div);
}

function removeNewTagField(id) {
    const field = document.getElementById(`new-tag-${id}`);
    if (field) field.remove();
}

function handleSubmit(e) {
    e.preventDefault();

    const selectedTags = [];
    document
        .querySelectorAll('#existing-tags-list input:checked')
        .forEach(cb => selectedTags.push(parseInt(cb.value)));

    const newTags = [];
    document
        .querySelectorAll('#new-tags-container input')
        .forEach(input => {
            if (input.value.trim()) newTags.push(input.value.trim());
        });

    if (selectedTags.length === 0 && newTags.length === 0) {
        showMessage('error', 'Selecione ou crie pelo menos uma tag.');
        return;
    }

    const requestData = {
        blId: blId,
        selectedTags,
        newTags
    };

    console.log('Payload:', requestData);

    showMessage('success', 'Tags vinculadas com sucesso!');
}

function showMessage(type, text) {
    const success = document.getElementById('success-message');
    const error = document.getElementById('error-message');

    success.style.display = 'none';
    error.style.display = 'none';

    const target = type === 'success' ? success : error;
    target.querySelector('.message-text').textContent = text;
    target.style.display = 'flex';

    setTimeout(() => target.style.display = 'none', 5000);
}