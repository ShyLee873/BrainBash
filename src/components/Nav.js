export default function Nav({ theme, onToggleTheme, showQuestionActions }) {
  return (
    <div className="nav">
      <div className="restartBtnContainer">
        {showQuestionActions && (
        <button type="button" className="backToStart" onClick={() => window.location.reload()}>
            ⟲ <span>Back to Start</span>
        </button>
        )}
      </div>
      <div className="lightToggleContainer">
        <button type="button" className="lightToggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? "💡" : "🌙"}
        </button>
      </div>
    </div>
  );
}