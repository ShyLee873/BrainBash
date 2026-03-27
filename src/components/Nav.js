import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export default function Nav({ theme, onToggleTheme, showQuestionActions }) {
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

      <DropdownButton
        id="options-dropdown"
        className="bb-button"
        title="⚙️"
      >
        <Dropdown.Item
        className="bb-menu" 
        onClick={onToggleTheme}
        >
          {theme === "dark" ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </Dropdown.Item>
        <Dropdown.Item>Mute PH</Dropdown.Item>
        <Dropdown.Item>About</Dropdown.Item>
      </DropdownButton>
    </div>
  );
}