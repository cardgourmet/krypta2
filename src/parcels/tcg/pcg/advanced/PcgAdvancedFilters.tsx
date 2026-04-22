import {Center, Loader, Overlay} from '@mantine/core';
import {IconBrush, IconMeteorFilled, IconNumbers, IconSparkles, IconTextSize, IconUserScan,} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {AdvancedFilterCategory} from '@/parcels/search/advanced/form/AdvancedFilterCategory.tsx';
import {AdvancedFormMultiCheckbox} from '@/parcels/search/advanced/form/AdvancedFormMultiCheckbox.tsx';
import {AdvancedFormMultiSelect} from '@/parcels/search/advanced/form/AdvancedFormMultiSelect.tsx';
import {AdvancedFormNumberCompare} from '@/parcels/search/advanced/form/AdvancedFormNumberCompare.tsx';
import {AdvancedFormText} from '@/parcels/search/advanced/form/AdvancedFormText.tsx';
import {getFilterValue, useFilterValue, useFilterValues} from '@/parcels/search/filter/useFilterValues.ts';
import {PcgEnergyColorless} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyColorless.tsx';
import {PcgEnergyDarkness} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyDarkness.tsx';
import {PcgEnergyDragon} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyDragon.tsx';
import {PcgEnergyFairy} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFairy.tsx';
import {PcgEnergyFighting} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFighting.tsx';
import {PcgEnergyFire} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFire.tsx';
import {PcgEnergyGrass} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyGrass.tsx';
import {PcgEnergyLightning} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyLightning.tsx';
import {PcgEnergyMetal} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyMetal.tsx';
import {PcgEnergyPsychic} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyPsychic.tsx';
import {PcgEnergyWater} from '@/parcels/tcg/pcg/icons/energy/PcgEnergyWater.tsx';

export function PcgAdvancedFilters() {
  const { t } = useTranslation('advanced', { keyPrefix: 'pcg' });
  const { t: ft } = useTranslation('advanced', { keyPrefix: 'pcg.filters' });

  const targetFilters = useMemo(
    () => ['basetype', 'energy', 'subtype', 'stage', 'ability', 'effect', 'rarity', 'setname', 'evolvesFrom'],
    [],
  );
  const { filterValues, isLoading } = useFilterValues('pcg', targetFilters);

  const setNamesMapped = useFilterValue(filterValues, 'setname');
  const evolvesFromMapped = useFilterValue(filterValues, 'evolvesFrom');
  const basetypes = getFilterValue(filterValues, 'basetype');
  const energyTypes = getFilterValue(filterValues, 'energy', (d) => d.value !== 'free');
  const subtypes = getFilterValue(filterValues, 'subtype');
  const evoStages = getFilterValue(filterValues, 'stage', (d) => d.value === 'evolution_stage');
  const abilityTypes = getFilterValue(filterValues, 'ability');
  const effectTypes = getFilterValue(filterValues, 'effect');
  const rarities = getFilterValue(filterValues, 'rarity');

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
        <AdvancedFormMultiCheckbox
          k={'basetype'}
          title={ft('basetype.title')}
          description={ft('basetype.description')}
          filter={'basetype'}
          data={basetypes}
        />
        <AdvancedFormMultiCheckbox
          k={'energy'}
          title={ft('energy.title')}
          description={ft('energy.description')}
          filter={'energy'}
          data={energyTypes}
          iconsMap={{
            colorless: <PcgEnergyColorless size={22} />,
            darkness: <PcgEnergyDarkness size={22} />,
            dragon: <PcgEnergyDragon size={22} />,
            fairy: <PcgEnergyFairy size={22} />,
            fighting: <PcgEnergyFighting size={22} />,
            fire: <PcgEnergyFire size={22} />,
            grass: <PcgEnergyGrass size={22} />,
            lightning: <PcgEnergyLightning size={22} />,
            metal: <PcgEnergyMetal size={22} />,
            psychic: <PcgEnergyPsychic size={22} />,
            water: <PcgEnergyWater size={22} />,
          }}
          exactDropdownValues={{ exact: ft('energy.exact'), contains: ft('energy.contains') }}
        />
        <AdvancedFormMultiSelect
          k={'subtype'}
          title={ft('subtype.title')}
          description={ft('subtype.description')}
          filter={'subtype'}
          data={subtypes}
          dropdownPlaceholder={ft('subtype.placeholder')}
        />
        <AdvancedFormMultiSelect
          k={'stage'}
          title={ft('stage.title')}
          description={ft('stage.description')}
          filter={'stage'}
          data={evoStages}
          dropdownPlaceholder={ft('stage.placeholder')}
        />
        <AdvancedFormMultiSelect
          k={'evolves'}
          title={ft('evolves.title')}
          description={ft('evolves.description')}
          filter={'evolves'}
          data={evolvesFromMapped}
          dropdownPlaceholder={ft('evolves.placeholder')}
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
          k={'ability'}
          title={ft('ability.title')}
          description={ft('ability.description')}
          filter={'ability'}
          data={abilityTypes}
          dropdownPlaceholder={ft('ability.placeholder')}
        />
        <AdvancedFormText
          k={'attack'}
          title={ft('attack.title')}
          description={ft('attack.description')}
          filter={'attack'}
          inputPlaceholder={ft('attack.placeholder')}
          checkboxLabel={ft('attack.checkboxLabel')}
          withCheckbox
        />
        <AdvancedFormMultiSelect
          k={'effect'}
          title={ft('effect.title')}
          description={ft('effect.description')}
          filter={'effect'}
          data={effectTypes}
          dropdownPlaceholder={ft('effect.placeholder')}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={t('categories.stats')} icon={<IconNumbers />}>
        <AdvancedFormNumberCompare k={'hp'} title={ft('hp.title')} description={ft('hp.description')} filter={'hp'} />
        <AdvancedFormNumberCompare
          k={'retreat'}
          title={ft('retreat.title')}
          description={ft('retreat.description')}
          filter={'retreat'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'release'} icon={<IconMeteorFilled />}>
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
