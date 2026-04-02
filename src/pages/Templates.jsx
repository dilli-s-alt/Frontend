import AdminLayout from "../components/AdminLayout.jsx";
import useAdminData from "../hooks/useAdminData.js";

export default function Templates() {
  const { templates, loading, error } = useAdminData();

  if (loading && !templates.length) {
    return <div className="loading-screen">Loading templates...</div>;
  }

  return (
    <AdminLayout
      title="Templates"
      subtitle="A simple browser for your email templates and landing page clues."
    >
      {error ? <div className="notice error">{error}</div> : null}

      <section className="template-grid">
        {templates.map((template) => (
          <article className="card template-browser-card" key={template.id}>
            <div className="section-head compact">
              <div>
                <p className="eyebrow">{template.category}</p>
                <h3>{template.name}</h3>
              </div>
            </div>

            <div className="detail-stack">
              <div className="detail-row"><strong>From name</strong><span>{template.fromName}</span></div>
              <div className="detail-row"><strong>Subject</strong><span>{template.subject}</span></div>
              <div className="detail-row"><strong>Landing</strong><span>{template.landingTitle}</span></div>
            </div>

            <div className="template-preview-box">
              <div dangerouslySetInnerHTML={{ __html: template.html }} />
            </div>

            <div className="clue-list compact-clues">
              {template.clues.map((clue) => (
                <article className="clue-card" key={clue}>
                  <strong>Clue</strong>
                  <p>{clue}</p>
                </article>
              ))}
            </div>
          </article>
        ))}
      </section>
    </AdminLayout>
  );
}
