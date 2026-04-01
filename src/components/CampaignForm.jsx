import { useMemo, useState } from "react";

const initialForm = {
  name: "",
  templateId: "",
  landingPageType: "microsoft-365",
  departmentFocus: "All Departments",
  testMode: true,
  sendToSelf: true
};

export default function CampaignForm({ templates, onSubmit, busy }) {
  const [form, setForm] = useState(initialForm);
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === form.templateId),
    [templates, form.templateId]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm((current) => ({ ...initialForm, templateId: current.templateId || templates[0]?.id || "" }));
  };

  return (
    <form className="card form-card" onSubmit={submit}>
      <div className="section-head compact">
        <div>
          <p className="eyebrow">Week 2</p>
          <h3>Create Campaign</h3>
        </div>
      </div>

      <label>
        Campaign name
        <input name="name" value={form.name} onChange={handleChange} placeholder="Q2 credential awareness drill" required />
      </label>

      <div className="grid-2">
        <label>
          Pretext template
          <select name="templateId" value={form.templateId} onChange={handleChange} required>
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Department focus
          <input
            name="departmentFocus"
            value={form.departmentFocus}
            onChange={handleChange}
            placeholder="Engineering"
          />
        </label>
      </div>

      <label>
        Landing page style
        <select name="landingPageType" value={form.landingPageType} onChange={handleChange}>
          <option value="microsoft-365">Microsoft 365 Login</option>
          <option value="hr-portal">HR Policy Portal</option>
          <option value="shipping">Shipment Reschedule</option>
        </select>
      </label>

      <div className="inline-options">
        <label className="checkbox">
          <input type="checkbox" name="testMode" checked={form.testMode} onChange={handleChange} />
          Launch in test mode first
        </label>
        <label className="checkbox">
          <input type="checkbox" name="sendToSelf" checked={form.sendToSelf} onChange={handleChange} />
          Send to me before real targets
        </label>
      </div>

      {selectedTemplate ? (
        <div className="template-preview">
          <p className="eyebrow">Template preview</p>
          <h4>{selectedTemplate.subject}</h4>
          <p className="muted">{selectedTemplate.category}</p>
        </div>
      ) : null}

      <button className="primary-btn" type="submit" disabled={busy}>
        {busy ? "Saving..." : "Create campaign"}
      </button>
    </form>
  );
}
