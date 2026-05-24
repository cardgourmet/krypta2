import type { PcgCuisineFormData } from '@/parcels/tcg/pcg/cuisine/formData.ts';

export const constructPcgQuery = (formData: PcgCuisineFormData) => {
  const filters: string[] = [];

  // IDENTITY
  const selectedBasetypes = Object.entries(formData.basetype.values)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);
  if (selectedBasetypes.length > 0) {
    filters.push(constructArrayFilter('basetype', selectedBasetypes, false));
  }
  const selectedEnergies = Object.entries(formData.energy.values)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);
  if (selectedEnergies.length > 0) {
    filters.push(constructArrayFilter('energy', selectedEnergies, formData.energy.mode === 'exact'));
  }
  if (formData.subtype.values.length > 0) {
    filters.push(constructArrayFilter('subtype', formData.subtype.values, formData.subtype.mode === 'exact'));
  }
  if (formData.stage.values.length > 0) {
    filters.push(constructArrayFilter('stage', formData.stage.values, false));
  }
  if (formData.evolves.values.length > 0) {
    filters.push(constructArrayFilter('evolves', formData.evolves.values, false));
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
  if (formData.ability.values.length > 0) {
    filters.push(constructArrayFilter('ability', formData.ability.values, formData.ability.mode === 'exact'));
  }
  if (formData.attack.value !== '') {
    filters.push(constructTextFilter('attack', formData.attack.value, formData.attack.exact));
  }
  if (formData.effect.values.length > 0) {
    filters.push(constructArrayFilter('stage', formData.effect.values, formData.effect.mode === 'exact'));
  }

  // STATS
  if (formData.hp.value !== '') {
    filters.push(constructNumberFilter('hp', formData.hp.value as number, formData.hp.operator));
  }
  if (formData.retreat.value !== '') {
    filters.push(constructNumberFilter('retreat', formData.retreat.value as number, formData.retreat.operator));
  }

  // RELEASE
  if (formData.sets.values.length > 0) {
    filters.push(constructArrayFilter('setname', formData.sets.values, false));
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
