const jewelryNameInput = document.getElementById("jewelryNameInput");
const jewelryPriceInput = document.getElementById("jewelryPriceInput");
const materialSelect = document.getElementById("materialSelect");
const gemstoneSelect = document.getElementById("gemstoneSelect");
const jewelryWeightInput = document.getElementById("jewelryWeightInput");
const jewelrySizeInput = document.getElementById("jewelrySizeInput");
const jewelryDescriptionInput = document.getElementById("jewelryDescriptionInput");
const addJewelryButton = document.getElementById("addJewelryButton");
const jewelryList = document.getElementById("jewelryList");
const message = document.getElementById("message");

let jewelry = [];
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

function renderJewelry() {
    jewelryList.innerHTML = "";

    if (jewelry.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-message";
        emptyItem.textContent = "Виробів поки немає. Додайте перший!";
        jewelryList.appendChild(emptyItem);
        return;
    }

    jewelry.forEach((item) => {
        const jewelryItem = document.createElement("li");
        jewelryItem.className = "jewelry-item";

        const infoDiv = document.createElement("div");
        infoDiv.className = "jewelry-info";

        infoDiv.appendChild(createSpan("jewelry-title", item.name));

        if (item.description) {
            infoDiv.appendChild(createSpan("jewelry-description", item.description));
        }

        const detailsSpan = document.createElement("span");
        detailsSpan.className = "jewelry-details";
        detailsSpan.textContent = `${item.material} · ${item.gemstone} · ${item.weight} г`;
        if (item.size) {
            detailsSpan.textContent += ` · розмір ${item.size}`;
        }

        const priceSpan = document.createElement("span");
        priceSpan.className = "jewelry-price";
        priceSpan.textContent = `${item.price} грн`;

        infoDiv.appendChild(detailsSpan);
        infoDiv.appendChild(priceSpan);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Видалити";

        deleteButton.addEventListener("click", async () => {
            jewelry = jewelry.filter((element) => element.id !== item.id);
            renderJewelry();
            await window.jewelryAPI.saveJewelry(jewelry);
            showMessage("Виріб видалено з каталогу.", "#ef4444");
        });

        jewelryItem.appendChild(infoDiv);
        jewelryItem.appendChild(deleteButton);
        jewelryList.appendChild(jewelryItem);
    });
}

async function addJewelry() {
    const name = jewelryNameInput.value.trim();
    const description = jewelryDescriptionInput.value.trim();
    const size = jewelrySizeInput.value.trim();
    const price = Number(jewelryPriceInput.value.trim());
    const weight = Number(jewelryWeightInput.value.trim());

    if (name === "") {
        showMessage("Будь ласка, введіть назву виробу.", "#ef4444");
        return;
    }
    if (!Number.isFinite(price) || price <= 0) {
        showMessage("Будь ласка, введіть коректну ціну.", "#ef4444");
        return;
    }
    if (!Number.isFinite(weight) || weight <= 0) {
        showMessage("Будь ласка, введіть коректну вагу.", "#ef4444");
        return;
    }

    jewelry.push({
        id: Date.now(),
        name,
        description,
        price,
        material: materialSelect.value,
        gemstone: gemstoneSelect.value,
        weight,
        size
    });

    jewelryNameInput.value = "";
    jewelryPriceInput.value = "";
    jewelryWeightInput.value = "";
    jewelrySizeInput.value = "";
    jewelryDescriptionInput.value = "";

    renderJewelry();

    await window.jewelryAPI.saveJewelry(jewelry);
    showMessage("Виріб успішно додано та збережено у файл.", "#16a34a");
}

addJewelryButton.addEventListener("click", addJewelry);

[jewelryNameInput, jewelryPriceInput, jewelryWeightInput, jewelrySizeInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addJewelry();
        }
    });
});

window.addEventListener("DOMContentLoaded", async () => {
    try {
        jewelry = (await window.jewelryAPI.loadJewelry()) || [];
    } catch (error) {
        showMessage("Не вдалося завантажити вироби з файлу.", "#ef4444");
    }
    renderJewelry();
});
