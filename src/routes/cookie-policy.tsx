import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Tretnix" },
      { name: "description", content: "Informazioni sull'uso di cookie e strumenti simili nel sito Tretnix." },
      { property: "og:title", content: "Cookie Policy — Tretnix" },
      { property: "og:description", content: "Informazioni sull'uso di cookie e strumenti simili nel sito Tretnix." },
      { property: "og:url", content: "https://tretnix.lovable.app/cookie-policy" },
    ],
    links: [{ rel: "canonical", href: "https://tretnix.lovable.app/cookie-policy" }],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      subtitle="Informazioni sull'uso di cookie e strumenti simili nel sito Tretnix."
      intro="Questa Cookie Policy è una bozza iniziale e dovrà essere aggiornata in base agli strumenti effettivamente installati sul sito, come analytics, pixel, mappe, video embed, chat o strumenti di consenso."
    >
      <LegalSection n={1} title="Cosa sono i cookie">
        <p>
          I cookie sono piccoli file di testo che i siti possono salvare sul dispositivo dell'utente
          per permettere il funzionamento tecnico del sito, migliorare l'esperienza di navigazione
          o, se presenti, raccogliere informazioni statistiche o di marketing.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Tipologie di cookie">
        <p>Il sito può utilizzare o potrà utilizzare:</p>
        <div>
          <h3 className="font-serif text-lg text-foreground">Cookie tecnici</h3>
          <p>Necessari per il corretto funzionamento del sito. Non richiedono consenso preventivo.</p>
        </div>
        <div>
          <h3 className="font-serif text-lg text-foreground">Cookie analitici</h3>
          <p>
            Utilizzati per comprendere in forma aggregata come viene visitato il sito. Se non
            anonimizzati o se combinati con altri dati, potrebbero richiedere consenso.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-lg text-foreground">Cookie di profilazione o marketing</h3>
          <p>
            Utilizzati per finalità pubblicitarie, remarketing o tracciamento dell'utente.
            Richiedono consenso preventivo.
          </p>
        </div>
      </LegalSection>

      <LegalSection n={3} title="Cookie attualmente previsti">
        <p>
          Al momento, il sito Tretnix è pensato come landing page informativa e potrebbe utilizzare
          solo strumenti tecnici necessari al funzionamento della pagina.
        </p>
        <p className="text-sm text-subtle">
          Nessun cookie di profilazione dichiarato in questa fase.
        </p>
        <p className="text-sm text-subtle">
          Aggiungere qui la lista completa degli strumenti effettivamente installati prima della
          pubblicazione definitiva.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Gestione del consenso">
        <p>
          Se in futuro saranno installati cookie non tecnici o strumenti di tracciamento, il sito
          dovrà mostrare un banner di consenso che permetta all'utente di accettare, rifiutare o
          gestire le preferenze.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Gestione tramite browser">
        <p>
          L'utente può gestire o eliminare i cookie anche attraverso le impostazioni del proprio
          browser. La disattivazione di alcuni cookie tecnici potrebbe compromettere il corretto
          funzionamento del sito.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Strumenti di terze parti">
        <p>
          Eventuali strumenti di terze parti, come analytics, mappe, video embed, form, chat o
          pixel pubblicitari, saranno indicati in questa sezione se e quando saranno attivati.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Aggiornamenti">
        <p>
          Questa Cookie Policy potrà essere aggiornata in base agli strumenti effettivamente
          utilizzati sul sito.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
