export default function MetricCard({ label, value, hint }) {
  return (
    <div className="card metric-card">
      <p className="eyebrow">{label}</p>
      <h3>{value}</h3>
      <p className="muted">{hint}</p>
    </div>
  );
}
