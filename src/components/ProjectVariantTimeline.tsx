import { ArrowUpRight, Check } from "lucide-react";
import type { ProjectVariant } from "@/lib/project-variants";

type Props = {
  variants: ProjectVariant[];
};

function planLabel(plan: ProjectVariant["plan"]) {
  if (plan === "BUSINESS_PLUS") return "BUSINESS PLUS";
  return plan;
}

export function ProjectVariantTimeline({ variants }: Props) {
  if (variants.length === 0) return null;

  return (
    <section className="mt-20" aria-labelledby="evoluzione-progetto">
      <div className="max-w-2xl">
        <div className="section-label">Evoluzione della soluzione</div>
        <h2 id="evoluzione-progetto" className="font-serif mt-4 text-3xl leading-[1.08] sm:text-4xl">
          Una base coerente, <span className="text-accent italic">più profondità</span> quando serve.
        </h2>
        <p className="mt-5 text-muted-foreground">
          Le versioni fanno parte dello stesso progetto: START definisce una prima esperienza completa,
          BUSINESS amplia struttura e contenuti senza perdere l&apos;identità approvata.
        </p>
      </div>

      <div className="relative mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div aria-hidden className="absolute left-1/2 top-8 hidden h-px w-16 -translate-x-1/2 bg-primary/35 lg:block" />

        {variants.map((variant, index) => (
          <article key={variant.id} className="glass-card relative rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="section-label !text-primary-glow">{planLabel(variant.plan)}</div>
                <h3 className="mt-3 text-2xl font-medium text-foreground">{variant.label}</h3>
              </div>
              <span className="font-serif text-4xl text-white/[0.12]">0{index + 1}</span>
            </div>

            <p className="mt-5 leading-relaxed text-muted-foreground">{variant.short_description}</p>

            {variant.goal && (
              <div className="mt-6 border-l border-primary-glow/55 pl-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-subtle">Obiettivo</div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{variant.goal}</p>
              </div>
            )}

            {variant.features.length > 0 && (
              <ul className="mt-7 space-y-2.5">
                {variant.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary-glow">
                      <Check className="h-3 w-3" strokeWidth={2.4} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {variant.demo_url && (
              <a
                href={variant.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary-glow/60 hover:text-primary-glow"
              >
                Apri la demo {planLabel(variant.plan)}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </a>
            )}
          </article>
        ))}
      </div>

      <p className="mt-5 max-w-3xl text-xs leading-relaxed text-subtle">
        Le demo mostrano concept dimostrativi Tretnix e non attività reali. Dati, contatti e contenuti
        commerciali presenti nelle demo sono fittizi o non operativi, salvo diversa indicazione esplicita.
      </p>
    </section>
  );
}
