import {IconLanguage} from '@tabler/icons-react';
import {useEffect, useEffectEvent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Dropdown from '@/parcels/overview/Dropdown/Dropdown.tsx';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<string>('en');
  const switchLanguage = useEffectEvent((language: string) => {
    // noinspection JSIgnoredPromiseFromCall
    i18n.changeLanguage(language);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    switchLanguage(language);
  }, [language]);

  return (
    <Dropdown
      className={styles.iconButton}
      items={{
        de: 'Deutsch',
        en: 'English',
      }}
      defaultSelected={language}
      renderButtonContent={() => <IconLanguage size={22} color={'var(--gourmet-neutral-8)'} />}
      onSelect={(selected) => {
        setLanguage(selected);
      }}
    />
  );
}
