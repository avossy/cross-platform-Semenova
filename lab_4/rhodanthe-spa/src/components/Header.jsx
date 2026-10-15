function Header({ total, sold }) {
  return (
    <header className="mb-6">
      <h1 className="mb-2 text-center font-header text-5xl text-brand md:text-6xl"> rhodanthe </h1>
      <p className="mb-5 text-center text-brand-dark font-style: italic" > Усього виробів: {total} · Продано: {sold} </p>
    </header>
  );
}

export default Header;
