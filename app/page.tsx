export default function Home() {
  return (
    <div style={{ maxWidth: 920, margin: "40px auto", padding: "0 16px" }}>
      <section style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Diveplunge</h1>
        <p style={{ marginTop: 8 }}>Scopri i migliori spot per immersioni.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button>Aggiungi il tuo spot</button>
          <input type="text" placeholder="Cerca..." />
        </div>
      </section>
    </div>
  );
}
