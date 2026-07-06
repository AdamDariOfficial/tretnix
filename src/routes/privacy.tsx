import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Tretnix" },
      { name: "description", content: "Informativa sul trattamento dei dati personali del sito Tretnix." },
      { property: "og:title", content: "Privacy Policy — Tretnix" },
      { property: "og:description", content: "Informativa sul trattamento dei dati personali del sito Tretnix." },
      { property: "og:url", content: "https://tretnix.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://tretnix.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Informativa sul trattamento dei dati personali del sito Tretnix."
      intro="Tretnix raccoglie solo i dati necessari a rispondere alle richieste ricevute e a monitorare in forma completamente anonima l'utilizzo del sito. Non usiamo cookie, non profiliamo gli utenti, non condividiamo dati con circuiti pubblicitari."
    >
      <LegalSection n={1} title="Titolare del trattamento">
        <p>Il titolare del trattamento è Tretnix Studio.</p>
        <p>
          <strong className="text-foreground">Tretnix Studio</strong>
          <br />Padova, Italia
          <br />Email: hello@tretnix.com
        </p>
      </LegalSection>

      <LegalSection n={2} title="Analytics anonime di prima parte">
        <p>
          Il sito utilizza un sistema di analytics interno, di prima parte, progettato per rispettare
          la privacy degli utenti. Registriamo solo eventi anonimi come:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>visualizzazione di una pagina (page_view);</li>
          <li>clic sui pulsanti di contatto (cta_click, email_click, phone_click);</li>
          <li>apertura di un case study (case_study_view);</li>
          <li>clic su una card progetto (project_card_click).</li>
        </ul>
        <p>Per ogni evento salviamo solo: tipo di evento, percorso della pagina, tipo di device
          (mobile/tablet/desktop), larghezza della finestra e host del referrer se proviene da un
          altro dominio. <strong className="text-foreground">Non usiamo cookie, non generiamo un ID
          persistente del visitatore, non registriamo l'indirizzo IP né lo user agent completo.</strong>
          Non è possibile ricostruire il comportamento di un singolo utente.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Modulo di contatto">
        <p>
          Quando invii una richiesta tramite il modulo di contatto raccogliamo solo i dati che ci
          servono per risponderti:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>nome e cognome, email;</li>
          <li>telefono e nome dell'attività (opzionali);</li>
          <li>tipo di esigenza e punto di partenza indicati nel modulo;</li>
          <li>il messaggio che ci invii.</li>
        </ul>
        <p>
          Questi dati vengono utilizzati <strong className="text-foreground">esclusivamente per
          rispondere alla tua richiesta</strong> e gestire la comunicazione preliminare di
          progetto. Non vengono usati per newsletter, profilazione o comunicazioni commerciali non
          richieste, e non vengono condivisi con terze parti a fini di marketing.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Tipologie di dati raccolti">
        <p>Attraverso questo sito possono essere trattati:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>dati di navigazione tecnici;</li>
          <li>dati forniti volontariamente tramite email o richiesta di contatto;</li>
          <li>eventuali dati necessari alla gestione di una richiesta commerciale;</li>
          <li>eventuali dati raccolti da strumenti tecnici o analitici, se attivati.</li>
        </ul>
      </LegalSection>

      <LegalSection n={3} title="Finalità del trattamento">
        <p>I dati possono essere trattati per:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>rispondere alle richieste inviate dall'utente;</li>
          <li>fornire informazioni sui servizi Tretnix;</li>
          <li>gestire comunicazioni preliminari relative a potenziali progetti;</li>
          <li>garantire il corretto funzionamento tecnico del sito;</li>
          <li>analizzare in forma aggregata l'utilizzo del sito, solo se saranno attivati strumenti di analytics.</li>
        </ul>
      </LegalSection>

      <LegalSection n={4} title="Base giuridica">
        <p>Il trattamento può basarsi su:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>esecuzione di misure precontrattuali richieste dall'utente;</li>
          <li>legittimo interesse al corretto funzionamento e alla sicurezza del sito;</li>
          <li>consenso dell'utente, quando richiesto per strumenti non tecnici o attività di tracciamento;</li>
          <li>obblighi di legge, se applicabili.</li>
        </ul>
      </LegalSection>

      <LegalSection n={5} title="Modalità del trattamento">
        <p>
          I dati sono trattati con strumenti informatici e organizzativi adeguati, secondo principi
          di correttezza, minimizzazione, sicurezza e riservatezza.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Conservazione dei dati">
        <p>
          I dati forniti tramite richiesta di contatto saranno conservati per il tempo necessario a
          rispondere e gestire la comunicazione commerciale preliminare. Eventuali tempi specifici
          potranno essere aggiornati in base agli strumenti effettivamente utilizzati.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Comunicazione a terzi">
        <p>
          I dati potranno essere trattati da fornitori tecnici necessari al funzionamento del sito,
          come servizi di hosting, email, piattaforme di sviluppo, analytics o strumenti di gestione
          del consenso, se attivati.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Trasferimenti extra UE">
        <p>
          Alcuni fornitori tecnici potrebbero trattare dati al di fuori dello Spazio Economico
          Europeo. In tal caso, saranno adottate garanzie adeguate secondo la normativa applicabile.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Diritti dell'utente">
        <p>
          L'utente può richiedere accesso, rettifica, cancellazione, limitazione, opposizione al
          trattamento e portabilità dei dati, nei casi previsti dalla normativa applicabile.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Contatti">
        <p>
          Per richieste relative alla privacy:
          <br />
          <a href="mailto:hello@tretnix.com" className="text-primary-glow hover:underline">
            hello@tretnix.com
          </a>
        </p>
      </LegalSection>

      <LegalSection n={11} title="Aggiornamenti">
        <p>
          Questa informativa potrà essere modificata nel tempo in base all'evoluzione del sito,
          dei servizi offerti e degli strumenti utilizzati.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
