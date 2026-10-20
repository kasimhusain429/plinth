// A template re-mounts on every navigation, which replays the CSS fade-in.
export default function Template({ children }) {
  return <div className="page">{children}</div>;
}
