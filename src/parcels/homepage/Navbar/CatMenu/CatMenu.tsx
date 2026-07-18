import { Center, Menu, Stack, UnstyledButton } from '@mantine/core';
import { IconCat } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './CatMenu.module.css';

export function CatMenu() {
  const { t } = useTranslation('nav');
  const [opened, setOpened] = useState(false);

  return (
    <Menu
      shadow="md"
      position={'bottom-end'}
      opened={opened}
      onChange={setOpened}
      width={140}
      transitionProps={{ transition: 'pop', duration: 100 }}
    >
      <Menu.Target>
        <UnstyledButton className={styles.iconButton}>
          <Center>
            <IconCat size={22} color={'var(--gourmet-neutral-8)'} />
          </Center>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          backgroundColor: 'var(--cgm-sidebar-bg)',
          border: '1px solid var(--cgm-sidebar-border)',
          borderRadius: '4px',
        }}
        p={'0.5rem'}
      >
        <Stack gap={'0.5rem'}>
          <Link to={'/about'} style={{ textDecoration: 'none' }} className={styles.subIconButton}>
            <GourmetText style={{ textWrap: 'nowrap' }} cgmff="ui">
              {t('about')}
            </GourmetText>
          </Link>
          <a
            href={'https://games.cardgourmet.com'}
            style={{ textDecoration: 'none' }}
            className={styles.subIconButton}
            target="_blank"
            rel="noreferrer noopener"
          >
            <GourmetText cgmff="ui">Games</GourmetText>
          </a>
          <a
            href={'https://discord.gg/5KQ6fh3nus'}
            style={{ textDecoration: 'none' }}
            className={styles.subIconButton}
            target="_blank"
            rel="noreferrer noopener"
          >
            <GourmetText cgmff="ui">Discord</GourmetText>
          </a>
          <a
            href={'https://github.com/cardgourmet'}
            style={{ textDecoration: 'none' }}
            className={styles.subIconButton}
            target="_blank"
            rel="noreferrer noopener"
          >
            <GourmetText cgmff="ui">Github</GourmetText>
          </a>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
