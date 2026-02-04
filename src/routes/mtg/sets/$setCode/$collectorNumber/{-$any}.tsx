import { Button, Group, Image, Stack, Text } from '@mantine/core';
import { IconArrowRight, IconCalendar, IconDiamond, IconMagnetic, IconNumber, IconRefresh } from '@tabler/icons-react';
import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router';
import { type RefObject, useRef, useState } from 'react';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import { slugify } from '@/parcels/slugify.ts';
import { fetchMtgPrint, type MtgDataCard, type MtgDataPrintFace } from '@/parcels/tcg/mtg/api.ts';
import styles from './{-$any}.module.css';

export const Route = createFileRoute('/mtg/sets/$setCode/$collectorNumber/{-$any}')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const res = await fetchMtgPrint(params.setCode, params.collectorNumber);
    if (!res.data) return res;

    const cardWithPrints = res.data.data;
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
    return res;
  },
});

function RouteComponent() {
  const { setCode, collectorNumber, any } = Route.useParams();
  const cardWithPrints = Route.useLoaderData().data?.data as MtgDataCard;
  const frontFace = cardWithPrints.print.faces[0];
  const backFace = cardWithPrints.print.faces[1];

  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef<HTMLDivElement>(null);

  const otherPrints = cardWithPrints.allPrints.filter((c) => c.id !== cardWithPrints.print.id);

  return (
    <div className={styles.mainContent}>
      <Breadcrumbs subpage={'Sets'} moreSubpages={[cardWithPrints.print.setId.substring(0, 8), cardWithPrints.name]} />

      <p>Hello {`/mtg/sets/${setCode}/${collectorNumber}/${any}`}!</p>

      <Group align={'start'}>
        <Stack>
          <FlippableCard
            frontUrl={frontFace.translations.en.imageUrls?.full ?? ''}
            backUrl={backFace?.translations?.en?.imageUrls?.full ?? undefined}
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
                      any: slugify(cardWithPrints.name),
                    }}
                  >
                    <Image key={print.id} src={print.imageUrls?.full} style={{ width: '4rem', borderRadius: '12px' }} />
                  </Link>
                );
              })}
            </Group>
          )}
          {cardWithPrints.allPrints.length > 0 && (
            <Link to={'/'} style={{ textDecoration: 'none' }}>
              <Text fz={'sm'}>
                <Group gap={'xs'} style={{ color: 'var(--gourmet-blue-5)' }}>
                  Alle {cardWithPrints.allPrints.length} Prints ansehen{' '}
                  <IconArrowRight size={'var(--mantine-font-size-sm)'} />
                </Group>
              </Text>
            </Link>
          )}
        </Stack>
        <Group align={'start'}>
          <MtgCardFaceContentRenderer print={frontFace} />
          {backFace && <MtgCardFaceContentRenderer print={backFace} />}
        </Group>
        <Stack style={{ border: '1px dashed var(--gourmet-neutral-5)', flexGrow: '1', minHeight: '32rem' }}>
          <Stack style={{ border: '1px solid var(--gourmet-neutral-7)' }} gap={'xs'} p={'xs'}>
            <Group>
              <IconMagnetic size={32} />
              <Text ff={'var(--cgm-content-font-family)'} fz={'1.1rem'} c={'var(--gourmet-neutral-9)'}>
                {cardWithPrints.print.setId.substring(0, 8)}
              </Text>
            </Group>
            <Stack p={'sm'}>
              <Group gap={'xs'}>
                <IconNumber strokeWidth={'2'} />
                <Text>#{cardWithPrints.print.collectorNumber}</Text>
              </Group>
              <Group gap={'xs'}>
                <IconDiamond />
                <Text>{cardWithPrints.print.rarity}</Text>
              </Group>
              <Group gap={'xs'}>
                <IconCalendar />
                <Text>{cardWithPrints.print.releaseDate}</Text>
              </Group>
            </Stack>
          </Stack>
        </Stack>
      </Group>

      <p>{JSON.stringify(frontFace)}</p>
      <p>{JSON.stringify(backFace)}</p>
    </div>
  );
}

function MtgCardFaceContentRenderer({ print }: { print: MtgDataPrintFace }) {
  const trans = print.translations.en;
  const colorIndicator = print.colorIndicator.map((d) => `{${d}}`).join('/');

  const stats = [
    { label: 'power', value: print.power?.display },
    { label: 'toughness', value: print.toughness?.display },
    { label: 'loyalty', value: print.loyalty?.display },
    { label: 'defense', value: print.defense?.display },
  ];
  const statsFiltered = stats.filter((s) => s.value !== undefined);

  return (
    <Stack w={'20rem'} align={'start'} gap={'sm'} p={'sm'}>
      <Stack gap={'xs'}>
        <Text ff={'var(--cgm-content-font-family)'} fw={'bold'} fz={'1.1rem'} c={'var(--gourmet-neutral-9)'}>
          {trans.name}
        </Text>
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
