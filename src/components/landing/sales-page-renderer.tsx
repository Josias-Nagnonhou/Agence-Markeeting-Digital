import { cn } from "@/lib/utils/cn";
import { getThemeByKey } from "@/lib/landing/themes";
import type { SectionType } from "@/generated/prisma/enums";

export interface RenderableSection {
  type: SectionType;
  content: unknown;
}

function findContent<T>(sections: RenderableSection[], type: SectionType): T | undefined {
  return sections.find((section) => section.type === type)?.content as T | undefined;
}

export function SalesPageRenderer({
  sections,
  themeKey,
  ctaHref,
}: {
  sections: RenderableSection[];
  themeKey: string | null | undefined;
  ctaHref: string;
}) {
  const theme = getThemeByKey(themeKey);

  const headline = findContent<{ text: string }>(sections, "HEADLINE");
  const subheadline = findContent<{ text: string }>(sections, "SUBHEADLINE");
  const problem = findContent<{ title: string; body: string }>(sections, "PROBLEM_AGITATION");
  const benefits = findContent<{ title: string; items: string[] }>(sections, "BENEFITS");
  const socialProof = findContent<{
    title: string;
    testimonials: { author: string; role?: string; quote: string }[];
  }>(sections, "SOCIAL_PROOF");
  const objections = findContent<{
    title: string;
    items: { question: string; answer: string }[];
  }>(sections, "OBJECTIONS");
  const cta = findContent<{ text: string; subtext?: string }>(sections, "CTA");

  return (
    <div className={cn(theme.page, "min-h-full w-full")}>
      {/* Hero */}
      <section className={cn(theme.heroBg, "px-6 py-16 text-center sm:py-24")}>
        <div className="mx-auto max-w-2xl">
          {headline && (
            <h1 className={cn(theme.headlineFont, theme.heroText, "text-3xl sm:text-5xl")}>
              {headline.text}
            </h1>
          )}
          {subheadline && (
            <p className={cn(theme.heroAccentText, "mt-4 text-base sm:text-xl")}>{subheadline.text}</p>
          )}
          {cta && (
            <div className="mt-8">
              <a
                href={ctaHref}
                target="_blank"
                rel="noreferrer"
                className={cn(theme.ctaBg, theme.ctaText, "inline-block rounded-full px-8 py-3 text-sm font-semibold sm:text-base")}
              >
                {cta.text}
              </a>
              {cta.subtext && <p className={cn(theme.heroAccentText, "mt-3 text-xs sm:text-sm")}>{cta.subtext}</p>}
            </div>
          )}
        </div>
      </section>

      {/* Problème / agitation */}
      {problem && (
        <section className={cn(theme.sectionAlt, "px-6 py-14 sm:py-20")}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={cn(theme.headlineFont, "text-2xl sm:text-3xl")}>{problem.title}</h2>
            <p className="mt-4 text-sm leading-relaxed sm:text-base">{problem.body}</p>
          </div>
        </section>
      )}

      {/* Bénéfices */}
      {benefits && (
        <section className="px-6 py-14 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className={cn(theme.headlineFont, "text-center text-2xl sm:text-3xl")}>{benefits.title}</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.items.map((item) => (
                <li key={item} className={cn(theme.cardBg, "flex items-start gap-3 rounded-xl p-4 text-sm sm:text-base")}>
                  <span className={cn(theme.accentBg, theme.accentText, "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs")}>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Preuves sociales */}
      {socialProof && (
        <section className={cn(theme.sectionAlt, "px-6 py-14 sm:py-20")}>
          <div className="mx-auto max-w-2xl">
            <h2 className={cn(theme.headlineFont, "text-center text-2xl sm:text-3xl")}>{socialProof.title}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {socialProof.testimonials.map((testimonial, index) => (
                <figure key={index} className={cn(theme.cardBg, "rounded-xl p-5 text-sm sm:text-base")}>
                  <blockquote>&laquo; {testimonial.quote} &raquo;</blockquote>
                  <figcaption className="mt-3 text-xs opacity-70 sm:text-sm">
                    {testimonial.author}
                    {testimonial.role ? ` — ${testimonial.role}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Objections */}
      {objections && (
        <section className="px-6 py-14 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className={cn(theme.headlineFont, "text-center text-2xl sm:text-3xl")}>{objections.title}</h2>
            <div className="mt-8 space-y-4">
              {objections.items.map((item) => (
                <div key={item.question} className={cn(theme.cardBg, "rounded-xl p-4 text-sm sm:text-base")}>
                  <p className="font-semibold">{item.question}</p>
                  <p className="mt-1 opacity-80">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      {cta && (
        <section className={cn(theme.accentBg, "px-6 py-14 text-center sm:py-20")}>
          <div className="mx-auto max-w-xl">
            <p className={cn(theme.accentText, "text-xl font-semibold sm:text-2xl")}>{cta.text}</p>
            <a
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
              className={cn(theme.heroBg, theme.heroText, "mt-6 inline-block rounded-full px-8 py-3 text-sm font-semibold sm:text-base")}
            >
              {cta.text}
            </a>
            {cta.subtext && <p className={cn(theme.accentText, "mt-3 text-xs opacity-80 sm:text-sm")}>{cta.subtext}</p>}
          </div>
        </section>
      )}
    </div>
  );
}
