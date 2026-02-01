import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle glass"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="toggle-track">
        <span className="toggle-icon sun">☀️</span>
        <span className="toggle-icon moon">🌙</span>
        <div className={`toggle-thumb ${theme}`} />
      </div>
    </button>
  );
}
