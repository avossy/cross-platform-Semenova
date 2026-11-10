const api = window.jewelryAPI;

const jewelryNameInput = document.getElementById("jewelryNameInput");
const jewelryPriceInput = document.getElementById("jewelryPriceInput");
const materialSelect = document.getElementById("materialSelect");
const gemstoneSelect = document.getElementById("gemstoneSelect");
const jewelryWeightInput = document.getElementById("jewelryWeightInput");
const jewelrySizeInput = document.getElementById("jewelrySizeInput");
const jewelryDescriptionInput = document.getElementById("jewelryDescriptionInput");
const addJewelryButton = document.getElementById("addJewelryButton");
const searchInput = document.getElementById("searchInput");
const jewelryList = document.getElementById("jewelryList");
const favoritesList = document.getElementById("favoritesList");
const emptyHint = document.getElementById("emptyHint");
const message = document.getElementById("message");

const COLOR_ERROR = "#ef4444";
const COLOR_SUCCESS = "#16a34a";

let messageTimeout;

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        message.textContent = "";
    }, 2000);
}

function createSpan(className, text) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
}

function createButton(className, text, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
}

// Блок з даними виробу; у списку обраного показуємо скорочену версію
function createInfo(item, { compact = false } = {}) {
    const info = document.createElement("div");
    info.className = "jewelry-info";

    info.appendChild(createSpan("jewelry-title", item.name));

    if (!compact && item.description) {
        info.appendChild(createSpan("jewelry-description", item.description));
    }

    const details = `${item.material} · ${item.gemstone} · ${item.weight}\u00A0г`
        + (item.size ? ` · розмір\u00A0${item.size}` : "");
    info.appendChild(createSpan("jewelry-details", details));

    info.appendChild(createSpan("jewelry-price", `${item.price.toLocaleString("uk-UA")} ₴`));

    if (!compact && item.dateLabel) {
        info.appendChild(createSpan("jewelry-date", `Додано: ${item.dateLabel}`));
    }

    return info;
}

function renderCatalog(items) {
    jewelryList.innerHTML = "";

    if (items.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-message";
        emptyItem.textContent = searchInput.value.trim()
            ? "Нічого не знайдено за вашим запитом."
            : "Виробів поки немає. Додайте перший!";
        jewelryList.appendChild(emptyItem);
        return;
    }

    items.forEach((item) => {
        const jewelryItem = document.createElement("li");
        jewelryItem.className = "jewelry-item";

        const actions = document.createElement("div");
        actions.className = "jewelry-actions";
        actions.appendChild(
            createButton(
                item.favorite ? "favorite-button is-active" : "favorite-button",
                item.favorite ? "Прибрати з обраного" : "Додати до обраного",
                () => handleToggleFavorite(item.id)
            )
        );
        actions.appendChild(createButton("delete-button", "Видалити", () => handleRemove(item.id)));

        jewelryItem.appendChild(createInfo(item));
        jewelryItem.appendChild(actions);
        jewelryList.appendChild(jewelryItem);
    });
}

function renderFavorites(items) {
    favoritesList.innerHTML = "";
    emptyHint.hidden = items.length > 0;

    items.forEach((item) => {
        const favoriteItem = document.createElement("li");
        favoriteItem.className = "jewelry-item";

        const actions = document.createElement("div");
        actions.className = "jewelry-actions";
        actions.appendChild(
            createButton("favorite-button is-active", "Прибрати з обраного", () => handleToggleFavorite(item.id))
        );

        favoriteItem.appendChild(createInfo(item, { compact: true }));
        favoriteItem.appendChild(actions);
        favoritesList.appendChild(favoriteItem);
    });
}

// перемальовує каталог (з урахуванням пошуку) та список обраного
async function refresh() {
    try {
        renderCatalog(await api.list(searchInput.value));
        renderFavorites(await api.listFavorites());
    } catch (error) {
        showMessage("Не вдалося завантажити вироби.", COLOR_ERROR);
    }
}

async function handleAdd() {
    const result = await api.add({
        name: jewelryNameInput.value,
        price: jewelryPriceInput.value,
        material: materialSelect.value,
        gemstone: gemstoneSelect.value,
        weight: jewelryWeightInput.value,
        size: jewelrySizeInput.value,
        description: jewelryDescriptionInput.value,
    });

    if (!result.ok) {
        showMessage(result.error, COLOR_ERROR);
        return;
    }

    jewelryNameInput.value = "";
    jewelryPriceInput.value = "";
    jewelryWeightInput.value = "";
    jewelrySizeInput.value = "";
    jewelryDescriptionInput.value = "";

    await refresh();
    showMessage("Виріб успішно додано та збережено.", COLOR_SUCCESS);
}

async function handleRemove(id) {
    const result = await api.remove(id);

    if (!result.ok) {
        showMessage(result.error, COLOR_ERROR);
        return;
    }

    await refresh();
    showMessage("Виріб видалено з каталогу.", COLOR_ERROR);
}

async function handleToggleFavorite(id) {
    const result = await api.toggleFavorite(id);

    if (!result.ok) {
        showMessage(result.error, COLOR_ERROR);
        return;
    }

    await refresh();
    showMessage(
        result.item.favorite ? "Виріб додано до обраного." : "Виріб прибрано з обраного.",
        COLOR_SUCCESS
    );
}

addJewelryButton.addEventListener("click", handleAdd);

[jewelryNameInput, jewelryPriceInput, jewelryWeightInput, jewelrySizeInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleAdd();
        }
    });
});

searchInput.addEventListener("input", refresh);

refresh();
