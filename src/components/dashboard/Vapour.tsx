import "./dashboard.css";

/** The ember vapour behind a dashboard. Gradients only, so it loads nothing and sits on the page's own background. */
export function Vapour() {
  return <div aria-hidden className="dash-vapour" />;
}
