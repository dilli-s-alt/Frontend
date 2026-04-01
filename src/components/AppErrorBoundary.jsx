import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected frontend error."
    };
  }

  componentDidCatch(error) {
    console.error("Frontend crash:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-crash-screen">
          <div className="card crash-card">
            <p className="eyebrow">Frontend Error</p>
            <h1>The page could not load correctly.</h1>
            <p className="muted">{this.state.message}</p>
            <button
              className="primary-btn"
              onClick={() => {
                localStorage.removeItem("phishscale_token");
                window.location.href = "/";
              }}
            >
              Return to login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
