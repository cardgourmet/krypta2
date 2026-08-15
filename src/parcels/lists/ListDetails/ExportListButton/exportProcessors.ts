import type { ResolvedUserListResource } from '@/parcels/lists/types.ts';
import type { DlcDataCard } from '@/parcels/tcg/dlc/api.ts';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';

export const exportFormats = {
  mtgo: '[Quantity] [Card Name]',
  mtga: '[Quantity] [Card Name] ([Set Code]) [Collector Number]',
  limitless: '[Quantity] [Card Name] [Set Code] [Collector Number]',
  ptcgo: '[Quantity] [Card Name] [Set Code] [Collector Number]',
  'pokemoncard.io': '[Quantity] [Card Name] [Set Code] [Collector Number]',
  'pkmn.gg': '[Quantity] [Card Name] [Set Code] [Collector Number]',
  dreamborn: '[Quantity] [Card Name] [Card Title]',
  'lorcana.gg': '[Quantity] [Card Name] [Card Title]',
} as Record<string, string | undefined>;

export function exportAsStringArray(resources: ResolvedUserListResource[], format: string): string[] | undefined {
  const unformattedString = exportFormats[format.toLowerCase()];
  if (!unformattedString) return undefined;

  const exportArray = [] as string[];
  for (const resource of resources) {
    if (resource.listResource.resourceType !== 'card') continue;
    const data = resource.resourceData as unknown as TcgDataCard;

    // things like 'Quantity', 'Card Name', ...
    const formatComponents = {
      Quantity: '1',
    } as Record<string, string | undefined>;

    formatComponents['Card Name'] = data.name;
    formatComponents['Set Code'] = data.print.setCode?.toUpperCase();
    formatComponents['Collector Number'] = data.print.collectorNumber;

    if (resource.listResource.game === 'dlc') {
      const dlcData = data as DlcDataCard;

      const title = dlcData.print.translations.en.title ?? undefined;
      formatComponents['Card Title'] = title ? `- ${title}` : '';
    }

    let toFormat = unformattedString;
    Object.entries(formatComponents).forEach(([replace, value]) => {
      if (value === undefined) return;

      toFormat = toFormat.replace(`[${replace}]`, value);
    });
    exportArray.push(toFormat);
  }

  return exportArray;
}
