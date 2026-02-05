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
import { SymbolSVG } from '@/parcels/tcg/mtg';
import {
  mtgColors,
  mtgFormats,
  mtgGames,
  mtgKeywords,
  mtgRarities,
  mtgSetNames,
  mtgTypes,
} from '@/parcels/tcg/mtg/raw/apiValues.ts';

export function MtgAdvancedFilters() {
  const setNamesMapped = useMemo(() => {
    return mtgSetNames.data.values.map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });
  }, []);
  const typesMapped = useMemo(() => {
    return mtgTypes.data.values.map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });
  }, []);
  const keywordsMapped = useMemo(() => {
    return mtgKeywords.data.values.map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });
  }, []);

  return (
    <>
      <AdvancedFilterCategory title={'identity'} icon={<IconUserScan />}>
        <AdvancedFormMultiSelect
          k={'type'}
          title={'Typ'}
          description={'Typ einer Karte'}
          filter={'type'}
          data={typesMapped}
          dropdownPlaceholder={'Gib einen Typen ein oder wähle einen'}
        />
        <AdvancedFormMultiCheckbox
          k={'color'}
          title={'Mana-Farbe'}
          description={'Art der Mana, die als Kosten auf der Karte gekennzeichnet sind'}
          filter={'color'}
          data={mtgColors.data.values
            .filter((d) => d.type === 'color')
            .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
          iconsMap={{
            colorless: <SymbolSVG symbol={'{C}'} size={24} />,
            black: <SymbolSVG symbol={'{B}'} size={24} />,
            blue: <SymbolSVG symbol={'{U}'} size={24} />,
            red: <SymbolSVG symbol={'{R}'} size={24} />,
            white: <SymbolSVG symbol={'{W}'} size={24} />,
            green: <SymbolSVG symbol={'{G}'} size={24} />,
          }}
          exactDropdownValues={{ exact: 'Genau diese Farben', contains: 'Enthält eine dieser Farben' }}
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
          k={'keyword'}
          title={'Schlüsselwörter'}
          description={'Schlüsselwörter einer Karte, die als Kürzel für teils komplexere Mechaniken dienen'}
          filter={'keyword'}
          data={keywordsMapped}
          dropdownPlaceholder={'Gib ein Schlüsselwort ein oder wähle eins'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'stats'} icon={<IconNumbers />}>
        <AdvancedFormNumberCompare
          k={'cmc'}
          title={'Manakosten'}
          description={'Wert der Manakosten als Ganzzahl'}
          filter={'cmc'}
        />
        <AdvancedFormNumberCompare
          k={'power'}
          title={'Stärke'}
          description={'Wert der Stärke, falls vorhanden'}
          filter={'power'}
        />
        <AdvancedFormNumberCompare
          k={'toughness'}
          title={'Widerstandskraft'}
          description={'Wert der Widerstandskraft, falls vorhanden'}
          filter={'toughness'}
        />
        <AdvancedFormNumberCompare
          k={'loyalty'}
          title={'Loyalität'}
          description={'Wert der Loyalität, falls vorhanden'}
          filter={'loyalty'}
        />
        <AdvancedFormNumberCompare
          k={'defense'}
          title={'Verteidigung'}
          description={'Wert der Verteidigung, falls vorhanden'}
          filter={'defense'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'release'} icon={<IconMeteorFilled />}>
        <AdvancedFormMultiSelect
          k={'sets'}
          title={'Sets'}
          description={'Sets, in der die Karte gedruckt wurde'}
          filter={'setname'}
          data={setNamesMapped}
          dropdownPlaceholder={'Suche nach einem Set'}
        />
        <AdvancedFormMultiSelect
          k={'rarity'}
          title={'Seltenheit'}
          description={'Seltenheit, mit der die Karte in einem Set gedruckt wurde'}
          filter={'rarity'}
          data={mtgRarities.data.values.map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
          withoutLimit
          dropdownPlaceholder={'Suche nach einer Seltenheit'}
        />
        <AdvancedFormMultiSelect
          k={'format'}
          title={'Format'}
          description={'In welchen Formaten die Karten legal zu spielen sind'}
          filter={'game'}
          data={mtgFormats.data.values.map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
          dropdownPlaceholder={'Gib ein Format ein oder wähle eins'}
        />
        <AdvancedFormMultiSelect
          k={'games'}
          title={'Spiel'}
          description={'Unterscheidung zwischen digitalen Produkten und Druck'}
          filter={'game'}
          data={mtgGames.data.values.map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
          dropdownPlaceholder={'Gib ein Spiel ein oder wähle eins'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'artwork'} icon={<IconBrush />}>
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
