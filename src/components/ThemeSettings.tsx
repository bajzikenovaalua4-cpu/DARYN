import { useState } from 'react';
import { interfaceThemes, type InterfaceThemeId } from '../lib/interfaceThemes';

type ThemeSettingsProps = {
  value: InterfaceThemeId;
  onChange: (themeId: InterfaceThemeId) => void;
  unlockedThemeIds?: InterfaceThemeId[];
  onLockedThemeClick?: () => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
};

export function ThemeSettings({
  value,
  onChange,
  unlockedThemeIds = [],
  onLockedThemeClick,
  darkMode,
  onDarkModeChange,
}: ThemeSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={isOpen ? 'vn-theme-settings is-open' : 'vn-theme-settings'} aria-label="Настройки темы интерфейса">
      <button
        className="vn-theme-toggle"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        Тема
      </button>
      <div className="vn-theme-panel" aria-hidden={!isOpen}>
        <header>
          <span>Цвет интерфейса</span>
          <button type="button" onClick={() => setIsOpen(false)}>Свернуть</button>
        </header>

        <label className="vn-dark-mode">
          <span>
            <b>Темная тема</b>
            <small>Цвет интерфейса не меняется</small>
          </span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(event) => onDarkModeChange(event.currentTarget.checked)}
          />
          <i />
        </label>

        <div>
          {interfaceThemes.map((theme) => {
            const locked = isShopTheme(theme.id) && !unlockedThemeIds.includes(theme.id);

            return (
              <button
                key={theme.id}
                className={theme.id === value ? 'is-active' : ''}
                type="button"
                onClick={() => {
                  if (locked) {
                    onLockedThemeClick?.();
                    return;
                  }
                  onChange(theme.id);
                }}
                title={locked ? 'Открыть магазин' : theme.title}
                aria-label={`Выбрать тему ${theme.title}`}
              >
                <i style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }} />
                <b>{locked ? `${theme.title} shop` : theme.title}</b>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function isShopTheme(themeId: InterfaceThemeId) {
  return themeId === 'aurora' || themeId === 'gold';
}
