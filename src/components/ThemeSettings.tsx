import { useState } from 'react';
import { t, type Language } from '../lib/i18n';
import { interfaceThemes, type InterfaceThemeId } from '../lib/interfaceThemes';

type ThemeSettingsProps = {
  value: InterfaceThemeId;
  onChange: (themeId: InterfaceThemeId) => void;
  unlockedThemeIds?: InterfaceThemeId[];
  onLockedThemeClick?: () => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export function ThemeSettings({
  value,
  onChange,
  unlockedThemeIds = [],
  onLockedThemeClick,
  darkMode,
  onDarkModeChange,
  language,
  onLanguageChange,
}: ThemeSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={isOpen ? 'vn-theme-settings is-open' : 'vn-theme-settings'} aria-label="Interface settings">
      <button
        className="vn-theme-toggle"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        {language.toUpperCase()}
      </button>
      <div className="vn-theme-panel" aria-hidden={!isOpen}>
        <header>
          <span>{t(language, 'language')} / {t(language, 'theme')}</span>
          <button type="button" onClick={() => setIsOpen(false)}>{t(language, 'back')}</button>
        </header>

        <div className="vn-language-switch">
          <span>{t(language, 'language')}</span>
          <button type="button" className={language === 'ru' ? 'is-active' : ''} onClick={() => onLanguageChange('ru')}>RU</button>
          <button type="button" className={language === 'kk' ? 'is-active' : ''} onClick={() => onLanguageChange('kk')}>KZ</button>
        </div>

        <label className="vn-dark-mode">
          <span>
            <b>{t(language, 'darkTheme')}</b>
            <small>{t(language, 'darkThemeHint')}</small>
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
                title={locked ? t(language, 'shop') : theme.title}
                aria-label={theme.title}
              >
                <i style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }} />
                <b>{locked ? `${theme.title} ${t(language, 'shop')}` : theme.title}</b>
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
