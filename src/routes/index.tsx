import {createFileRoute} from '@tanstack/react-router';
import styles from './index.module.css';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className={styles.homepage}>
      <div style={{ marginTop: '6rem', marginBottom: '2rem' }}>
        <h1>Willkommen bei Cardgourmet!</h1>
      </div>

      <div className={styles.homePageGrid}>
        <div className={styles.homePageGridItem} style={{ gridArea: 'box-1' }}>
          <h2>Eine Kartendatenbank für mehrere TCGs</h2>
          <p>Nutze die Suchleiste oben, um zu starten.</p>
        </div>
        <div className={styles.homePageGridItem} style={{ gridArea: 'box-2' }}>
          <h2>Eine eigene API für alle Entwickler:innen</h2>
          <p>
            Gehe dazu einfach auf unsere Dokumentationsseite{' '}
            <a href={'https://dev.cardgourmet.com'}>dev.cardgourmet.com</a>
          </p>
        </div>
        <div className={styles.homePageGridItem} style={{ gridArea: 'box-3' }}>
          <h2>Fragen oder Probleme?</h2>
          <p>
            Wir sind immer offen für alle Anliegen. <br />
            Tritt dafür gerne unseren Discord bei oder schicke uns eine Email.
          </p>
        </div>
        <div className={styles.homePageGridItem} style={{ gridArea: 'box-4' }}>
          <h2>
            Wir befinden uns in einer <code>[BETA]</code>
          </h2>
          <p>
            Es ist also zu erwarten, dass sich Fehler und Inkonsistenzen eingeschlichen haben. Falls Du irgendeinen
            Fehler siehst, melde ihn uns gerne über unseren Discord oder per Email.
          </p>
        </div>
      </div>
    </div>
  );
}
