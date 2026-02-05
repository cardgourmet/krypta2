import { Button, Divider, Group, Image, Stack, Text } from '@mantine/core';
import {
  IconArrowRight,
  IconBrush,
  IconCalendar,
  IconDiamond,
  IconLanguage,
  IconMagnetic,
  IconNumber,
  IconPlayCard,
  IconRefresh,
} from '@tabler/icons-react';
import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router';
import { type RefObject, useMemo, useRef, useState } from 'react';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import { slugify } from '@/parcels/slugify.ts';
import {
  fetchMtgPrint,
  fetchMtgSet,
  type MtgDataCard,
  type MtgDataPrint,
  type MtgDataPrintFace,
  type MtgDataSet,
} from '@/parcels/tcg/mtg/api.ts';
import { SymbolSVG } from '@/parcels/tcg/mtg/symbols.tsx';
import styles from './{-$any}.module.css';

export const Route = createFileRoute('/mtg/sets/$setCode/$collectorNumber/{-$any}')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const res = await fetchMtgPrint(params.setCode, params.collectorNumber);
    if (!res.data) {
      console.log('Could not fetch print', res);
      throw notFound();
    }
    const cardWithPrints = res.data;
    if (!cardWithPrints) {
      throw notFound();
    }
    const slug = slugify(cardWithPrints.name);
    if (params.any !== slug) {
      throw redirect({
        to: Route.to,
        params: {
          setCode: params.setCode,
          collectorNumber: params.collectorNumber,
          any: slug,
        },
        replace: true,
      });
    }

    const res2 = await fetchMtgSet(cardWithPrints.print.setId);
    if (!res2.data) {
      console.log('Could not fetch set', res2);
      throw notFound();
    }
    const printSet = res2.data;
    if (!printSet) {
      throw notFound();
    }

    return {
      print: cardWithPrints as MtgDataCard,
      set: printSet as MtgDataSet,
    };
  },
});

function RouteComponent() {
  const { print: cardWithPrints, set } = Route.useLoaderData();
  const frontFace = cardWithPrints.print.faces[0];
  const backFace = cardWithPrints.print.faces[1];

  return (
    <div className={styles.mainContent}>
      <Stack gap={'xs'}>
        <Breadcrumbs subpage={'Sets'} moreSubpages={[set.translations.en.name]} />
        <Text ff={'var(--cgm-title-font-family)'} fz={'1.5rem'} fw={'bold'}>
          {cardWithPrints.name}
        </Text>
      </Stack>

      <Divider my="lg" color={'var(--gourmet-neutral-3)'} />

      <Group align={'start'}>
        <MtgPrintImageRenderer card={cardWithPrints} />
        <Group align={'start'}>
          <MtgPrintFaceContentRenderer print={frontFace} />
          {backFace && <MtgPrintFaceContentRenderer print={backFace} />}
        </Group>
        <MtgPrintMetaRenderer print={cardWithPrints.print} set={set} />
      </Group>

      <p>
        <br />
        <br />
        <br />
        <br />
        <br />
      </p>
      <p>{JSON.stringify(frontFace)}</p>
      <p>{JSON.stringify(backFace)}</p>
    </div>
  );
}

function MtgPrintImageRenderer({ card }: { card: MtgDataCard }) {
  const front = card.print.faces[0];
  const back = card.print.faces[1];

  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef<HTMLDivElement>(null);

  const otherPrints = card.allPrints.filter((c) => c.id !== card.print.id);

  return (
    <Stack>
      <FlippableCard
        frontUrl={front.translations.en.imageUrls?.full ?? ''}
        backUrl={back?.translations?.en?.imageUrls?.full ?? undefined}
        flipRef={flipRef}
      />
      <Button
        onClick={() => {
          const newFlipped = !flipped;

          flipRef.current?.setAttribute('flipped', `${newFlipped}`);
          setFlipped(newFlipped);
        }}
        color={'var(--gourmet-neutral-2)'}
        c={'var(--gourmet-neutral-7)'}
      >
        <Group gap={'0.25rem'}>
          <IconRefresh size={18} />
          Transform
        </Group>
      </Button>

      {otherPrints.length > 0 && (
        <Group>
          {otherPrints.map((print) => {
            return (
              <Link
                key={print.id}
                to={'/mtg/sets/$setCode/$collectorNumber/{-$any}'}
                params={{
                  setCode: print.setCode.toLowerCase(),
                  collectorNumber: print.collectorNumber.toLowerCase(),
                  any: slugify(card.name),
                }}
              >
                <Image key={print.id} src={print.imageUrls?.full} style={{ width: '4rem', borderRadius: '4px' }} />
              </Link>
            );
          })}
        </Group>
      )}
      {card.allPrints.length > 0 && (
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <Group gap={'xs'}>
            <Text fz={'sm'} c={'var(--gourmet-blue-5)'}>
              Alle {card.allPrints.length} Prints ansehen
            </Text>
            <IconArrowRight style={{ color: 'var(--gourmet-blue-5)' }} size={'0.875rem'} />
          </Group>
        </Link>
      )}
    </Stack>
  );
}

function MtgPrintFaceContentRenderer({ print }: { print: MtgDataPrintFace }) {
  const trans = print.translations.en;
  const colorIndicator = print.colorIndicator.map((d) => `{${d}}`).join('/');

  const stats = [
    { label: 'power', value: print.power?.display },
    { label: 'toughness', value: print.toughness?.display },
    { label: 'loyalty', value: print.loyalty?.display },
    { label: 'defense', value: print.defense?.display },
  ];
  const statsFiltered = stats.filter((s) => s.value !== undefined);

  const manaCostParts = useMemo(() => {
    const manaDisplayRegex = /\{[^{}]}/g;

    return (
      print.manaDisplay?.match(manaDisplayRegex)?.map((m) => {
        return m;
      }) ?? []
    );
  }, [print.manaDisplay]);

  return (
    <Stack w={'20rem'} align={'start'} gap={'sm'} p={'sm'}>
      <Stack gap={'xs'} style={{ width: '100%' }}>
        <Group align={'start'} justify={'space-between'} style={{ width: '100%' }} wrap={'nowrap'}>
          <Text
            ff={'var(--cgm-content-font-family)'}
            fw={'bold'}
            fz={'1.1rem'}
            c={'var(--gourmet-neutral-9)'}
            style={{ flexGrow: 1 }}
          >
            {trans.name}
          </Text>
          <Group wrap={'nowrap'} gap={'0.2rem'} h={'calc(1rem * var(--mantine-line-height-md))'}>
            {manaCostParts.map((p, i) => (
              <SymbolSVG key={i} symbol={p as `{$string}`} size={16} />
            ))}
          </Group>
        </Group>
        <Text ff={'var(--cgm-content-font-family)'}>
          {colorIndicator.length > 0 ? `${colorIndicator} ` : ''}
          {trans.typeLine}
        </Text>
      </Stack>

      <Text ff={'var(--cgm-content-font-family)'}>{trans.flavorName}</Text>
      <Stack gap={'sm'}>
        {trans.oracleText?.split('\n').map((line, i) => (
          <Text ff={'var(--cgm-content-font-family)'} key={i}>
            {line}
          </Text>
        ))}
      </Stack>
      <Text>{trans.flavorText}</Text>

      {statsFiltered.length > 0 && (
        <Group>
          {statsFiltered.map((s) => {
            return (
              <Stack key={s.label} gap={'0.15rem'}>
                <Text ff={'var(--cgm-content-font-family)'} fz={'xs'} c={'var(--gourmet-neutral-6)'}>
                  {s.label.toUpperCase()}
                </Text>
                <Text ff={'var(--cgm-content-font-family)'} fz={'md'} fw={'bold'} c={'var(--gourmet-neutral-9)'}>
                  {s.value}
                </Text>
              </Stack>
            );
          })}
        </Group>
      )}
    </Stack>
  );
}

function MtgPrintMetaRenderer({ print, set }: { print: MtgDataPrint; set: MtgDataSet }) {
  return (
    <Stack
      style={{
        border: '1px dashed var(--gourmet-neutral-5)',
        flexGrow: '1',
        minHeight: '32rem',
        maxWidth: '16rem',
      }}
      p={'0.25rem'}
    >
      <Stack gap={'xs'}>
        <Link to={'/mtg/sets/$setCode'} params={{ setCode: set.code.toLowerCase() }} className={styles.setLink}>
          <Group gap={'xs'} wrap={'nowrap'} align={'start'}>
            <IconMagnetic size={32} />
            <Text ff={'var(--cgm-content-font-family)'} fz={'1rem'} c={'var(--gourmet-neutral-9)'}>
              {set.translations.en.name}
            </Text>
          </Group>
        </Link>
        <Group p={'sm'}>
          <Group gap={'xs'}>
            <IconNumber strokeWidth={'2'} />
            <Text>#{print.collectorNumber}</Text>
          </Group>
          <Group gap={'xs'}>
            <IconDiamond />
            <Text>{print.rarity}</Text>
          </Group>
          <Group gap={'xs'}>
            <IconCalendar />
            <Text>{print.releaseDate}</Text>
          </Group>

          <Divider my="xs" color={'var(--gourmet-neutral-2)'} w={'100%'} />

          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconPlayCard />
            <Text>{print.finishes.join(', ')}</Text>
          </Group>
          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconLanguage />
            <Text style={{ textWrap: 'wrap' }}>{print.supportedLanguages.join(', ')}</Text>
          </Group>

          <Divider my="xs" color={'var(--gourmet-neutral-2)'} w={'100%'} />

          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconBrush />
            <Text>{print.artist}</Text>
          </Group>
        </Group>
      </Stack>
    </Stack>
  );
}

function FlippableCard(props: { frontUrl: string; backUrl?: string; flipRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div className={styles.card}>
      <div className={styles.flippableContent} ref={props.flipRef}>
        <div>
          <Image src={props.frontUrl} style={{ borderRadius: '14px' }} />
        </div>
        {props.backUrl && (
          <div style={{ transform: 'rotateY(180deg)', height: '100%' }}>
            <Image src={props.backUrl} style={{ borderRadius: '14px' }} />
          </div>
        )}
      </div>
    </div>
  );
}
