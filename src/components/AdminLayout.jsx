import { NavLink } from "react-router-dom";
import { readJson, safeLocalStorage } from "../utils/storage.js";

const navItems = [
  { to: "/dashboard", label: "Overview" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/employees", label: "Employees" },
  { to: "/templates", label: "Templates" },
  { to: "/reports", label: "Reports" }
];

export default function AdminLayout({ title, subtitle, children }) {
  const user = readJson(safeLocalStorage, "phishscale_user");

  const logout = () => {
    safeLocalStorage.removeItem("phishscale_token");
    safeLocalStorage.removeItem("phishscale_user");
    window.location.href = "/";
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-block">
          <p className="eyebrow">PhishScale</p>
          <h2>Glow Console</h2>
          <p className="muted">A lightweight phishing awareness dashboard with a clean neon shell.</p>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="stack-gap">
          <div className="sidebar-kpi">
            <p className="eyebrow">Status</p>
            <strong>Live Workspace</strong>
            <p className="muted">Campaigns, targets, templates, and reports are available after sign in.</p>
          </div>

          <div className="admin-sidebar-card">
            <strong>{user?.firstName} {user?.lastName}</strong>
            <p className="muted">{user?.email}</p>
            <button className="ghost-btn full-width" onClick={logout}>Logout</button>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-main-inner">
          <header className="admin-page-head">
            <div>
              <p className="eyebrow">Workspace</p>
              <h1>{title}</h1>
              {subtitle ? <p className="muted">{subtitle}</p> : null}
            </div>
            <div className="page-chip">Signed in as {user?.firstName || "Admin"}</div>
          </header>
          <div className="page-stack">{children}</div>
        </div>
      </main>
    </div>
  );
}
