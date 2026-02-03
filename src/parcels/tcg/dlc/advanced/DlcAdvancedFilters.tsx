import { IconBrush, IconMeteorFilled, IconNumbers, IconTextSize, IconUserScan } from '@tabler/icons-react';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { AdvancedFilterCategory } from '@/parcels/search/advanced/form/AdvancedFilterCategory.tsx';
import { AdvancedFormMultiCheckbox } from '@/parcels/search/advanced/form/AdvancedFormMultiCheckbox.tsx';
import { AdvancedFormMultiSelect } from '@/parcels/search/advanced/form/AdvancedFormMultiSelect.tsx';
import { AdvancedFormNumberCompare } from '@/parcels/search/advanced/form/AdvancedFormNumberCompare.tsx';
import { AdvancedFormText } from '@/parcels/search/advanced/form/AdvancedFormText.tsx';
import { DlcInkAmber } from '@/parcels/tcg/dlc/icons/DlcInkAmber.tsx';
import { DlcInkAmethyst } from '@/parcels/tcg/dlc/icons/DlcInkAmethyst.tsx';
import { DlcInkEmerald } from '@/parcels/tcg/dlc/icons/DlcInkEmerald.tsx';
import { DlcInkRuby } from '@/parcels/tcg/dlc/icons/DlcInkRuby.tsx';
import { DlcInkSapphire } from '@/parcels/tcg/dlc/icons/DlcInkSapphire.tsx';
import { DlcInkSteel } from '@/parcels/tcg/dlc/icons/DlcInkSteel.tsx';
import { DlcRarityCommon } from '@/parcels/tcg/dlc/icons/DlcRarityCommon.tsx';
import { DlcRarityEnchanted } from '@/parcels/tcg/dlc/icons/DlcRarityEnchanted.tsx';
import { DlcRarityLegendary } from '@/parcels/tcg/dlc/icons/DlcRarityLegendary.tsx';
import { DlcRarityRare } from '@/parcels/tcg/dlc/icons/DlcRarityRare.tsx';
import { DlcRaritySuperRare } from '@/parcels/tcg/dlc/icons/DlcRaritySuperRare.tsx';
import { DlcRarityUncommon } from '@/parcels/tcg/dlc/icons/DlcRarityUncommon.tsx';
import { franchises, inks, rarities, setNames, typesAndClassifications } from '@/parcels/tcg/dlc/raw/apiValues.ts';

export function DlcAdvancedFilters() {
  return (
    <>
      <AdvancedFilterCategory title={'identity'} icon={<IconUserScan />}>
        <AdvancedFormMultiSelect
          k={'type'}
          title={'Typ und Klassifikation'}
          description={'Begriff, der in der Typzeile der Karte steht'}
          filter={'type'}
          data={[
            {
              group: 'Types',
              items: typesAndClassifications.data.values
                .filter((d) => d.type === 'type')
                .map((d) => {
                  return { value: d.value, label: capitalizeFirstLetter(d.value) };
                }),
            },
            {
              group: 'Classifications',
              items: typesAndClassifications.data.values
                .filter((d) => d.type === 'classification')
                .map((d) => {
                  return { value: d.value, label: capitalizeFirstLetter(d.value) };
                }),
            },
          ]}
          dropdownPlaceholder={'Gib einen Typen ein oder wähle einen'}
        />
        <AdvancedFormMultiCheckbox
          k={'ink'}
          title={'Tinte'}
          description={'Sorte der Tinte, gekennzeichnet durch Farbe und Symbol auf der Karte'}
          filter={'ink'}
          data={inks.data.values
            .filter((d) => d.value !== 'none')
            .map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
          iconsMap={{
            amber: <DlcInkAmber size={32} color={'#f0b11d'} />,
            amethyst: <DlcInkAmethyst size={32} color={'#80397b'} />,
            emerald: <DlcInkEmerald size={32} color={'#2b8a42'} />,
            ruby: <DlcInkRuby size={32} color={'#d02031'} />,
            sapphire: <DlcInkSapphire size={32} color={'#0b87c1'} />,
            steel: <DlcInkSteel size={32} color={'#9da7b1'} />,
          }}
          exactDropdownValues={{ true: 'Genau diese Tinten', false: 'Enthält eine dieser Tinten' }}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'text'} icon={<IconTextSize />}>
        <AdvancedFormText
          k={'name'}
          title={'Kartenname'}
          description={'Irgendein Wort, das im Namen der Karte vorkommt'}
          filter={'text'}
          inputPlaceholder={`Irgendein Wort wie "Fire"`}
          checkboxLabel={'Genaue Übereinstimmung'}
          withCheckbox
        />
        <AdvancedFormText
          k={'text'}
          title={'Text'}
          description={'Irgendeine Wortfolge, die im Text der Karte vorkommt'}
          filter={'text'}
          inputPlaceholder={`Irgendein Wortfolge wie "Draw a card"`}
          checkboxLabel={'Genaue Übereinstimmung'}
          withCheckbox
        />
        <AdvancedFormText
          k={'flavortext'}
          title={'Flavortext'}
          description={'Irgendein Wort, das im Flavortext der Karte vorkommt, falls einer existiert'}
          filter={'flavortext'}
          inputPlaceholder={`Irgendein Wort wie "Why did Urza"`}
          checkboxLabel={'Genaue Übereinstimmung'}
          withCheckbox
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'stats'} icon={<IconNumbers />}>
        <AdvancedFormNumberCompare
          k={'strength'}
          title={'Stärke'}
          description={'Der Stärkewert beginnend von 0, nur für Charaktere'}
          filter={'strength'}
        />
        <AdvancedFormNumberCompare
          k={'willpower'}
          title={'Willenskraft'}
          description={'Der Verteidigungswert beginnend von 0, nur für Charaktere'}
          filter={'willpower'}
        />
        <AdvancedFormNumberCompare
          k={'movecost'}
          title={'Bewegungskosten'}
          description={'Die Bewegungskosten beginnend von 0, nur für Orte'}
          filter={'movecost'}
        />
        <AdvancedFormNumberCompare
          k={'lore'}
          title={'Legendenwert'}
          description={'Der Legendenwert beginnend von 0, falls einer existiert'}
          filter={'lore'}
        />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory title={'release'} icon={<IconMeteorFilled />}>
        <AdvancedFormMultiSelect
          k={'sets'}
          title={'Sets'}
          description={'Sets, in der die Karte gedruckt wurde'}
          filter={'setname'}
          data={setNames.data.values.map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
          dropdownPlaceholder={'Suche nach einem Set'}
        />
        <AdvancedFormMultiCheckbox
          k={'rarity'}
          title={'Seltenheit'}
          description={'Seltenheit, mit der die Karte in einem Set gedruckt wurde'}
          filter={'rarity'}
          data={rarities.data.values.map((d) => ({ value: d.value, label: capitalizeFirstLetter(d.value) }))}
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
        <AdvancedFormMultiSelect
          k={'franchise'}
          title={'Franchise'}
          description={'Das Franchise, in das die Karte zugeordnet werden kann'}
          filter={'franchise'}
          data={franchises.data.values
            .filter((d) => d.type === 'name')
            .map((d) => {
              return { value: d.value, label: capitalizeFirstLetter(d.value) };
            })}
          withoutLimit
          dropdownPlaceholder={'Gib ein Franchise ein oder wähle eins'}
        />
      </AdvancedFilterCategory>
    </>
  );
}
