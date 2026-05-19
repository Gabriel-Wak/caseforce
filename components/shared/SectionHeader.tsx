export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="relative z-10 mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="micro-label mb-1">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}
