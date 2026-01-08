import { createFileRoute } from '@tanstack/react-router';
import styles from './index.module.css';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className={styles.homepage}>
      <div style={{ marginTop: '3rem' }}>
        <h1>Willkommen bei Cardgourmet!</h1>
      </div>

      <div className={styles.homePageGrid}>
        <div className={styles.homePageGridItem} style={{ gridArea: 'box-1' }}>
          <h2>Wir bieten eine Kartendatenbank für mehrere TCGs an</h2>
          <p>Nutze die Suchleiste oben, um zu starten.</p>
        </div>
        <div className={styles.homePageGridItem} style={{ gridArea: 'box-2' }}>
          <h2>Wir haben auch eine eigene API, für alle Entwickler:innen</h2>
          <p>Gehe dazu einfach auf unsere Dokumentationsseite dev.cardgourmet.com</p>
        </div>
        <div className={styles.homePageGridItem} style={{ gridArea: 'box-3' }}>
          <h2>Fragen oder Probleme?</h2>
          <p>Tritt unseren Discord bei oder schicke uns eine Email</p>
        </div>
        <div className={styles.homePageGridItem} style={{ gridArea: 'box-4' }}>
          <h2>Wir befinden uns in einer [BETA], also Fehler und Inkonsistenzen sind zu erwarten</h2>
        </div>
      </div>
    </div>
  );
}

export default Home;
