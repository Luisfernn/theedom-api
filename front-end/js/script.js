document.addEventListener('DOMContentLoaded', function () {
    const addBlCard = document.querySelector('.add-bl');
    const viewArchiveCard = document.querySelector('.view-archive');

    addBlCard.addEventListener('click', function () {
        // Vai para a tela de criar novo BL
        window.location.href = 'add-bl.html';
    });

    viewArchiveCard.addEventListener('click', function () {
        // Vai para a lista de BLs existentes
        window.location.href = 'bl-list.html';
    });
});