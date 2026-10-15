function JewelryItem({ item, onToggle, onDelete }) {
  const itemClass = item.sold
    ? "flex items-center justify-between gap-3 rounded-lg bg-sand p-4 transition-colors max-sm:flex-col max-sm:items-stretch"
    : "flex items-center justify-between gap-3 rounded-lg bg-sky/25 p-4 transition-colors max-sm:flex-col max-sm:items-stretch";

  const nameClass = item.sold
    ? "font-bold break-words text-brand-dark/50 line-through"
    : "font-bold break-words text-brand-dark";

  return (
    <li className={itemClass}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={nameClass}>{item.name}</span>
        {item.description && (
          <span className="text-sm wrap-break-word text-brand-dark/70">
            {item.description}
          </span>
        )}
        <span className="text-sm text-brand-dark/80">
          {item.material} · {item.gemstone} · {item.weight} г
          {item.size && ` · розмір ${item.size}`}
        </span>
        <span className="font-bold text-brand">{item.price} грн</span>
        <label className="mt-1 flex cursor-pointer items-center gap-2.5 text-sm text-brand-dark">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer accent-brand"
            checked={item.sold}
            onChange={() => onToggle(item.id)}
          />
          Продано
        </label>
      </div>
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="cursor-pointer rounded-lg bg-rose-500 px-3.5 py-2 font-bold text-white transition-colors hover:bg-rose-700"
      >
        Видалити
      </button>
    </li>
  );
}

export default JewelryItem;
