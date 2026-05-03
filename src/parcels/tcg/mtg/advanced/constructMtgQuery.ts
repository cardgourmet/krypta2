import type { MtgAdvancedFilterFormData } from '@/parcels/tcg/mtg/advanced/formData.ts';

export const constructMtgQuery = (formData: MtgAdvancedFilterFormData) => {
  const filters: string[] = [];

  // IDENTITY
  if (formData.type.values.length > 0) {
    filters.push(constructArrayFilter('type', formData.type.values, formData.type.exact));
  }
  const selectedColors = Object.entries(formData.color.values)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);
  if (selectedColors.length > 0) {
    filters.push(constructArrayFilter('color', selectedColors, formData.color.mode === 'exact'));
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

  // EFFECT
  if (formData.keyword.values.length > 0) {
    filters.push(constructArrayFilter('keyword', formData.keyword.values, formData.keyword.exact));
  }

  // STATS
  if (formData.cmc.value !== '') {
    filters.push(constructNumberFilter('cmc', formData.cmc.value as number, formData.cmc.operator));
  }
  if (formData.power.value !== '') {
    filters.push(constructNumberFilter('power', formData.power.value as number, formData.power.operator));
  }
  if (formData.toughness.value !== '') {
    filters.push(constructNumberFilter('toughness', formData.toughness.value as number, formData.toughness.operator));
  }
  if (formData.loyalty.value !== '') {
    filters.push(constructNumberFilter('loyalty', formData.loyalty.value as number, formData.loyalty.operator));
  }
  if (formData.defense.value !== '') {
    filters.push(constructNumberFilter('defense', formData.defense.value as number, formData.defense.operator));
  }

  // RELEASE
  if (formData.sets.values.length > 0) {
    filters.push(constructArrayFilter('setname', formData.sets.values, false));
  }
  if (formData.rarity.values.length > 0) {
    filters.push(constructArrayFilter('rarity', formData.rarity.values, false));
  }
  if (formData.format.values.length > 0) {
    filters.push(constructArrayFilter('format', formData.format.values, formData.format.exact));
  }
  if (formData.games.values.length > 0) {
    filters.push(constructArrayFilter('game', formData.games.values, false));
  }

  // ARTWORK
  if (formData.artist.value !== '') {
    filters.push(constructTextFilter('artist', formData.artist.value, formData.artist.exact));
  }

  return filters;
};

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
