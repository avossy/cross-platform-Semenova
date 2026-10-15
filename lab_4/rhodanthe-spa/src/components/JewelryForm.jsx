import { useState } from "react";

const MATERIALS = ["Золото 585", "Золото 750", "Срібло 925"];
const GEMSTONES = [
  "Без каменю",
  "Діамант",
  "Рубін",
  "Сапфір",
  "Смарагд",
  "Топаз",
  "Перли",
];

const fieldClass =
  "w-full rounded-lg border border-sky bg-white px-4 py-3 text-base text-brand-dark focus:outline-2 focus:outline-brand";

function JewelryForm({ onAdd }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [gemstone, setGemstone] = useState(GEMSTONES[0]);
  const [weight, setWeight] = useState("");
  const [size, setSize] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const added = onAdd({
      name,
      description,
      price,
      material,
      gemstone,
      weight,
      size,
    });
    if (added) {
      setName("");
      setDescription("");
      setPrice("");
      setWeight("");
      setSize("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Назва виробу"
        aria-label="Назва виробу"
        className={fieldClass}
      />
      <input
        type="number"
        min="0"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        placeholder="Ціна, грн"
        aria-label="Ціна"
        className={fieldClass}
      />
      <select
        value={material}
        onChange={(event) => setMaterial(event.target.value)}
        aria-label="Матеріал"
        className={fieldClass}
      >
        {MATERIALS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={gemstone}
        onChange={(event) => setGemstone(event.target.value)}
        aria-label="Камінь"
        className={fieldClass}
      >
        {GEMSTONES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        step="0.01"
        value={weight}
        onChange={(event) => setWeight(event.target.value)}
        placeholder="Вага, г"
        aria-label="Вага"
        className={fieldClass}
      />
      <input
        type="text"
        value={size}
        onChange={(event) => setSize(event.target.value)}
        placeholder="Розмір (необов'язково)"
        aria-label="Розмір"
        className={fieldClass}
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Опис виробу"
        aria-label="Опис виробу"
        rows={2}
        className={`${fieldClass} sm:col-span-2 lg:col-span-3`}
      />
      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-brand px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-dark sm:col-span-2 lg:col-span-3"
      >
        Додати
      </button>
    </form>
  );
}

export default JewelryForm;
