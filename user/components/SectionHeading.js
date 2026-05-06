export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {description ? <p className="text-base leading-7 text-ink/65">{description}</p> : null}
    </div>
  );
}
