document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    const addBlCard = document.querySelector('.add-bl');
    const viewArchiveCard = document.querySelector('.view-archive');

    if (addBlCard) {
        addBlCard.addEventListener('click', function () {
            window.location.href = 'add-bl.html';
        });
    }

    if (viewArchiveCard) {
        viewArchiveCard.addEventListener('click', function () {
            window.location.href = 'bl-list.html';
        });
    }
});