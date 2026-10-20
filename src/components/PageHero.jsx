export default function PageHero({ eyebrow, title, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow eyebrow--light reveal-line"><span>{eyebrow}</span></p>
        <h1 className="page-hero__title reveal-line" style={{ "--d": "0.12s" }}>
          <span>{title}</span>
        </h1>
        {children && <div className="page-hero__sub reveal-line" style={{ "--d": "0.26s" }}><div>{children}</div></div>}
      </div>
    </section>
  );
}
