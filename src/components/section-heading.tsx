export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cereza">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 leading-relaxed text-espresso/70">{description}</p>
      )}
    </div>
  );
}
