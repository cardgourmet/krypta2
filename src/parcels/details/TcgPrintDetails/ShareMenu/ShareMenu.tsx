import { Center, type MantineColor, Menu, Tooltip, UnstyledButton } from '@mantine/core';
import { IconCopy, IconLink, IconShare2 } from '@tabler/icons-react';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { slugify } from '@/parcels/slugify.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ShareMenu.module.css';

const routeApi = getRouteApi(`/$tcg/sets/$setCode/$collectorNumber/{-$any}`);

export function ShareMenu() {
  const { t } = useTranslation('details', { keyPrefix: 'share' });

  const tcg = useTcgByLocation() as Tcg;
  const [opened, setOpened] = useState(false);

  const { print: card } = routeApi.useLoaderData();

  const [tooltipOpened, setTooltipOpened] = useState(false);
  const [tooltipLabel, setTooltipLabel] = useState<string>('');
  const [tooltipColor, setTooltipColor] = useState<MantineColor>('gray');

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      openDelay={0}
      transitionProps={{ transition: 'pop', duration: 100 }}
      position={'bottom-end'}
      shadow="md"
      width={250}
    >
      <Menu.Target>
        <Tooltip
          label={tooltipLabel}
          opened={tooltipOpened}
          color={tooltipColor}
          withArrow
          transitionProps={{ transition: 'fade-up', duration: 200 }}
        >
          <UnstyledButton className={styles.quickActionButton}>
            <Center>
              <IconShare2 size={22} color={'var(--gourmet-neutral-8)'} />
            </Center>
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown style={{ backgroundColor: 'var(--gourmet-neutral-1)', borderColor: 'var(--gourmet-neutral-3)' }}>
        <Menu.Item
          leftSection={<IconCopy size={18} />}
          className={styles.menuItem}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(card.name);

              setTooltipLabel(t('success.copied'));
              setTooltipOpened(true);
              setTooltipColor('green');

              setTimeout(() => {
                setTooltipOpened(false);
              }, 3000);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <GourmetText cgmff={'ui'}>{t('options.copyName')}</GourmetText>
        </Menu.Item>
        {tcg === 'mtg' && (
          <Menu.Item
            leftSection={<IconCopy size={18} />}
            className={styles.menuItem}
            onClick={async () => {
              const setCode = card.print.setCode?.toLowerCase() as string;
              const cn = card.print.collectorNumber.toLowerCase();

              try {
                await navigator.clipboard.writeText(`1 ${card.name} (${setCode.toUpperCase()}) ${cn}`);

                setTooltipLabel(t('success.copied'));
                setTooltipOpened(true);
                setTooltipColor('green');

                setTimeout(() => {
                  setTooltipOpened(false);
                }, 3000);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            <GourmetText cgmff={'ui'}>{t('options.copyNameMTGA')}</GourmetText>
          </Menu.Item>
        )}
        <Menu.Item
          leftSection={<IconLink size={18} />}
          className={styles.menuItem}
          onClick={async () => {
            const set = card.print.setCode?.toLowerCase() as string;
            const cn = card.print.collectorNumber.toLowerCase();

            try {
              await navigator.clipboard.writeText(
                `${window.location.origin}/${tcg}/sets/${set}/${cn}/${slugify(card.name)}`,
              );

              setTooltipLabel(t('success.copied'));
              setTooltipOpened(true);
              setTooltipColor('green');

              setTimeout(() => {
                setTooltipOpened(false);
              }, 3000);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <GourmetText cgmff={'ui'}>{t('options.copyLink')}</GourmetText>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconShare2 size={18} />}
          className={styles.menuItem}
          onClick={async () => {
            const set = card.print.setCode?.toLowerCase() as string;
            const cn = card.print.collectorNumber.toLowerCase();
            const link = `${window.location.origin}/${tcg}/sets/${set}/${cn}/${slugify(card.name)}`;

            const shareData = {
              title: card.name,
              text: `Look what card I've found!`,
              url: link,
            };

            try {
              // use native share option if available
              await navigator.share(shareData);
            } catch (_) {
              // not available, just ignore.
              setTooltipLabel(t('failure.shareNotAvailable'));
              setTooltipOpened(true);
              setTooltipColor('red');

              setTimeout(() => {
                setTooltipOpened(false);
              }, 3000);
            }
          }}
        >
          <GourmetText cgmff={'ui'}>{t('options.shareWith')}</GourmetText>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
