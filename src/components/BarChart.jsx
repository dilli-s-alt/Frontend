export default function BarChart({ title, rows, valueKey, colorClass, suffix = "%" }) {
  const max = Math.max(...rows.map((row) => row[valueKey] || 0), 1);

  return (
    <div className="card chart-card">
      <div className="section-head compact">
        <div>
          <p className="eyebrow">Analytics</p>
          <h3>{title}</h3>
          <p className="muted">Simple visual breakdown for the current dataset.</p>
        </div>
      </div>
      <div className="bars">
        {rows.map((row) => (
          <div className="bar-row" key={row.department || row.name}>
            <div>
              <strong>{row.department || row.name}</strong>
              <p className="muted">{row.total ? `${row.total} targets` : row.templateName}</p>
            </div>
            <div className="bar-track">
              <span
                className={`bar-fill ${colorClass}`}
                style={{ width: `${((row[valueKey] || 0) / max) * 100}%` }}
              />
            </div>
            <strong>{row[valueKey] || 0}{suffix}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
