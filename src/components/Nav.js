export default function Nav({ theme, onToggleTheme }) {
  return (
    <div className="nav">
      <button type="button" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? "💡" : "🌙"}
      </button>
    </div>
  );
}