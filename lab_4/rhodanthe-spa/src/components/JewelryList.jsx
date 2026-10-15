import JewelryItem from "./JewelryItem.jsx";

function JewelryList({ items, emptyText, onToggle, onDelete }) {
  if (items.length === 0) {
    return <p className="text-center italic text-brand-dark/60">{emptyText}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {items.map((item) => (
        <JewelryItem
          key={item.id}
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default JewelryList;
