import { createFileRoute } from '@tanstack/react-router';
import styles from './index.module.css';

export const Route = createFileRoute('/imprint/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={styles.body}>
      <title>{`Imprint – Cardgourmet`}</title>

      <h1>Impressum</h1>
      <h2>Angaben gemäß §5 TMG</h2>

      <address>
        <p>
          Tobias Büser
          <br />
          Gerbersruhstr. 154
          <br />
          69168 Wiesloch
          <br />
          Germany
        </p>

        <p>
          E-Mail-Adresse: <a href="mailto:contact@cowzy.dev">contact@cowzy.dev</a>
        </p>
      </address>

      <h2>Redaktionell verantwortlich</h2>
      <p>Tobias Büser</p>

      <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>DE365945908</p>
    </div>
  );
}
