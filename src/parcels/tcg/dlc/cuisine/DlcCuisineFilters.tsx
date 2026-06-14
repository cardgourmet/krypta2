import { Center, Loader, Overlay } from '@mantine/core';
import { IconBrush, IconMeteorFilled, IconNumbers, IconTextSize, IconUserScan } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getFilterValue, useFilterValues } from '@/parcels/search/filter/useFilterValues.ts';
import { KitchenCategory } from '@/parcels/search/kitchen/form/KitchenCategory.tsx';
import { KitchenFormMultiSelect } from '@/parcels/search/kitchen/form/KitchenFormMultiSelect.tsx';
import { KitchenFormNumberCompare } from '@/parcels/search/kitchen/form/KitchenFormNumberCompare.tsx';
import { KitchenFormText } from '@/parcels/search/kitchen/form/KitchenFormText.tsx';
import { KitchhenFormMultiCheckbox } from '@/parcels/search/kitchen/form/KitchhenFormMultiCheckbox.tsx';
import { DlcInkAmber } from '@/parcels/tcg/dlc/icons/ink/DlcInkAmber.tsx';
import { DlcInkAmethyst } from '@/parcels/tcg/dlc/icons/ink/DlcInkAmethyst.tsx';
import { DlcInkEmerald } from '@/parcels/tcg/dlc/icons/ink/DlcInkEmerald.tsx';
import { DlcInkRuby } from '@/parcels/tcg/dlc/icons/ink/DlcInkRuby.tsx';
import { DlcInkSapphire } from '@/parcels/tcg/dlc/icons/ink/DlcInkSapphire.tsx';
import { DlcInkSteel } from '@/parcels/tcg/dlc/icons/ink/DlcInkSteel.tsx';
import { DlcRarityCommon } from '@/parcels/tcg/dlc/icons/rarity/DlcRarityCommon.tsx';
import { DlcRarityEnchanted } from '@/parcels/tcg/dlc/icons/rarity/DlcRarityEnchanted.tsx';
import { DlcRarityLegendary } from '@/parcels/tcg/dlc/icons/rarity/DlcRarityLegendary.tsx';
import { DlcRarityRare } from '@/parcels/tcg/dlc/icons/rarity/DlcRarityRare.tsx';
import { DlcRaritySuperRare } from '@/parcels/tcg/dlc/icons/rarity/DlcRaritySuperRare.tsx';
import { DlcRarityUncommon } from '@/parcels/tcg/dlc/icons/rarity/DlcRarityUncommon.tsx';

export function DlcCuisineFilters() {
  const { t } = useTranslation('cuisine', { keyPrefix: 'dlc' });
  const { t: ft } = useTranslation('cuisine', { keyPrefix: 'dlc.filters' });

  const targetFilters = useMemo(() => ['type', 'ink', 'rarity', 'setname', 'franchise'], []);
  const { filterValues, isLoading } = useFilterValues('dlc', targetFilters);

  const types = getFilterValue(filterValues, 'type', (d) => d.type === 'type', 'type');
  const classifications = getFilterValue(filterValues, 'type', (d) => d.type === 'classification', 'class');
  const inks = getFilterValue(filterValues, 'ink', (d) => d.value !== 'none');
  const rarities = getFilterValue(filterValues, 'rarity');
  const setnames = getFilterValue(filterValues, 'setname');
  const franchises = getFilterValue(filterValues, 'franchise', (d) => d.type === 'name');

  return (
    <>
      {isLoading && (
        <div style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'absolute' }}>
          <Overlay backgroundOpacity={0.75} color={'var(--gourmet-neutral-0)'}>
            <Center mt={'12rem'}>
              <Loader color={'var(--gourmet-neutral-9)'} />
            </Center>
          </Overlay>
        </div>
      )}
      <KitchenCategory title={t('categories.identity')} icon={<IconUserScan />}>
        <KitchenFormMultiSelect
          k={'type'}
          title={ft('type.title')}
          description={ft('type.description')}
          filter={'type'}
          data={[
            {
              group: ft('type.dataGroups.types'),
              items: types,
            },
            {
              group: ft('type.dataGroups.classifications'),
              items: classifications,
            },
          ]}
          dropdownPlaceholder={ft('type.placeholder')}
        />
        <KitchhenFormMultiCheckbox
          k={'ink'}
          title={ft('ink.title')}
          description={ft('ink.description')}
          filter={'ink'}
          data={inks}
          iconsMap={{
            amber: <DlcInkAmber size={32} color={'#f0b11d'} />,
            amethyst: <DlcInkAmethyst size={32} color={'#80397b'} />,
            emerald: <DlcInkEmerald size={32} color={'#2b8a42'} />,
            ruby: <DlcInkRuby size={32} color={'#d02031'} />,
            sapphire: <DlcInkSapphire size={32} color={'#0b87c1'} />,
            steel: <DlcInkSteel size={32} color={'#9da7b1'} />,
          }}
          exactDropdownValues={{ exact: ft('ink.exact'), contains: ft('ink.contains') }}
        />
      </KitchenCategory>
      <KitchenCategory title={t('categories.text')} icon={<IconTextSize />}>
        <KitchenFormText
          k={'name'}
          title={ft('name.title')}
          description={ft('name.description')}
          filter={'text'}
          inputPlaceholder={ft('name.placeholder')}
          checkboxLabel={ft('name.checkboxLabel')}
          withCheckbox
        />
        <KitchenFormText
          k={'text'}
          title={ft('text.title')}
          description={ft('text.description')}
          filter={'text'}
          inputPlaceholder={ft('text.placeholder')}
          checkboxLabel={ft('text.checkboxLabel')}
          withCheckbox
        />
        <KitchenFormText
          k={'flavortext'}
          title={ft('flavortext.title')}
          description={ft('flavortext.description')}
          filter={'flavortext'}
          inputPlaceholder={ft('flavortext.placeholder')}
          checkboxLabel={ft('flavortext.checkboxLabel')}
          withCheckbox
        />
      </KitchenCategory>
      <KitchenCategory title={t('categories.stats')} icon={<IconNumbers />}>
        <KitchenFormNumberCompare
          k={'strength'}
          title={ft('strength.title')}
          description={ft('strength.description')}
          filter={'strength'}
        />
        <KitchenFormNumberCompare
          k={'willpower'}
          title={ft('willpower.title')}
          description={ft('willpower.description')}
          filter={'willpower'}
        />
        <KitchenFormNumberCompare
          k={'movecost'}
          title={ft('movecost.title')}
          description={ft('movecost.description')}
          filter={'movecost'}
        />
        <KitchenFormNumberCompare
          k={'lore'}
          title={ft('lore.title')}
          description={ft('lore.description')}
          filter={'lore'}
        />
      </KitchenCategory>
      <KitchenCategory title={t('categories.release')} icon={<IconMeteorFilled />}>
        <KitchenFormMultiSelect
          k={'sets'}
          title={ft('sets.title')}
          description={ft('sets.description')}
          filter={'setname'}
          data={setnames}
          dropdownPlaceholder={ft('sets.placeholder')}
        />
        <KitchhenFormMultiCheckbox
          k={'rarity'}
          title={ft('rarity.title')}
          description={ft('rarity.description')}
          filter={'rarity'}
          data={rarities}
          iconsMap={{
            common: <DlcRarityCommon size={20} />,
            uncommon: <DlcRarityUncommon size={20} />,
            rare: <DlcRarityRare size={20} />,
            super_rare: <DlcRaritySuperRare size={20} />,
            legendary: <DlcRarityLegendary size={20} />,
            enchanted: <DlcRarityEnchanted size={20} />,
          }}
        />
      </KitchenCategory>
      <KitchenCategory title={t('categories.artist')} icon={<IconBrush />}>
        <KitchenFormText
          k={'artist'}
          title={ft('artist.title')}
          description={ft('artist.description')}
          filter={'artist'}
          inputPlaceholder={ft('artist.placeholder')}
          checkboxLabel={ft('artist.checkboxLabel')}
          withCheckbox
        />
        <KitchenFormMultiSelect
          k={'franchise'}
          title={ft('franchise.title')}
          description={ft('franchise.description')}
          filter={'franchise'}
          data={franchises}
          withoutLimit
          dropdownPlaceholder={ft('franchise.placeholder')}
        />
      </KitchenCategory>
    </>
  );
}
