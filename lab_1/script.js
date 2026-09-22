const catalogList = document.getElementById('catalogList');
const favoritesList = document.getElementById('favoritesList');
const emptyHint = document.getElementById('emptyHint');

function updateEmptyHint() {
    const hasFavorites = favoritesList.children.length > 0;
    emptyHint.style.display = hasFavorites ? 'none' : 'block';
}

function addToFavorites(name, sourceButton) {
    const item = document.createElement('li');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Видалити';

    removeBtn.addEventListener('click', () => {
        item.remove();
        updateEmptyHint();
        sourceButton.disabled = false;
        sourceButton.textContent = 'Додати до обраного';
    });

    item.appendChild(nameSpan);
    item.appendChild(removeBtn);
    favoritesList.appendChild(item);

    updateEmptyHint();

    sourceButton.disabled = true;
    sourceButton.textContent = 'Уже в обраному';
}

catalogList.addEventListener('click', (event) => {
    const button = event.target.closest('.add-btn');
    if (!button) return;

    const name = button.dataset.name;
    addToFavorites(name, button);
});

updateEmptyHint();
