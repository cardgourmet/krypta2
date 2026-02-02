import {
  IconBrush,
  IconMeteorFilled,
  IconNumbers,
  IconSparkles,
  IconTextSize,
  IconUserScan,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import {
  AdvancedMultiCheckboxFilter,
  AdvancedMultiSelectFilter,
  AdvancedNumberFilter,
  AdvancedTextFilter,
} from '@/parcels/search/advanced/advancedFilters.tsx';
import type { AdvancedFilterCategory } from '@/parcels/search/advanced/types.ts';
import { constructPcgQuery } from '@/parcels/tcg/pcg/advanced/constructPcgQuery.ts';
import { createDefaultFormData, type PcgAdvancedFilterFormData } from '@/parcels/tcg/pcg/advanced/formData.ts';
import { PcgEnergyColorless } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyColorless.tsx';
import { PcgEnergyDarkness } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyDarkness.tsx';
import { PcgEnergyDragon } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyDragon.tsx';
import { PcgEnergyFairy } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFairy.tsx';
import { PcgEnergyFighting } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFighting.tsx';
import { PcgEnergyFire } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFire.tsx';
import { PcgEnergyGrass } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyGrass.tsx';
import { PcgEnergyLightning } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyLightning.tsx';
import { PcgEnergyMetal } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyMetal.tsx';
import { PcgEnergyPsychic } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyPsychic.tsx';
import { PcgEnergyWater } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyWater.tsx';
import { PcgRarityCommon } from '@/parcels/tcg/pcg/icons/rarity/PcgRarityCommon.tsx';
import { PcgRarityDoubleRare } from '@/parcels/tcg/pcg/icons/rarity/PcgRarityDoubleRare.tsx';
import { PcgRarityHyperRare } from '@/parcels/tcg/pcg/icons/rarity/PcgRarityHyperRare.tsx';
import { PcgRarityIllustrationRare } from '@/parcels/tcg/pcg/icons/rarity/PcgRarityIllustrationRare.tsx';
import { PcgRarityRare } from '@/parcels/tcg/pcg/icons/rarity/PcgRarityRare.tsx';
import { PcgRaritySpecialIllustrationRare } from '@/parcels/tcg/pcg/icons/rarity/PcgRaritySpecialIllustrationRare.tsx';
import { PcgRarityUltraRare } from '@/parcels/tcg/pcg/icons/rarity/PcgRarityUltraRare.tsx';
import { PcgRarityUncommon } from '@/parcels/tcg/pcg/icons/rarity/PcgRarityUncommon.tsx';
import {
  abilityTypes,
  baseTypes,
  effectTypes,
  energyTypes,
  evolvesFromName,
  evoStages,
  rarities,
  setNames,
  subTypes,
} from '@/parcels/tcg/pcg/raw/apiValues.ts';

export function usePcgAdvancedFilters() {
  const [formData, setFormData] = useState<PcgAdvancedFilterFormData>(createDefaultFormData());
  const constructedQueryFilters = useMemo(() => {
    return constructPcgQuery(formData);
  }, [formData]);
  const resetFilters = () => {
    setFormData(createDefaultFormData());
  };

  const setNamesMapped = useMemo(() => {
    return setNames.data.values.map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });
  }, []);
  const evolvesFromMapped = useMemo(() => {
    return evolvesFromName.data.values.map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });
  }, []);

  const filtersByCategory = useMemo<Record<string, AdvancedFilterCategory>>(
    () => ({
      identity: {
        icon: <IconUserScan />,
        filters: [
          {
            key: 'basetype',
            title: 'Basistyp',
            description: 'Art der Karte',
            filter: 'basetype',
            component: (
              <AdvancedMultiCheckboxFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'basetype'}
                data={baseTypes.data.values.map((d) => {
                  return { value: d.value, label: capitalizeFirstLetter(d.value) };
                })}
              />
            ),
          },
          {
            key: 'energy',
            title: 'Energie',
            description: 'Sorte der Energie, gekennzeichnet durch ein Symbol auf der Karte',
            filter: 'energy',
            component: (
              <AdvancedMultiCheckboxFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'energy'}
                data={energyTypes.data.values
                  .filter((d) => d.value !== 'free')
                  .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
                iconsMap={{
                  colorless: <PcgEnergyColorless size={32} />,
                  darkness: <PcgEnergyDarkness size={32} />,
                  dragon: <PcgEnergyDragon size={32} />,
                  fairy: <PcgEnergyFairy size={32} />,
                  fighting: <PcgEnergyFighting size={32} />,
                  fire: <PcgEnergyFire size={32} />,
                  grass: <PcgEnergyGrass size={32} />,
                  lightning: <PcgEnergyLightning size={32} />,
                  metal: <PcgEnergyMetal size={32} />,
                  psychic: <PcgEnergyPsychic size={32} />,
                  water: <PcgEnergyWater size={32} />,
                }}
                exactDropdownValues={{ true: 'Genau diese Energien', false: 'Enthält eine dieser Energien' }}
              />
            ),
          },
          {
            key: 'subtype',
            title: 'Subtyp',
            description: 'Unterart des Basistypen für speziellere Karten',
            filter: 'subtype',
            component: (
              <AdvancedMultiSelectFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'subtype'}
                data={subTypes.data.values.map((d) => {
                  return { value: d.value, label: capitalizeFirstLetter(d.value) };
                })}
                dropdownPlaceholder={'Gib einen Subtypen ein oder wähle einen'}
              />
            ),
          },
          {
            key: 'stage',
            title: 'Entwicklungsstufe',
            description: 'Die Entwicklungsstufe der Karte',
            filter: 'stage',
            component: (
              <AdvancedMultiSelectFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'stage'}
                data={evoStages.data.values.map((d) => {
                  return { value: d.value, label: capitalizeFirstLetter(d.value) };
                })}
                dropdownPlaceholder={'Gib eine Entwicklungsstufe ein oder wähle einen'}
              />
            ),
          },
          {
            key: 'evolves',
            title: 'Entwicklung',
            description: 'Name der Karte, aus der sich diese Karte entwickeln kann, falls vorhanden',
            filter: 'evolves',
            component: (
              <AdvancedMultiSelectFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'evolves'}
                data={evolvesFromMapped}
                dropdownPlaceholder={'Gib ein Pokémon ein oder wähle eins'}
              />
            ),
          },
        ],
      },
      text: {
        icon: <IconTextSize />,
        filters: [
          {
            key: 'name',
            title: 'Kartenname',
            description: 'Irgendein Wort, das im Namen der Karte vorkommt',
            filter: 'name',
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'name'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "tuff"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
          {
            key: 'text',
            title: 'Text',
            description: 'Irgendeine Wortfolge, die im Text der Karte vorkommt',
            filter: 'text',
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'text'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "Round"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
          {
            key: 'flavortext',
            title: 'Flavortext',
            description: 'Irgendein Wort, das im Flavortext der Karte vorkommt, falls einer existiert',
            filter: 'flavortext',
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'flavortext'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "fine fur"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
        ],
      },
      effect: {
        icon: <IconSparkles />,
        filters: [
          {
            key: 'ability',
            title: 'Fähigkeit',
            description: '',
            filter: 'ability',
            component: (
              <AdvancedMultiSelectFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'ability'}
                data={abilityTypes.data.values.map((d) => {
                  return { value: d.value, label: capitalizeFirstLetter(d.value) };
                })}
                dropdownPlaceholder={'Gib einen Fähigkeitstypen ein oder wähle einen'}
              />
            ),
          },
          {
            key: 'attack',
            title: 'Angriff',
            description: '',
            filter: 'attack',
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'attack'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "Psybeam"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
          {
            key: 'effect',
            title: 'Effekt',
            description: '',
            filter: 'effect',
            component: (
              <AdvancedMultiSelectFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'effect'}
                data={effectTypes.data.values.map((d) => {
                  return { value: d.value, label: capitalizeFirstLetter(d.value) };
                })}
                dropdownPlaceholder={'Gib einen Effekttypen ein oder wähle einen'}
              />
            ),
          },
        ],
      },
      stats: {
        icon: <IconNumbers />,
        filters: [
          {
            key: 'hp',
            title: 'Lebenspunkte',
            description: '',
            filter: 'hp',
            component: <AdvancedNumberFilter formData={formData} setFormData={setFormData} formKey={'hp'} />,
          },
          {
            key: 'retreat',
            title: 'Rückzugskosten',
            description: '',
            filter: 'retreat',
            component: <AdvancedNumberFilter formData={formData} setFormData={setFormData} formKey={'retreat'} />,
          },
        ],
      },
      release: {
        icon: <IconMeteorFilled />,
        filters: [
          {
            key: 'set',
            title: 'Sets',
            description: 'Sets, in der die Karte gedruckt wurde',
            filter: 'set',
            component: (
              <AdvancedMultiSelectFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'sets'}
                data={setNamesMapped}
                dropdownPlaceholder={'Gib einen Setnamen ein oder wähle einen'}
              />
            ),
          },
          {
            key: 'rarity',
            title: 'Seltenheit',
            description: 'Seltenheit, mit der die Karte in einem Set gedruckt wurde',
            filter: 'rarity',
            component: (
              <AdvancedMultiCheckboxFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'rarity'}
                data={rarities.data.values
                  .filter((d) => d.value !== 'free')
                  .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
                iconsMap={{
                  common: <PcgRarityCommon size={32} />,
                  uncommon: <PcgRarityUncommon size={32} />,
                  rare: <PcgRarityRare size={32} />,
                  double_rare: <PcgRarityDoubleRare size={32} />,
                  ultra_rare: <PcgRarityUltraRare size={32} />,
                  illustration_rare: <PcgRarityIllustrationRare size={32} />,
                  special_illustration_rare: <PcgRaritySpecialIllustrationRare size={32} />,
                  hyper_rare: <PcgRarityHyperRare size={32} />,
                }}
              />
            ),
          },
        ],
      },
      artwork: {
        icon: <IconBrush />,
        filters: [
          {
            key: 'artist',
            title: 'Künstler:in',
            description: 'Irgendein Wort, das im Namen der Künstler:in der Karte vorkommt',
            filter: 'artist',
            component: (
              <AdvancedTextFilter
                formData={formData}
                setFormData={setFormData}
                formKey={'artist'}
                withExactCheckbox
                dropdownPlaceholder={`Irgendein Wort wie "Dunce"`}
                checkboxLabel={'Genaue Übereinstimmung'}
              />
            ),
          },
        ],
      },
    }),
    [formData, evolvesFromMapped, setNamesMapped],
  );

  return { filters: filtersByCategory, constructedQueryFilters, resetFilters };
}
