import { Divider, Group, Stack, Text } from '@mantine/core';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import { slugify } from '@/parcels/slugify.ts';
import { fetchMtgPrint, fetchMtgSet, type MtgDataCard, type MtgDataSet } from '@/parcels/tcg/mtg/api.ts';
import { MtgPrintFaceContentRenderer } from '@/routes/mtg/sets/$setCode/$collectorNumber/-components/MtgPrintFaceContentRenderer.tsx';
import { MtgPrintImageRenderer } from '@/routes/mtg/sets/$setCode/$collectorNumber/-components/MtgPrintImageRenderer.tsx';
import { MtgPrintMetaRenderer } from '@/routes/mtg/sets/$setCode/$collectorNumber/-components/MtgPrintMetaRenderer.tsx';
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
      <p style={{ wordWrap: 'break-word' }}>{JSON.stringify(cardWithPrints)}</p>
      <p style={{ wordWrap: 'break-word' }}>{JSON.stringify(set)}</p>
    </div>
  );
}
