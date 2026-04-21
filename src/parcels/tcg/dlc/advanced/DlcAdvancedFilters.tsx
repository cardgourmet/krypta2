import {Center, Loader, Overlay} from '@mantine/core';
import {IconBrush, IconMeteorFilled, IconNumbers, IconTextSize, IconUserScan} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {capitalizeFirstLetter} from '@/parcels/capitalizeFirstLetter.ts';
import {AdvancedFilterCategory} from '@/parcels/search/advanced/form/AdvancedFilterCategory.tsx';
import {AdvancedFormMultiCheckbox} from '@/parcels/search/advanced/form/AdvancedFormMultiCheckbox.tsx';
import {AdvancedFormMultiSelect} from '@/parcels/search/advanced/form/AdvancedFormMultiSelect.tsx';
import {AdvancedFormNumberCompare} from '@/parcels/search/advanced/form/AdvancedFormNumberCompare.tsx';
import {AdvancedFormText} from '@/parcels/search/advanced/form/AdvancedFormText.tsx';
import {useFilterValues} from '@/parcels/search/filter/useFilterValues.ts';
import {DlcInkAmber} from '@/parcels/tcg/dlc/icons/ink/DlcInkAmber.tsx';
import {DlcInkAmethyst} from '@/parcels/tcg/dlc/icons/ink/DlcInkAmethyst.tsx';
import {DlcInkEmerald} from '@/parcels/tcg/dlc/icons/ink/DlcInkEmerald.tsx';
import {DlcInkRuby} from '@/parcels/tcg/dlc/icons/ink/DlcInkRuby.tsx';
import {DlcInkSapphire} from '@/parcels/tcg/dlc/icons/ink/DlcInkSapphire.tsx';
import {DlcInkSteel} from '@/parcels/tcg/dlc/icons/ink/DlcInkSteel.tsx';
import {DlcRarityCommon} from '@/parcels/tcg/dlc/icons/rarity/DlcRarityCommon.tsx';
import {DlcRarityEnchanted} from '@/parcels/tcg/dlc/icons/rarity/DlcRarityEnchanted.tsx';
import {DlcRarityLegendary} from '@/parcels/tcg/dlc/icons/rarity/DlcRarityLegendary.tsx';
import {DlcRarityRare} from '@/parcels/tcg/dlc/icons/rarity/DlcRarityRare.tsx';
import {DlcRaritySuperRare} from '@/parcels/tcg/dlc/icons/rarity/DlcRaritySuperRare.tsx';
import {DlcRarityUncommon} from '@/parcels/tcg/dlc/icons/rarity/DlcRarityUncommon.tsx';

export function DlcAdvancedFilters() {
  const { t } = useTranslation('advanced', { keyPrefix: 'dlc' });
  const { t: ft } = useTranslation('advanced', { keyPrefix: 'dlc.filters' });

  const targetFilters = useMemo(() => ['type', 'ink', 'rarity', 'setname', 'franchise'], []);
  const { filterValues, isLoading } = useFilterValues('dlc', targetFilters);

  const dlcTypes =
    filterValues?.type
      ?.filter((d) => d.type === 'type')
      .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) })) ?? [];
  const dlcClassifications =
    filterValues?.type
      ?.filter((d) => d.type === 'classification')
      .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) })) ?? [];
  const dlcInks =
    filterValues?.ink
      ?.filter((d) => d.value !== 'none')
      .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) })) ?? [];
  const dlcRarities =
    filterValues?.rarity?.map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) })) ?? [];
  const dlcSetnames =
    filterValues?.setname?.map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) })) ?? [];
  const dlcFranchises =
    filterValues?.franchise
      ?.filter((d) => d.type === 'name')
      .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) })) ?? [];

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
      <AdvancedFilterCategory title={t('categories.identity')} icon={<IconUserScan />}>
        <AdvancedFormMultiSelect
          k={'type'}
          title={ft('type.title')}
          description={ft('type.description')}
          filter={'type'}
          data={[
            {
              group: ft('type.dataGroups.types'),
              items: dlcTypes,
            },
            {
              group: ft('type.dataGroups.classifications'),
              items: dlcClassifications,
            },
          ]}
          dropdownPlaceholder={ft('type.placeholder')}
        />
        <AdvancedFormMultiCheckbox
          k={'ink'}
          title={ft('ink.title')}
          description={ft('ink.description')}
          filter={'ink'}
          data={dlcInks}
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
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={t('categories.text')} icon={<IconTextSize />}>
        <AdvancedFormText
          k={'name'}
          title={ft('name.title')}
          description={ft('name.description')}
          filter={'text'}
          inputPlaceholder={ft('name.placeholder')}
          checkboxLabel={ft('name.checkboxLabel')}
          withCheckbox
        />
        <AdvancedFormText
          k={'text'}
          title={ft('text.title')}
          description={ft('text.description')}
          filter={'text'}
          inputPlaceholder={ft('text.placeholder')}
          checkboxLabel={ft('text.checkboxLabel')}
          withCheckbox
        />
        <AdvancedFormText
          k={'flavortext'}
          title={ft('flavortext.title')}
          description={ft('flavortext.description')}
          filter={'flavortext'}
          inputPlaceholder={ft('flavortext.placeholder')}
          checkboxLabel={ft('flavortext.checkboxLabel')}
          withCheckbox
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={t('categories.stats')} icon={<IconNumbers />}>
        <AdvancedFormNumberCompare
          k={'strength'}
          title={ft('strength.title')}
          description={ft('strength.description')}
          filter={'strength'}
        />
        <AdvancedFormNumberCompare
          k={'willpower'}
          title={ft('willpower.title')}
          description={ft('willpower.description')}
          filter={'willpower'}
        />
        <AdvancedFormNumberCompare
          k={'movecost'}
          title={ft('movecost.title')}
          description={ft('movecost.description')}
          filter={'movecost'}
        />
        <AdvancedFormNumberCompare
          k={'lore'}
          title={ft('lore.title')}
          description={ft('lore.description')}
          filter={'lore'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={t('categories.release')} icon={<IconMeteorFilled />}>
        <AdvancedFormMultiSelect
          k={'sets'}
          title={ft('sets.title')}
          description={ft('sets.description')}
          filter={'setname'}
          data={dlcSetnames}
          dropdownPlaceholder={ft('sets.placeholder')}
        />
        <AdvancedFormMultiCheckbox
          k={'rarity'}
          title={ft('rarity.title')}
          description={ft('rarity.description')}
          filter={'rarity'}
          data={dlcRarities}
          iconsMap={{
            common: <DlcRarityCommon size={20} />,
            uncommon: <DlcRarityUncommon size={20} />,
            rare: <DlcRarityRare size={20} />,
            super_rare: <DlcRaritySuperRare size={20} />,
            legendary: <DlcRarityLegendary size={20} />,
            enchanted: <DlcRarityEnchanted size={20} />,
          }}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={t('categories.artist')} icon={<IconBrush />}>
        <AdvancedFormText
          k={'artist'}
          title={ft('artist.title')}
          description={ft('artist.description')}
          filter={'artist'}
          inputPlaceholder={ft('artist.placeholder')}
          checkboxLabel={ft('artist.checkboxLabel')}
          withCheckbox
        />
        <AdvancedFormMultiSelect
          k={'franchise'}
          title={ft('franchise.title')}
          description={ft('franchise.description')}
          filter={'franchise'}
          data={dlcFranchises}
          withoutLimit
          dropdownPlaceholder={ft('franchise.placeholder')}
        />
      </AdvancedFilterCategory>
    </>
  );
}
