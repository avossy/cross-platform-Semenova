import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import JewelryForm from "./components/JewelryForm.jsx";
import JewelryList from "./components/JewelryList.jsx";

const STORAGE_KEY = "jewelry-rhodanthe";

function loadItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [items, setItems] = useState(loadItems);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  function addItem(data) {
    const name = data.name.trim();
    const description = data.description.trim();
    const size = data.size.trim();

    if (!name) {
      setMessage({ text: "Введіть назву виробу.", type: "error" });
      return false;
    }
    if (!data.price || Number(data.price) <= 0) {
      setMessage({ text: "Введіть коректну ціну.", type: "error" });
      return false;
    }
    if (!data.weight || Number(data.weight) <= 0) {
      setMessage({ text: "Введіть коректну вагу.", type: "error" });
      return false;
    }

    const newItem = {
      id: Date.now(),
      name,
      description,
      price: Number(data.price),
      material: data.material,
      gemstone: data.gemstone,
      weight: Number(data.weight),
      size,
      sold: false,
    };

    setItems([...items, newItem]);
    setMessage({ text: "Виріб додано.", type: "success" });
    return true;
  }

  function toggleItem(id) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, sold: !item.sold } : item,
      ),
    );
  }

  function deleteItem(id) {
    setItems(items.filter((item) => item.id !== id));
    setMessage({ text: "Виріб видалено.", type: "success" });
  }

  const soldCount = items.filter((item) => item.sold).length;

  const query = search.trim().toLowerCase();
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.material.toLowerCase().includes(query) ||
      item.gemstone.toLowerCase().includes(query),
  );

  const emptyText = query
    ? "Нічого не знайдено за вашим запитом."
    : "Виробів поки немає. Додайте перший!";

  return (
    <div className="min-h-screen bg-sand px-4 py-8 text-brand-dark">
      <main className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg md:max-w-4xl lg:max-w-6xl lg:p-10">
        <Header total={items.length} sold={soldCount} />
        <JewelryForm onAdd={addItem} />

        {message && (
          <p
            className={
              message.type === "error"
                ? "mb-4 font-bold text-rose-600"
                : "mb-4 font-bold text-emerald-700"
            }
          >
            {message.text}
          </p>
        )}

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Пошук за назвою, матеріалом чи каменем"
          aria-label="Пошук виробу"
          className="mb-4 w-full rounded-lg border border-sky bg-white px-4 py-3 text-base text-brand-dark focus:outline-2 focus:outline-brand"
        />

        <JewelryList
          items={filteredItems}
          emptyText={emptyText}
          onToggle={toggleItem}
          onDelete={deleteItem}
        />
      </main>
    </div>
  );
}

export default App;
