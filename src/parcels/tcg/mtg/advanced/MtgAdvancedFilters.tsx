import { Center, Loader, Overlay } from '@mantine/core';
import {
  IconBrush,
  IconMeteorFilled,
  IconNumbers,
  IconSparkles,
  IconTextSize,
  IconUserScan,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AdvancedFilterCategory } from '@/parcels/search/advanced/form/AdvancedFilterCategory.tsx';
import { AdvancedFormMultiCheckbox } from '@/parcels/search/advanced/form/AdvancedFormMultiCheckbox.tsx';
import { AdvancedFormMultiSelect } from '@/parcels/search/advanced/form/AdvancedFormMultiSelect.tsx';
import { AdvancedFormNumberCompare } from '@/parcels/search/advanced/form/AdvancedFormNumberCompare.tsx';
import { AdvancedFormText } from '@/parcels/search/advanced/form/AdvancedFormText.tsx';
import { getFilterValue, useFilterValue, useFilterValues } from '@/parcels/search/filter/useFilterValues.ts';
import { MtgSymbolSVG } from '@/parcels/tcg/mtg/details/MtgSymbolSVG/MtgSymbolSVG.tsx';

export function MtgAdvancedFilters() {
  const { t } = useTranslation('advanced', { keyPrefix: 'mtg' });
  const { t: ft } = useTranslation('advanced', { keyPrefix: 'mtg.filters' });

  const targetFilters = useMemo(() => ['type', 'color', 'keyword', 'rarity', 'format', 'game', 'setname'], []);
  const { filterValues, isLoading } = useFilterValues('mtg', targetFilters);

  const setNamesMapped = useFilterValue(filterValues, 'setname');
  const typesMapped = useFilterValue(filterValues, 'type', (d) => d.type === 'sub_type');
  const keywordsMapped = useFilterValue(filterValues, 'keyword');
  const colors = getFilterValue(filterValues, 'color', (d) => d.type === 'color');
  const rarities = getFilterValue(filterValues, 'rarity');
  const formats = getFilterValue(filterValues, 'format');
  const games = getFilterValue(filterValues, 'game');

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
          data={typesMapped}
          dropdownPlaceholder={ft('type.placeholder')}
        />
        <AdvancedFormMultiCheckbox
          k={'color'}
          title={ft('color.title')}
          description={ft('color.description')}
          filter={'color'}
          data={colors}
          iconsMap={{
            colorless: <MtgSymbolSVG symbol={'{C}'} size={24} />,
            black: <MtgSymbolSVG symbol={'{B}'} size={24} />,
            blue: <MtgSymbolSVG symbol={'{U}'} size={24} />,
            red: <MtgSymbolSVG symbol={'{R}'} size={24} />,
            white: <MtgSymbolSVG symbol={'{W}'} size={24} />,
            green: <MtgSymbolSVG symbol={'{G}'} size={24} />,
          }}
          exactDropdownValues={{ exact: ft('color.exact'), contains: ft('color.contains') }}
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
      <AdvancedFilterCategory title={t('categories.effect')} icon={<IconSparkles />}>
        <AdvancedFormMultiSelect
          k={'keyword'}
          title={ft('keyword.title')}
          description={ft('keyword.description')}
          filter={'keyword'}
          data={keywordsMapped}
          dropdownPlaceholder={ft('keyword.placeholder')}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={t('categories.stats')} icon={<IconNumbers />}>
        <AdvancedFormNumberCompare k={'cmc'} title={ft('cmc.title')} description={ft('cmc.title')} filter={'cmc'} />
        <AdvancedFormNumberCompare
          k={'power'}
          title={ft('power.title')}
          description={ft('power.description')}
          filter={'power'}
        />
        <AdvancedFormNumberCompare
          k={'toughness'}
          title={ft('toughness.title')}
          description={ft('toughness.description')}
          filter={'toughness'}
        />
        <AdvancedFormNumberCompare
          k={'loyalty'}
          title={ft('loyalty.title')}
          description={ft('loyalty.description')}
          filter={'loyalty'}
        />
        <AdvancedFormNumberCompare
          k={'defense'}
          title={ft('defense.title')}
          description={ft('defense.description')}
          filter={'defense'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={t('categories.release')} icon={<IconMeteorFilled />}>
        <AdvancedFormMultiSelect
          k={'sets'}
          title={ft('sets.title')}
          description={ft('sets.description')}
          filter={'setname'}
          data={setNamesMapped}
          dropdownPlaceholder={ft('sets.placeholder')}
        />
        <AdvancedFormMultiSelect
          k={'rarity'}
          title={ft('rarity.title')}
          description={ft('rarity.description')}
          filter={'rarity'}
          data={rarities}
          withoutLimit
          dropdownPlaceholder={ft('rarity.placeholder')}
        />
        <AdvancedFormMultiSelect
          k={'format'}
          title={ft('format.title')}
          description={ft('format.description')}
          filter={'game'}
          data={formats}
          dropdownPlaceholder={ft('format.placeholder')}
        />
        <AdvancedFormMultiSelect
          k={'games'}
          title={ft('games.title')}
          description={ft('games.description')}
          filter={'game'}
          data={games}
          dropdownPlaceholder={ft('games.placeholder')}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={t('categories.artwork')} icon={<IconBrush />}>
        <AdvancedFormText
          k={'artist'}
          title={ft('artist.title')}
          description={ft('artist.description')}
          filter={'artist'}
          inputPlaceholder={ft('artist.placeholder')}
          checkboxLabel={ft('artist.checkboxLabel')}
          withCheckbox
        />
      </AdvancedFilterCategory>
    </>
  );
}
