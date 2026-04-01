import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Overview" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/employees", label: "Employees" },
  { to: "/templates", label: "Templates" },
  { to: "/reports", label: "Reports" }
];

export default function AdminLayout({ title, subtitle, children }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("phishscale_user") || "null");
  } catch {
    user = null;
  }

  const logout = () => {
    localStorage.removeItem("phishscale_token");
    localStorage.removeItem("phishscale_user");
    window.location.href = "/";
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="eyebrow">PhishScale</p>
          <h2>Training Console</h2>
          <p className="muted">Simple internal awareness platform for safe phishing drills.</p>
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

        <div className="admin-sidebar-card">
          <strong>{user?.firstName} {user?.lastName}</strong>
          <p className="muted">{user?.email}</p>
          <button className="ghost-btn full-width" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-page-head">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>{title}</h1>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
