import { Divider, Stack, Text } from '@mantine/core';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import type { PcgDataCard, PcgDataPrint } from '@/parcels/tcg/pcg/api.ts';
import { PcgPrintContentAbility } from '@/parcels/tcg/pcg/details/PcgPrintContentRenderer/PcgPrintContentAbility.tsx';
import { PcgPrintContentAttack } from '@/parcels/tcg/pcg/details/PcgPrintContentRenderer/PcgPrintContentAttack.tsx';
import { PcgPrintContentName } from '@/parcels/tcg/pcg/details/PcgPrintContentRenderer/PcgPrintContentName.tsx';
import { PcgPrintContentStats } from '@/parcels/tcg/pcg/details/PcgPrintContentRenderer/PcgPrintContentStats.tsx';
import { PcgPrintContentTypeline } from '@/parcels/tcg/pcg/details/PcgPrintContentRenderer/PcgPrintContentTypeline.tsx';
import { renderRichPcgText } from '@/parcels/tcg/pcg/renderRichText.tsx';

export function PcgPrintContentRenderer({ card, print }: { card: PcgDataCard; print: PcgDataPrint }) {
  const trans = print.translations.en;

  return (
    <Stack w={'28rem'} align={'start'} gap={'lg'} p={'sm'}>
      <Stack gap={'xs'} style={{ width: '100%' }}>
        <PcgPrintContentName card={card} />
        <PcgPrintContentTypeline card={card} />
      </Stack>
      {trans.abilities.length > 0 && (
        <Stack gap={'sm'}>
          {trans.abilities.map((a) => {
            return <PcgPrintContentAbility key={a.name} ability={a} />;
          })}
        </Stack>
      )}
      {trans.attacks.length > 0 && (
        <Stack gap={'lg'}>
          {trans.attacks.map((a) => {
            return <PcgPrintContentAttack key={a.name} attack={a} />;
          })}
        </Stack>
      )}

      {trans.texts.length > 0 && (
        <Stack gap={'lg'}>
          {trans.texts.map((t) => (
            <Text key={t.length} ff={'var(--cgm-content-font-family)'}>
              {renderRichPcgText(t, true)}
            </Text>
          ))}
        </Stack>
      )}

      {trans.flavorText && (
        <>
          <Divider
            w={'95%'}
            style={{ alignSelf: 'center', marginBottom: '-0.5rem' }}
            color={'var(--gourmet-neutral-3)'}
          />
          <Typeset
            asChild
            block
            style={{ fontFamily: 'var(--cgm-serif-font-family)' }}
            variant="secondary"
            weight={500}
          >
            <em>{trans.flavorText}</em>
          </Typeset>
        </>
      )}

      <PcgPrintContentStats card={card} />
    </Stack>
  );
}
