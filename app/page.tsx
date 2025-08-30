// Aggiunta della barra di ricerca e della sezione hero
import React from 'react';

const HomePage = () => {
  return (
    <div>
      <header>
        <h1>Diveplunge</h1>
        <p>Scopri i migliori spot subacquei.</p>
        <button>Aggiungi il tuo spot</button>
      </header>
      <input type='text' placeholder='Cerca...' />
    </div>
  );
};

export default HomePage;