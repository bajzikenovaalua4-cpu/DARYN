import { interfaceThemes, type InterfaceThemeId } from '../lib/interfaceThemes';

type ThemeSettingsProps = {
  value: InterfaceThemeId;
  onChange: (themeId: InterfaceThemeId) => void;
};

export function ThemeSettings({ value, onChange }: ThemeSettingsProps) {
  return (
    <div className="vn-theme-settings" aria-label="Настройки темы интерфейса">
      <span>Тема</span>
      <div>
        {interfaceThemes.map((theme) => (
          <button
            key={theme.id}
            className={theme.id === value ? 'is-active' : ''}
            type="button"
            onClick={() => onChange(theme.id)}
            title={theme.title}
            aria-label={`Выбрать тему ${theme.title}`}
          >
            <i style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }} />
            <b>{theme.title}</b>
          </button>
        ))}
      </div>
    </div>
  );
}
