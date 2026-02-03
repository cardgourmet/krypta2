import {
  IconBrush,
  IconMeteorFilled,
  IconNumbers,
  IconSparkles,
  IconTextSize,
  IconUserScan,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { AdvancedFilterCategory } from '@/parcels/search/advanced/form/AdvancedFilterCategory.tsx';
import { AdvancedFormMultiCheckbox } from '@/parcels/search/advanced/form/AdvancedFormMultiCheckbox.tsx';
import { AdvancedFormMultiSelect } from '@/parcels/search/advanced/form/AdvancedFormMultiSelect.tsx';
import { AdvancedFormNumberCompare } from '@/parcels/search/advanced/form/AdvancedFormNumberCompare.tsx';
import { AdvancedFormText } from '@/parcels/search/advanced/form/AdvancedFormText.tsx';
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

export function PcgAdvancedFilters() {
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

  return (
    <>
      <AdvancedFilterCategory title={'identity'} icon={<IconUserScan />}>
        <AdvancedFormMultiCheckbox
          k={'basetype'}
          title={'Basistyp'}
          description={'Art der Karte'}
          filter={'basetype'}
          data={baseTypes.data.values.map((d) => {
            return { value: d.value, label: capitalizeFirstLetter(d.value) };
          })}
        />
        <AdvancedFormMultiCheckbox
          k={'energy'}
          title={'Energie'}
          description={'Sorte der Energie, gekennzeichnet durch ein Symbol auf der Karte'}
          filter={'energy'}
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
        <AdvancedFormMultiSelect
          k={'subtype'}
          title={'Subtyp'}
          description={'Unterart des Basistypen für speziellere Karten'}
          filter={'subtype'}
          data={subTypes.data.values.map((d) => {
            return { value: d.value, label: capitalizeFirstLetter(d.value) };
          })}
          dropdownPlaceholder={'Gib einen Subtypen ein oder wähle einen'}
        />
        <AdvancedFormMultiSelect
          k={'stage'}
          title={'Entwicklungsstufe'}
          description={'Die Entwicklungsstufe der Karte'}
          filter={'stage'}
          data={evoStages.data.values.map((d) => {
            return { value: d.value, label: capitalizeFirstLetter(d.value) };
          })}
          dropdownPlaceholder={'Gib eine Entwicklungsstufe ein oder wähle einen'}
        />
        <AdvancedFormMultiSelect
          k={'evolves'}
          title={'Entwicklung'}
          description={'Name der Karte, aus der sich diese Karte entwickeln kann, falls vorhanden'}
          filter={'evolves'}
          data={evolvesFromMapped}
          dropdownPlaceholder={'Suche nach einem Pokémon'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'text'} icon={<IconTextSize />}>
        <AdvancedFormText
          k={'name'}
          title={'Kartenname'}
          description={'Irgendein Wort, das im Namen der Karte vorkommt'}
          filter={'text'}
          inputPlaceholder={`Irgendein Wort wie "tuff"`}
          checkboxLabel={'Genaue Übereinstimmung'}
          withCheckbox
        />
        <AdvancedFormText
          k={'text'}
          title={'Text'}
          description={'Irgendeine Wortfolge, die im Text der Karte vorkommt'}
          filter={'text'}
          inputPlaceholder={`Irgendein Wort wie "Round"`}
          checkboxLabel={'Genaue Übereinstimmung'}
          withCheckbox
        />
        <AdvancedFormText
          k={'flavortext'}
          title={'Flavortext'}
          description={'Irgendein Wort, das im Flavortext der Karte vorkommt, falls einer existiert'}
          filter={'flavortext'}
          inputPlaceholder={`Irgendein Wort wie "fine fur"`}
          checkboxLabel={'Genaue Übereinstimmung'}
          withCheckbox
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'effect'} icon={<IconSparkles />}>
        <AdvancedFormMultiSelect
          k={'ability'}
          title={'Fähigkeit'}
          description={'Der Fähigkeitentyp, falls einer existiert'}
          filter={'ability'}
          data={abilityTypes.data.values.map((d) => {
            return { value: d.value, label: capitalizeFirstLetter(d.value) };
          })}
          dropdownPlaceholder={'Gib einen Fähigkeitstypen ein oder wähle einen'}
        />
        <AdvancedFormText
          k={'attack'}
          title={'Angriff'}
          description={'Irgendein Wort, das im Namen einer Attacke vorkommt, falls eine existiert'}
          filter={'attack'}
          inputPlaceholder={`Irgendein Wort wie "Psybeam"`}
          checkboxLabel={'Genaue Übereinstimmung'}
          withCheckbox
        />
        <AdvancedFormMultiSelect
          k={'effect'}
          title={'Effekt'}
          description={'Typ eines Effektes, der weder eine Fähigkeit noch eine Attacke ist'}
          filter={'effect'}
          data={effectTypes.data.values.map((d) => {
            return { value: d.value, label: capitalizeFirstLetter(d.value) };
          })}
          dropdownPlaceholder={'Gib einen Effekttypen ein oder wähle einen'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'stats'} icon={<IconNumbers />}>
        <AdvancedFormNumberCompare
          k={'hp'}
          title={'Lebenspunkte'}
          description={'Wert der Lebenspunkte, falls vorhanden'}
          filter={'hp'}
        />
        <AdvancedFormNumberCompare
          k={'retreat'}
          title={'Rückzugskosten'}
          description={'Kosten die Karte zurückzuziehen, falls vorhanden'}
          filter={'retreat'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'release'} icon={<IconMeteorFilled />}>
        <AdvancedFormMultiSelect
          k={'sets'}
          title={'Sets'}
          description={'Sets, in der die Karte gedruckt wurde'}
          filter={'sets'}
          data={setNamesMapped}
          dropdownPlaceholder={'Suche nach einem Set'}
        />
        <AdvancedFormMultiSelect
          k={'rarity'}
          title={'Seltenheit'}
          description={'Seltenheit, mit der die Karte in einem Set gedruckt wurde'}
          filter={'rarity'}
          data={rarities.data.values
            .filter((d) => d.value !== 'free')
            .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
          withoutLimit
          dropdownPlaceholder={'Suche nach einer Seltenheit'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'artist'} icon={<IconBrush />}>
        <AdvancedFormText
          k={'artist'}
          title={'Künstler:in'}
          description={'Irgendein Wort, das im Namen der Künstler:in der Karte vorkommt'}
          filter={'artist'}
          inputPlaceholder={`Irgendein Wort wie "Dunce"`}
          checkboxLabel={'Genaue Übereinstimmung'}
          withCheckbox
        />
      </AdvancedFilterCategory>
    </>
  );
}
