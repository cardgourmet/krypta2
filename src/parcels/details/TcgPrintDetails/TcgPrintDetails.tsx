import { Button, Divider, Flex, Group, Image, Stack, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconArrowRight } from '@tabler/icons-react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import type { CardDetailsSearch } from '@/parcels/details/CardDetailsSearch.ts';
import { ForwardedToDetailsBanner } from '@/parcels/details/TcgPrintDetails/ForwardedToDetailsBanner/ForwardedToDetailsBanner.tsx';
import { type Legality, LegalityDisplay } from '@/parcels/details/TcgPrintDetails/LegalityDisplay/LegalityDisplay.tsx';
import { QuickActionButtons } from '@/parcels/details/TcgPrintDetails/QuickActionButtons/QuickActionButtons.tsx';
import { RulingsDisplay } from '@/parcels/details/TcgPrintDetails/RulingsDisplay/RulingsDisplay.tsx';
import { TcgPrintContent } from '@/parcels/details/TcgPrintDetails/TcgPrintContent/TcgPrintContent.tsx';
import { TcgPrintDetailsContext } from '@/parcels/details/TcgPrintDetails/TcgPrintDetailsContext.tsx';
import { TcgPrintMeta } from '@/parcels/details/TcgPrintDetails/TcgPrintMeta/TcgPrintMeta.tsx';
import { TcgPrintImageRenderer } from '@/parcels/details/TcgPrintImageRenderer.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { backupImageUrl } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { DlcDataPrint } from '@/parcels/tcg/dlc/api.ts';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg.ts';
import { getTranslatedName } from '@/parcels/tcg/helpers.ts';
import type { MtgDataCard, MtgDataPrint } from '@/parcels/tcg/mtg/api.ts';
import type { PcgDataPrint } from '@/parcels/tcg/pcg/api.ts';
import type { TcgDataPrint } from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export function TcgPrintDetails() {
  const tcg = useTcgByLocation() as Tcg;

  const routeApi = getRouteApi(`/$tcg/sets/$setCode/$collectorNumber/{-$any}`);
  const { print: card, set } = routeApi.useLoaderData();
  const { lang: printLanguage } = routeApi.useSearch() as CardDetailsSearch;

  const navigate = useNavigate();
  const setLanguage = useCallback(
    (lang: string, _: string) => {
      const thisPrint = card.print as TcgDataPrint;
      let specificPrint = thisPrint as TcgDataPrint;

      if (tcg === 'mtg') {
        const p = thisPrint as MtgDataPrint;

        if (!p.supportedLanguages.includes(lang)) {
          specificPrint = (card.allPrints.find((print) => print.supportedLanguages.includes(lang))
            ?? thisPrint) as TcgDataPrint;
        }
      } else if (tcg === 'pcg') {
        const p = thisPrint as PcgDataPrint;

        if (Object.keys(p.translations).includes(lang)) {
          specificPrint = (card.allPrints.find((print) => print.supportedLanguages.includes(lang))
            ?? thisPrint) as TcgDataPrint;
        }
      } else if (tcg === 'dlc') {
        const p = thisPrint as DlcDataPrint;

        if (Object.keys(p.translations).includes(lang)) {
          specificPrint = (card.allPrints.find((print) => print.supportedLanguages.includes(lang))
            ?? thisPrint) as TcgDataPrint;
        }
      }

      const specificParams = {
        setCode: specificPrint.setCode?.toLowerCase(),
        collectorNumber: specificPrint.collectorNumber.toLowerCase(),
        any: slugify(card.name),
      };

      let newLanguage: string | undefined = lang;
      if (lang === 'en') newLanguage = undefined;

      // noinspection JSIgnoredPromiseFromCall
      navigate({
        to: `/${tcg}/sets/$setCode/$collectorNumber/{-$any}`,
        params: specificParams,
        search: (prev) => {
          return { ...prev, lang: newLanguage } as CardDetailsSearch;
        },
      });
    },
    [navigate, card, tcg],
  );

  const { component, title } = useBreadcrumbs({
    subpage: '',
    moreSubpages: [
      {
        label: 'Sets',
        href: `/${tcg}/sets`,
      },
      {
        label: set.translations.en.name,
        href: `/${tcg}/sets/${set.code.toLowerCase()}`,
      },
      {
        label: getTranslatedName(tcg, card, printLanguage),
      },
    ],
  });

  const legalities: Legality[] = useMemo(() => {
    if (tcg === 'mtg') {
      const c = card as MtgDataCard;

      return Object.entries(c.print.legalities).map(([format, status]) => {
        return { format: format, status: status } as Legality;
      });
    }
    return [];
  }, [card, tcg]);
  const rulings: { date: string; text: string }[] = useMemo(() => {
    if (tcg === 'mtg') {
      const c = card as MtgDataCard;

      return c.rulings;
    }
    return [];
  }, [card, tcg]);

  const smallScreen = useMediaQuery('(max-width: 950px)');
  return (
    <TcgPrintDetailsContext value={{ lang: printLanguage }}>
      <div>
        <title>{`${card.name} (${set.translations?.en?.name} #${card.print.collectorNumber}) – ${getNameByTcg(tcg)} – Cardgourmet`}</title>
        {component}

        <Stack
          gap={'0'}
          style={{
            position: 'sticky',
            top: 'var(--navbar-height)',
            zIndex: 'var(--sticky-layer)',
            backgroundColor: 'var(--gourmet-neutral-0)',
          }}
          mb={'1rem'}
        >
          <Group justify={'space-between'} p={'0.5rem 0'} h={'3.5rem'}>
            <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
              {title?.label}
            </GourmetText>

            <QuickActionButtons />
          </Group>
          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
        </Stack>

        <ForwardedToDetailsBanner />

        <Group justify={smallScreen ? 'center' : 'start'}>
          <Flex
            align={'start'}
            wrap={'nowrap'}
            direction={smallScreen ? 'column' : 'row'}
            gap={smallScreen ? '1rem' : '0.1rem'}
            w={'100%'}
            maw={smallScreen ? '26rem' : ''}
          >
            <TcgPrintImageRenderer
              tcg={tcg}
              card={card}
              w={smallScreen ? '100%' : ''}
              align={smallScreen ? 'center' : 'start'}
              lang={printLanguage}
            />

            <TcgPrintContent tcg={tcg} card={card} />

            <TcgPrintMeta tcg={tcg} card={card} set={set} lang={printLanguage} setLang={setLanguage} />
          </Flex>
        </Group>

        <Group wrap={'nowrap'} align={'start'}>
          {legalities.length > 0 && <LegalityDisplay legalities={legalities} />}

          {rulings.length > 0 && <RulingsDisplay rulings={rulings} />}
        </Group>

        {/* TODO */}
        <Button
          onClick={() => {
            notifications.show({
              autoClose: 5_000,
              color: 'var(--gourmet-green-1)',
              message: (
                <Group wrap={'nowrap'} align={'stretch'}>
                  <Flex>
                    <div
                      style={{
                        aspectRatio: '672 / 936',
                        width: '4rem',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={
                          card.print.faces[0].translations.en.imageUrls?.thumbnail
                          ?? card.print.faces[0].translations.en.imageUrls?.full
                        }
                        style={{ borderRadius: '0.25rem' }}
                        fallbackSrc={backupImageUrl}
                      />
                    </div>
                  </Flex>
                  <Stack justify={'start'} gap={'0.25rem'}>
                    <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-green-1)'}>
                      Added to Favorites
                    </GourmetText>
                    <GourmetText fz={'0.9rem'}>
                      We've added <i>{card.name}</i> to the list.{' '}
                      <UnstyledButton>
                        <Group gap={'0.25rem'}>
                          <GourmetText cgmc={'neutral-9'} fz={'0.9rem'}>
                            Go there now
                          </GourmetText>
                          <IconArrowRight size={16} color={'var(--gourmet-neutral-9)'} />
                        </Group>
                      </UnstyledButton>
                    </GourmetText>
                  </Stack>
                </Group>
              ),
            });
          }}
        >
          Test Success
        </Button>
      </div>
    </TcgPrintDetailsContext>
  );
}
