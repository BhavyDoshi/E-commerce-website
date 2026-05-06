export default function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{value}</p>
      {detail ? <p className="mt-2 text-sm text-ink/65">{detail}</p> : null}
    </div>
  );
}
