import type { DlcAdvancedFilterFormData } from '@/parcels/tcg/dlc/advanced/useDlcAdvancedFilters.tsx';

function constructTextFilter(filter: string, value: string, exact: boolean): string {
  let filterValue = value;
  if (filterValue.includes(' ')) {
    filterValue = `"${filterValue}"`;
  }

  if (exact) {
    return `${filter}=${filterValue}`;
  } else {
    return `${filter}:${filterValue}`;
  }
}

function constructArrayFilter(filter: string, values: string[], exact: boolean): string {
  const filters: string[] = [];
  for (const value of values) {
    filters.push(constructTextFilter(filter, value, false));
  }

  if (exact) {
    return filters.join(' ');
  } else {
    return filters.join(' or ');
  }
}

function constructNumberFilter(filter: string, value: number, operator: string): string {
  return `${filter}${operator}${value}`;
}

export const constructDlcQuery = (formData: DlcAdvancedFilterFormData) => {
  const filters: string[] = [];

  // IDENTITY
  if (formData.type.values.length > 0) {
    filters.push(constructArrayFilter('type', formData.type.values, formData.type.exact));
  }
  const selectedInks = Object.entries(formData.ink.values)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);
  if (selectedInks.length > 0) {
    filters.push(constructArrayFilter('ink', selectedInks, formData.ink.exact));
  }

  // TEXT
  if (formData.name.value !== '') {
    filters.push(constructTextFilter('name', formData.name.value, formData.name.exact));
  }
  if (formData.text.value !== '') {
    filters.push(constructTextFilter('text', formData.text.value, formData.text.exact));
  }
  if (formData.flavortext.value !== '') {
    filters.push(constructTextFilter('flavortext', formData.flavortext.value, formData.flavortext.exact));
  }

  // STATS
  if (formData.strength.value !== '') {
    filters.push(constructNumberFilter('strength', formData.strength.value as number, formData.strength.operator));
  }
  if (formData.willpower.value !== '') {
    filters.push(constructNumberFilter('willpower', formData.willpower.value as number, formData.willpower.operator));
  }
  if (formData.movecost.value !== '') {
    filters.push(constructNumberFilter('movecost', formData.movecost.value as number, formData.movecost.operator));
  }
  if (formData.lore.value !== '') {
    filters.push(constructNumberFilter('lore', formData.lore.value as number, formData.lore.operator));
  }

  // RELEASE
  if (formData.sets.values.length > 0) {
    filters.push(constructArrayFilter('sets', formData.sets.values, false));
  }
  const selectedRarities = Object.entries(formData.rarity.values)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);
  if (selectedRarities.length > 0) {
    filters.push(constructArrayFilter('rarity', selectedRarities, false));
  }

  // ARTWORK
  if (formData.artist.value !== '') {
    filters.push(constructTextFilter('artist', formData.artist.value, formData.artist.exact));
  }
  if (formData.franchise.values.length > 0) {
    filters.push(constructArrayFilter('franchise', formData.franchise.values, false));
  }

  return filters;
};
