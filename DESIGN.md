---
version: alpha
name: "Tretnix — Studio di Precisione"
description: "Sistema visivo Tretnix: precisione misurata, profondità selettiva e identità boutique."
colors:
  # Approved external brand asset — logo-master.pdf, not currently versioned in this repository.
  brand-blue: "#054BFF"
  brand-navy: "#000F28"
  brand-near-black: "#0A0F19"
  brand-off-white: "#F5F7F9"

  # Confirmed implementation evidence — current website tokens in src/styles.css.
  surface-canvas: "#020814"
  surface-structural: "#061326"
  surface-deep: "#030B1A"
  interactive-primary: "#0B63FF"
  interactive-highlight: "#1E7BFF"
  text-primary: "#F5F7FA"
  text-muted: "#9AA7B8"
  text-subtle: "#74849C"
  surface-glass: "rgba(8, 16, 34, 0.56)"
typography:
  display-desktop:
    fontFamily: '"Instrument Serif", "Cormorant Garamond", ui-serif, Georgia, serif'
    fontSize: "72px"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  section-heading-desktop:
    fontFamily: '"Instrument Serif", "Cormorant Garamond", ui-serif, Georgia, serif'
    fontSize: "56px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif'
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
    fontFeature: '"ss01", "cv11"'
  body:
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: '"ss01", "cv11"'
  body-large:
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif'
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: '"ss01", "cv11"'
  control:
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.9rem"
    fontWeight: 500
    lineHeight: 1.5
    fontFeature: '"ss01", "cv11"'
  section-label:
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.22em"
    fontFeature: '"ss01", "cv11"'
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  3xl: "24px"
  full: "999px"
components:
  # Confirmed implementation evidence — current Tretnix public and operational patterns.
  button-primary:
    backgroundColor: "{colors.interactive-primary}"
    textColor: "{colors.text-primary}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0.85rem 1.5rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0.85rem 1.5rem"
  glass-card:
    backgroundColor: "rgba(8, 16, 34, 0.42)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "28px"
  glass-navigation:
    backgroundColor: "rgba(8, 16, 34, 0.52)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    height: "62px"
    padding: "0 8px 0 20px"
  section-label:
    backgroundColor: "transparent"
    textColor: "{colors.interactive-highlight}"
    typography: "{typography.section-label}"
  admin-input:
    backgroundColor: "rgba(8, 16, 34, 0.5)"
    textColor: "{colors.text-primary}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0.65rem 0.85rem"
  selection-chip:
    backgroundColor: "rgba(11, 99, 255, 0.2)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "0.375rem 0.75rem"
---

# Design System: Tretnix

## Overview

**Creative North Star: "Studio di Precisione"**

**Approved design decision.** La North Star è stata approvata dal proprietario per questo sistema.

**Approved design decision.** Tretnix deve apparire come uno studio software boutique in cui ogni decisione è intenzionale, controllata e costruita intorno al cliente. La precisione comunica competenza tecnica, controllo, affidabilità, cura sartoriale, qualità premium, chiarezza, essenzialità e responsabilità diretta.

**Approved design decision.** La precisione non deve produrre un'interfaccia fredda, sterile o aziendale. Eleganza, profondità selettiva, chiarezza e personalità accompagnano il rigore tecnico. La voce visiva e verbale è elegante e misurata, con autorevolezza tecnica: precisa senza rigidità, premium senza ostentazione, editoriale solo quando rafforza gerarchia e carattere.

**Approved design decision.** Questo documento governa principalmente le superfici pubbliche Brand di Tretnix. Le superfici amministrative Product condividono identità, palette e riconoscibilità, ma danno priorità a densità informativa, gerarchia operativa, leggibilità, efficienza e feedback chiari. Appartenere allo stesso studio non richiede composizione o densità identiche.

### Evidence Labels

- **Approved external brand asset:** valore proveniente dall'asset master Tretnix approvato `logo-master.pdf`, non attualmente versionato nel repository.
- **Confirmed implementation evidence:** comportamento o valore osservato direttamente nel repository o nel rendering corrente.
- **Approved design decision:** direzione normativa approvata per il futuro.
- **Inferred recurring pattern:** regolarità consistente ricavata da più occorrenze, ma non formalizzata come token proprietario.
- **Known gap:** limite confermato dell'implementazione attuale; non deve essere promosso a regola riuscita.
- **To verify:** aspetto che richiede ulteriore prova, audit o consolidamento.

### Evidence Base

- **Approved external brand asset.** La palette master approvata proviene da `logo-master.pdf`, non attualmente versionato nel repository. È distinta dai colori applicativi correnti e i valori `brand-*` nel frontmatter rappresentano il marchio ufficiale.
- **Confirmed implementation evidence.** I valori `surface-*`, `interactive-*` e `text-*` nel frontmatter provengono dai token e dalle utility correnti in `src/styles.css`.
- **Confirmed implementation evidence.** La composizione pubblica è osservabile in `TretnixLanding`, `TretnixChrome`, nelle route dei case study e negli asset di logo e device mockup.
- **Confirmed implementation evidence.** Le superfici Product sono osservabili nelle route `admin.*`, che riutilizzano parte del linguaggio Brand in una struttura più densa.
- **To verify.** Il deployment pubblico è coerente con i principali valori estratti, ma il repository resta la fonte primaria per questa documentazione.

**Key Characteristics:**

- **Approved design decision.** Precisione misurata, non freddezza istituzionale.
- **Approved design decision.** Identità boutique e responsabilità diretta, non standardizzazione SaaS.
- **Confirmed implementation evidence.** Fondali navy profondi con un accento blu ad alta leggibilità.
- **Confirmed implementation evidence.** Contrasto tra serif editoriale per momenti di enfasi e sans per chiarezza operativa.
- **Confirmed implementation evidence.** Vetro, glow e movimento usati per gerarchia, separazione e interazione.
- **Approved design decision.** Ogni effetto deve avere una funzione leggibile e non soltanto decorativa.

## Colors

**Approved design decision.** Il sistema distingue sempre la palette ufficiale del marchio dalla palette applicativa del sito corrente. Il CSS descrive l'implementazione; non ridefinisce automaticamente il marchio.

### Official Tretnix Brand Palette

**Source:** Approved external Tretnix master logo asset, `logo-master.pdf`. The master asset is not currently versioned in this repository.

- **Blu Tretnix** (#054BFF): **Approved external brand asset — `logo-master.pdf`.** Blu ufficiale della firma Tretnix; token `brand-blue`.
- **Navy Tretnix** (#000F28): **Approved external brand asset — `logo-master.pdf`.** Navy ufficiale per fondali e contesti di marca; token `brand-navy`.
- **Nero tecnico Tretnix** (#0A0F19): **Approved external brand asset — `logo-master.pdf`.** Quasi nero ufficiale, tecnico ma non assoluto; token `brand-near-black`.
- **Bianco Tretnix** (#F5F7F9): **Approved external brand asset — `logo-master.pdf`.** Bianco ufficiale leggermente attenuato; token `brand-off-white`.

### Current Website Implementation Palette

- **Fondale principale** (#020814): **Confirmed implementation evidence.** Canvas dominante delle pagine pubbliche e amministrative; token `surface-canvas`.
- **Superficie strutturale** (#061326): **Confirmed implementation evidence.** Fondale per popover e livelli secondari; token `surface-structural`.
- **Fondale profondo** (#030B1A): **Confirmed implementation evidence.** Navy aggiuntivo disponibile per stratificazioni scure; token `surface-deep`.
- **Blu interfaccia primario** (#0B63FF): **Confirmed implementation evidence.** Azioni principali, accenti e stati selezionati; token `interactive-primary`.
- **Blu interazione** (#1E7BFF): **Confirmed implementation evidence.** Focus, testi interattivi, indicatori attivi e glow; token `interactive-highlight`.
- **Testo principale** (#F5F7FA): **Confirmed implementation evidence.** Testo ad alto contrasto sul canvas scuro; token `text-primary`.
- **Testo secondario** (#9AA7B8): **Confirmed implementation evidence.** Descrizioni, contenuto di supporto e metadati; token `text-muted`.
- **Testo attenuato** (#74849C): **Confirmed implementation evidence.** Microcopy e label a bassa enfasi; token `text-subtle` aggiornato per aumentare la leggibilità sul canvas scuro.
- **Vetro Navy** (rgba(8, 16, 34, 0.56)): **Confirmed implementation evidence.** Token semitrasparente generico `surface-glass`; le utility reali variano opacità e composizione in base a navbar, menu, panel o card.

### Recorded Differences

- **Confirmed implementation evidence.** `interactive-primary` non coincide con `brand-blue`; è il blu applicativo corrente.
- **Confirmed implementation evidence.** `text-primary` differisce leggermente da `brand-off-white`.
- **Confirmed implementation evidence.** I navy applicativi non sostituiscono `brand-navy` o `brand-near-black`; sono livelli dell'interfaccia corrente.
- **Confirmed implementation evidence.** Nel logo SVG versionato nel repository compaiono i valori applicativi correnti, mentre la palette master approvata usa i token `brand-*`.
- **Approved design decision.** Queste discrepanze vanno registrate e valutate separatamente; non autorizzano correzioni automatiche del codice o degli asset.

### Named Rules

**The Brand–Interface Separation Rule.** **Approved design decision.** I colori ufficiali descrivono il marchio; i colori applicativi descrivono l'interfaccia corrente. Non presentarli come intercambiabili senza una decisione approvata.

**The Blue Function Rule.** **Inferred recurring pattern.** Il blu applicativo concentra azioni, focus, indicatori attivi e accenti editoriali; la sua efficacia dipende dalla rarità relativa sul fondale navy.

**The Subtle Text Review Rule.** **Implementation update.** `text-subtle` è stato portato a `#74849C` per aumentare la leggibilità sul canvas scuro. La verifica contestuale su testi piccoli, stati e superfici resta obbligatoria prima di dichiarare conformità WCAG.

## Typography

**Confirmed implementation evidence.** Tretnix usa due famiglie caricate da Google Fonts: Instrument Serif in tondo e corsivo; Inter nei pesi 300–700.

**Display Font:** Instrument Serif (with Cormorant Garamond, Georgia, ui-serif, serif)

**Confirmed implementation evidence.** Il display usa peso 400 e tracking negativo. È applicato solo quando richiesto esplicitamente e non sostituisce la sans in tutti i titoli.

**Body Font:** Inter (with ui-sans-serif, system-ui, sans-serif)

**Confirmed implementation evidence.** Il body usa antialiasing e feature OpenType `"ss01"` e `"cv11"`. È la famiglia predefinita per corpo, navigazione, controlli e titoli non editoriali.

**Character:** **Approved design decision.** Il serif introduce personalità editoriale e qualità boutique; la sans mantiene chiarezza, disciplina e leggibilità. La relazione deve restare intenzionale, non decorativa.

### Hierarchy

- **Display pubblico** (Instrument Serif, weight 400, 44px / 54px / 72px, line-height 1.02): **Confirmed implementation evidence.** Hero pubblico su mobile, `sm` e `lg`.
- **Heading di sezione pubblico** (Instrument Serif, weight 400, 36px / 48px / 56px, line-height 1.05): **Confirmed implementation evidence.** Titoli principali delle sezioni pubbliche.
- **Heading case study** (Instrument Serif, weight 400, 36px–72px, line-height 1.02–1.05): **Confirmed implementation evidence.** Testate e titoli editoriali dei progetti.
- **Title operativo** (Inter, weight 500, 18px–24px, line-height 1.25): **Confirmed implementation evidence.** Titoli dove prevale la chiarezza funzionale.
- **Body** (Inter, weight 400, 16px, line-height 1.5): **Confirmed implementation evidence.** Testo corrente e contenuto di interfaccia.
- **Body large** (Inter, weight 400, 18px, line-height 1.625): **Confirmed implementation evidence.** Introduzioni principali da `sm`.
- **Body secondario** (Inter, weight 400, 14px, line-height 1.5): **Confirmed implementation evidence.** Descrizioni e metadati in `text-muted`.
- **Section label** (Inter, weight 500, 0.72rem, letter-spacing 0.22em): **Confirmed implementation evidence.** Label uppercase in blu di interazione.
- **Admin heading corrente** (Instrument Serif, weight 400, 36px): **Confirmed implementation evidence.** Comportamento osservato, non obbligo futuro per ogni Product surface.

### Responsive Type Rule

**Approved design decision.** Le dimensioni cambiano ai breakpoint osservati. Non introdurre `clamp()`, scale fluide o nuovi token tipografici senza una decisione e un'implementazione esplicite.

### Named Rules

**The Editorial Control Rule.** **Approved design decision.** Usa il serif per momenti di identità, enfasi e gerarchia; usa la sans per contenuto, navigazione, controlli e densità operativa.

**The No Generic Slogan Rule.** **Approved design decision.** La tipografia editoriale non giustifica copy vago: il contenuto resta concreto, preciso e verificabile.

## Layout

**Confirmed implementation evidence.** Le superfici pubbliche seguono un modello mobile-first con container centrato `max-w-7xl` (`1280px`), gutter laterale di `24px` e gutter di `40px` da `lg`. La navbar usa un container più stretto `max-w-5xl` (`1024px`).

**Inferred recurring pattern.** Il ritmo verticale pubblico alterna sezioni da `96px/128px` e `112px/144px` tra mobile e `lg`. Le card ricorrenti usano padding di `28px`; le callout più importanti salgono da `32px` a `40px` e `56px`.

**Confirmed implementation evidence.** Le composizioni passano da una colonna a griglie a due o tre colonne. Le proporzioni editoriali ricorrenti sono `0.9fr/1.4fr`, `0.95fr/1.4fr`, `1fr/1.05fr` e `1.05fr/1fr`; non costituiscono una scala proprietaria.

**Confirmed implementation evidence.** I breakpoint usati ricorrentemente sono `sm`, `md` e `lg`. In assenza di override nel repository corrispondono ai breakpoint Tailwind applicati (`640px`, `768px`, `1024px`), coerenti con il rendering verificato.

**Confirmed implementation evidence.** Su mobile, i contenuti editoriali diventano a colonna singola, il testo precede generalmente le immagini, la navigazione desktop scompare e viene sostituita da un controllo menu di `44px`. Il footer passa da colonne affiancate a un flusso verticale.

**Confirmed implementation evidence.** Le superfici admin usano un contenitore `max-w-7xl`; da `md` mostrano una sidebar da `256px`, mentre su mobile usano una navigazione orizzontale scorrevole. Il contenuto usa padding `24px`, elevato a `40px` da `lg`.

**Approved design decision.** Non esiste ancora una scala di spacing proprietaria Tretnix. I valori Tailwind ricorrenti sono evidenza corrente; non devono essere rinominati o trasformati in nuovi token senza consolidamento esplicito.

### Named Rules

**The Surface Density Rule.** **Approved design decision.** Le Brand surfaces privilegiano respiro e composizione; le Product surfaces possono essere più dense, purché mantengano gerarchia, leggibilità e riconoscibilità Tretnix.

**The Mobile Reading Order Rule.** **Approved design decision.** Nelle sezioni editoriali mobile, il testo precede l'immagine salvo hero, gallery o componenti esplicitamente visual-first.

## Elevation & Depth

**Approved design decision. Stratificazione controllata.** La profondità nasce prima dalla sovrapposizione tonale dei navy, dai bordi traslucidi e dalla separazione spaziale.

**Approved design decision.** Vetro, ombre e glow sono accenti selettivi per navigazione, enfasi, interazione e gerarchia. Non costituiscono il trattamento predefinito di ogni superficie.

**Approved design decision.** Non sommare automaticamente blur, glow, ombre marcate e bordi luminosi nello stesso componente. Ogni effetto deve avere una funzione leggibile e non soltanto decorativa.

### Current Shadow Vocabulary

- **Glass panel** (`box-shadow: 0 10px 40px -18px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.07)`): **Confirmed implementation evidence.** Ombra esterna scura e highlight interno; blur di sfondo `32px`, saturazione `160%`, bordo bianco traslucido.
- **Glass navbar** (`box-shadow: 0 10px 40px -20px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08)`): **Confirmed implementation evidence.** Variante compatta con blur di sfondo `34px` e saturazione `170%`.
- **Glass menu** (`box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.07)`): **Confirmed implementation evidence.** Livello più opaco e sollevato per il menu mobile.
- **Glass card** (`box-shadow: 0 20px 60px -30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)`): **Confirmed implementation evidence.** Profondità contenuta, blur di sfondo `28px`, bordo e highlight interno leggeri.
- **Soft glow** (`box-shadow: 0 0 60px -10px rgba(11, 99, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)`): **Confirmed implementation evidence.** Alone blu ampio per navbar in scroll, CTA callout e marcatori selezionati.
- **Project card hover** (`box-shadow: 0 30px 80px -20px rgba(11, 99, 255, 0.35)`): **Confirmed implementation evidence.** Card di progetto sollevata di `4px` in hover.

### Named Rules

**The Function Before Effect Rule.** **Approved design decision.** Ogni effetto di profondità deve chiarire separazione, stato o gerarchia; l'effetto puramente ornamentale non è una regola del sistema.

**The Selective Glass Rule.** **Approved design decision.** Riserva il vetro a navigazione, pannelli sovrapposti, callout e superfici che richiedono separazione percettiva.

## Shapes

**Confirmed implementation evidence.** Il raggio base è `12px`; la scala derivata produce `8px`, `10px`, `12px`, `16px`, `20px` e `24px`. La forma `999px` è usata per pill, CTA, chip, icone circolari e navbar.

**Inferred recurring pattern.** Le card standard usano soprattutto `20px`; callout e menu importanti usano `24px`; input e controlli operativi usano `10–12px`.

**Confirmed implementation evidence.** I bordi bianchi traslucidi definiscono superfici e stati senza creare separatori opachi pesanti. Alcuni contenuti editoriali usano invece bordi lineari o accenti laterali per una gerarchia più sobria.

**Approved design decision.** Le curve ammorbidiscono la precisione senza trasformare ogni elemento in una pill. La forma segue il ruolo: pill per azioni e selezioni compatte; raggio medio per campi; raggio ampio per superfici importanti.

### Named Rules

**The Role-Shaped Radius Rule.** **Approved design decision.** La curvatura comunica funzione e scala; non applicare `rounded-full` indiscriminatamente a ogni contenitore.

## Components

**Approved design decision. Component Philosophy: "Precisione misurata"**

**Approved design decision.** I componenti devono apparire intenzionali, leggibili e controllati senza diventare rigidi, freddi o impersonali.

### Brand Assets

- **Approved external brand asset.** La palette master ufficiale usa i token `brand-*` nel frontmatter ed è tratta da `logo-master.pdf`, non attualmente versionato nel repository.
- **Confirmed implementation evidence.** Il logo orizzontale versionato è un SVG `1290×220` con simbolo geometrico a T e wordmark costruito a tracciati; è usato in navbar e footer.
- **Confirmed implementation evidence.** La variante iconica ricostruisce il simbolo T inline per posizionamenti compatti e conserva un'etichetta accessibile.
- **Confirmed implementation evidence.** Navbar e footer mantengono il logo orizzontale senza deformazione, con `object-contain` e proporzioni fisse.
- **Approved design decision.** Non ridisegnare, ricolorare arbitrariamente, ricomporre o sostituire il marchio con testo generico.
- **To verify.** Il logo SVG presente nel repository incorpora colori applicativi diversi dalla palette master approvata; la riconciliazione degli asset è fuori da questo incarico.

### Buttons

- **Confirmed implementation evidence. Primary:** pill con gradiente verticale da `interactive-highlight` a `interactive-primary`, testo bianco, bordo traslucido, padding `0.85rem 1.5rem` e ombra blu.
- **Confirmed implementation evidence. Primary hover:** traslazione verticale di `-1px` e glow più intenso; focus visibile con outline blu da `2px` e offset `3px`.
- **Confirmed implementation evidence. Ghost:** pill trasparente, bordo forte traslucido e testo primario; l'hover aggiunge un riempimento bianco minimo e rafforza il bordo.
- **Implementation update.** `btn-ghost` dichiara ora un trattamento `focus-visible` dedicato coerente con la CTA primaria; la verifica browser da tastiera resta pendente.
- **Approved design decision.** Le pill sono canoniche per CTA e azioni compatte osservate; non sono la forma automatica di ogni controllo.

### Navigation

- **Confirmed implementation evidence.** La navbar pubblica è fissa, centrata, alta `62px`, larga al massimo `1024px` e costruita come capsula in vetro.
- **Confirmed implementation evidence.** I link desktop usano Inter a `13px`; lo stato attivo combina testo primario, text-shadow blu e un indicatore circolare.
- **Confirmed implementation evidence.** Dopo `20px` di scroll viene aggiunto `soft-glow`.
- **Confirmed implementation evidence.** Sotto `lg`, link e CTA desktop sono sostituiti da un pulsante menu `44×44px` e da un pannello in vetro a tutta larghezza con entrata sfalsata, evitando una navbar desktop compressa sui tablet.
- **Confirmed implementation evidence.** Il menu espone `aria-expanded`, `aria-controls`, `aria-current` e chiusura con `Escape`.

### Footer

- **Confirmed implementation evidence.** Il footer è separato da un bordo superiore discreto e usa lo stesso container `max-w-7xl` delle sezioni.
- **Confirmed implementation evidence.** Logo, proposizione breve, contatti e link legali sono impaginati in due colonne da `sm` e in flusso verticale su mobile.
- **Confirmed implementation evidence.** I link passano da testo attenuato a testo primario; l'email usa il blu di interazione in hover.
- **Approved design decision.** Il footer resta sobrio e informativo; non diventa una seconda hero o una superficie promozionale ridondante.

### Section Labels

- **Confirmed implementation evidence.** Le label di sezione combinano una linea orizzontale blu, testo uppercase a `0.72rem`, peso 500 e tracking `0.22em`.
- **Inferred recurring pattern.** Sono segnali editoriali di orientamento, non badge promozionali.

### Cards and Surfaces

- **Confirmed implementation evidence.** `glass-card` è la card Brand ricorrente: navy semitrasparente, gradiente superiore, blur, bordo sottile, ombra scura e highlight interno.
- **Confirmed implementation evidence.** Le card informative usano soprattutto raggio `20px` e padding `28px`.
- **Confirmed implementation evidence.** Le card progetto aggiungono ratio visuali `4:5`, overlay dal canvas, griglia tenue e lift in hover.
- **Approved design decision.** Il vetro è selettivo: superfici semplici possono usare layering tonale, bordo o spazio senza blur.

### Inputs, Controls and Chips

- **Confirmed implementation evidence.** `admin-input` usa navy semitrasparente, bordo bianco al `14%`, raggio `10px`, testo `0.9rem` e padding `0.65rem 0.85rem`.
- **Confirmed implementation evidence.** Il focus dei campi rafforza il bordo blu e aggiunge un ring blu traslucido da `3px`.
- **Confirmed implementation evidence.** Le label campo sono uppercase a `0.72rem`, tracking `0.16em` e colore attenuato.
- **Confirmed implementation evidence.** Chip e filtri sono pill con bordo; lo stato attivo usa riempimento blu traslucido e testo primario.
- **Confirmed implementation evidence.** Le primitive UI generiche in `src/components/ui` sono infrastruttura secondaria. Non definiscono da sole l'identità visuale pubblica canonica.

### Imagery

- **Confirmed implementation evidence.** La hero usa mockup ritagliati di laptop e smartphone con sfondo trasparente, sovrapposizione prospettica, glow radiale blu e drop shadow.
- **Confirmed implementation evidence.** I case study usano immagini `object-cover`, rapporti `4:5` nelle card e `16:9` nelle testate, con overlay scuri per proteggere la leggibilità.
- **Confirmed implementation evidence.** In assenza di media, il sistema mostra un placeholder sobrio con gradiente navy e label uppercase.
- **Approved design decision.** L'immagine deve rappresentare il prodotto o il contesto con chiarezza; non introdurre stock photography generica o visual AI intercambiabili.
- **To verify.** I mockup sono serviti come WebP, mentre i metadati asset conservano origine e MIME PNG. È una discrepanza tecnica, non un principio visivo.

### Motion and Reveal

- **Confirmed implementation evidence.** I reveal sotto la piega usano Intersection Observer con threshold `0.05`, root margin inferiore `-10%`, fade e traslazione verticale di `16px` in `700ms ease-out`.
- **Confirmed implementation evidence.** Il menu mobile entra in `220ms` e sfalsa gli elementi in `240ms` con una curva rapida e controllata.
- **Confirmed implementation evidence.** FAQ e gruppi collassabili animano altezza, opacità e traslazione in `400–500ms`.
- **Confirmed implementation evidence.** CTA e card usano micro-traslazioni brevi; il mockup smartphone fluttua in un ciclo di `6s` e il glow pulsa in `4s`.
- **Confirmed implementation evidence.** Reveal, alcune frecce e card annullano trasformazioni o transizioni con `prefers-reduced-motion`.
- **Implementation update.** È stata aggiunta una copertura globale `prefers-reduced-motion` e gli scroll controllati scelgono comportamento immediato quando la preferenza è attiva; la verifica runtime di tutti i componenti resta pendente.
- **Approved design decision.** Tutti i contenuti e le azioni devono restare utilizzabili senza motion; non dichiarare la verifica superata senza un audit completo.

### Administrative Product Surfaces

- **Confirmed implementation evidence.** L'admin corrente riusa canvas navy, logo, accenti blu, alcune card in vetro e heading serif.
- **Confirmed implementation evidence.** La densità aumenta tramite sidebar, liste, pannelli, tabelle, form e navigazione mobile scorrevole.
- **Approved design decision.** La futura regola normativa è identità Tretnix riconoscibile, maggiore densità informativa, gerarchia operativa, leggibilità, efficienza, feedback chiari e decorazione subordinata al compito.
- **Approved design decision.** Serif, vetro e glow osservati nell'admin non diventano automaticamente obbligatori per ogni nuova Product surface.
- **Approved design decision.** Brand e Product devono appartenere allo stesso studio senza condividere necessariamente composizione, ritmo o intensità decorativa.

### Accessibility-Related Visual Rules

- **Confirmed implementation evidence.** Il sistema include landmarks semantici, heading, label, alt text, stati ARIA, focus visibile in vari controlli e target mobili da `44px` o più.
- **Confirmed implementation evidence.** Testo principale, testo secondario e blu di interazione hanno contrasto elevato sul canvas principale nei valori calcolati.
- **Implementation update.** Contrasto del token attenuato, focus globale e reduced motion sono stati rafforzati; restano da verificare contestualmente in browser, da tastiera e con tecnologie assistive.
- **Approved design decision.** Nessuna conformità WCAG 2.2 AA deve essere dichiarata senza test completi su route, stati, contenuti, tastiera, contrasto, tecnologie assistive e preferenze di motion.

## Do's and Don'ts

### Do

- **Approved design decision. Do** separare sempre palette ufficiale e palette applicativa corrente.
- **Approved design decision. Do** usare serif, blu, vetro e glow solo quando rafforzano identità, gerarchia o interazione.
- **Approved design decision. Do** mantenere il contrasto tra respiro delle Brand surfaces e densità efficiente delle Product surfaces.
- **Approved design decision. Do** preservare i breakpoint, le dimensioni discrete e i pattern responsive realmente osservati.
- **Approved design decision. Do** mantenere contenuti e azioni utilizzabili senza animazione.
- **Approved design decision. Do** verificare contrasto, focus e motion prima di dichiarare conformità.
- **Approved design decision. Do** mantenere logo e asset con proporzioni, integrità e alternative testuali appropriate.

### Don't

- **Approved design decision. Don't** normalizzare Tretnix in una landing SaaS, dashboard fintech, estetica crypto/trading o agenzia creativa sperimentale.
- **Approved design decision. Don't** trasformare blur, glow, ombre e bordi luminosi in una combinazione predefinita per ogni componente.
- **Approved design decision. Don't** trattare i colori applicativi correnti come sostituti automatici della palette ufficiale.
- **Approved design decision. Don't** inventare scale di spacing, `clamp()`, token fluidi o varianti non presenti nel repository.
- **Approved design decision. Don't** imporre alle Product surfaces la stessa composizione o intensità decorativa delle Brand surfaces.
- **Approved design decision. Don't** presentare `text-subtle` o il supporto reduced motion corrente come verifiche già superate.
- **Approved design decision. Don't** introdurre slogan generici, lusso artificioso o tecnologia fredda e impersonale.
