import { useEffect, useRef, useState } from "react";
import AboutModal from "./AboutModal";

export default function Nav({theme, onToggleTheme, showQuestionActions, onToggleMute, muted}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="nav">
      <div className="restartBtnContainer">
        {showQuestionActions && (
          <button
            type="button"
            className="backToStart"
            onClick={() => window.location.reload()}
          >
            <span>Back to Start</span>
          </button>
        )}
      </div>

      <div className="optionsMenu" ref={menuRef}>
        <button
          type="button"
          className='optionsToggle'
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Open options menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="optionsIcon">☀</span>
          <span className={`caret ${menuOpen ? "open" : ""}`}>▾</span>
        </button>

        {menuOpen && (
          <div className={`optionsDropdown ${menuOpen ? "open-overlay" : ""}`} role="menu">
            <button
              type="button"
              className="optionsItem"
              onClick={() => {
                onToggleTheme();
                setMenuOpen(false);
              }}
            >
              {theme === "dark" ? "Light Mode 🌞" : "Dark Mode 🌙"}
            </button>

            <button
              type="button"
              className="optionsItem"
              onClick={() => {
                onToggleMute();
                setMenuOpen(false);
              }}
            >
              {muted ? "Unmute 🔈" : "Mute 🔇"}
            </button>

            <button
              type="button"
              className="optionsItem"
              onClick={() => {
                setAboutOpen(true);
                setMenuOpen(false);
              }}
            >
              About
            </button>

            <button 
              type="button" 
              className="optionClose" 
              onClick={() => {setMenuOpen(false)}}
            >
              ❌
              </button>
          </div>
        )}
      </div>
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}