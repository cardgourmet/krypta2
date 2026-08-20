import { Loader } from '@mantine/core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IconCheck, IconLanguage } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext';
import { updateUserSettings } from '@/parcels/auth/api';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification';
import { useUserLanguage } from '@/parcels/state/useUserLanguage';

export const LanguageSelectorDropdown = () => {
  const { user, updateUser } = useAuth();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useUserLanguage();

  const [isLoading, setLoading] = useState(false);

  const handleLanguageSelected = async (language: 'de' | 'en') => {
    i18n.changeLanguage(language);
    setLanguage(language);

    if (!user) return;

    const res = await updateUserSettings({
      ...user.settings,
      preferredLanguages: { ...user.settings.preferredLanguages, global: language },
    });

    if (res.error) {
      sendErrorNotification(res.error);
    } else if (res.data) {
      updateUser(res.data);
    }
  };

  const handleSyncChanged = async (syncEnabled: boolean) => {
    setLoading(true);

    const res = await updateUserSettings({
      ...user?.settings,
      preferredLanguages: { ...user?.settings.preferredLanguages, syncLanguages: syncEnabled },
    });

    if (res.error) {
      sendErrorNotification(res.error);
    } else if (res.data) {
      updateUser(res.data);
    }

    setLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton>
          <IconLanguage />
        </ActionButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild align="end" sideOffset={-4}>
        <Menu>
          <DropdownMenuRadioGroup
            onValueChange={async (value) => await handleLanguageSelected(value as 'de' | 'en')}
            value={language}
          >
            <Menu.DropdownRadioItem value="en">English</Menu.DropdownRadioItem>
            <Menu.DropdownRadioItem value="de">Deutsch</Menu.DropdownRadioItem>
          </DropdownMenuRadioGroup>

          {user && (
            <>
              <Menu.DropdownSeparator />

              <Menu.DropdownItem
                icon={
                  isLoading ? (
                    <Loader size={16} />
                  ) : (
                    user.settings.preferredLanguages?.syncLanguages && <IconCheck color="var(--cgm-color-brand)" />
                  )
                }
                onClick={async (event) => {
                  event.preventDefault();
                  await handleSyncChanged(!user.settings.preferredLanguages?.syncLanguages);
                }}
              >
                Sync with TCGs
              </Menu.DropdownItem>
              <Typeset
                block
                size="sm"
                style={{ hyphens: 'auto', maxWidth: '30ch', padding: '0 0.5rem' }}
                variant="secondary"
              >
                If enabled, we use your selected language as the preferred print language when searching cards.
              </Typeset>
            </>
          )}
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
