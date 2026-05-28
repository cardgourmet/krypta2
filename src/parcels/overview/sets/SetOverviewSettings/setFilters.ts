import { type FieldToken, type LiqeQuery, type LiteralExpressionToken, parse } from 'liqe';
import { groupBy } from '@/parcels/groupBy.ts';

export function deserializeFilterString(q: string): SetFilters {
  const tokens = parse(q);
  const filterAndValues = groupBy(extractFilterExpression(tokens), (e) => e.filter) as Record<
    FilterKeys,
    FilterExpression[]
  >;

  const filters: SetFilters = { ...defaultFilters };
  if (filterAndValues.name) {
    const values = filterAndValues.name;

    if (values.length > 0) {
      filters.name = values[0].value;
    }
  }
  if (filterAndValues.types) {
    const values = filterAndValues.types;

    if (values.length > 0) {
      filters.types = values.map((v) => v.value);
    }
  }

  return filters;
}

export function serializeFilters(filters: SetFilters): string {
  const parts: string[] = [];
  if (filters.name) {
    parts.push(`name:"${filters.name}"`);
  }
  if (filters.types) {
    for (const type of filters.types) {
      parts.push(`types:"${type}"`);
    }
  }

  return parts.join(' ');
}

export function countFilters(filters: SetFilters): number {
  let count = 0;
  if (filters.types.length > 0) {
    count++;
  }

  return count;
}

type FilterExpression = {
  filter: string;
  operator: '=';
  value: string;
};
function extractFilterExpression(liqe: LiqeQuery): FilterExpression[] {
  const type = liqe.type;
  if (type === 'LogicalExpression') {
    if (liqe.operator.operator === 'OR') return [];

    const leftExpressions = extractFilterExpression(liqe.left);
    const rightExpressions = extractFilterExpression(liqe.right);

    return [...leftExpressions, ...rightExpressions];
  }
  if (type === 'Tag') {
    const filter = (liqe.field as FieldToken).name;
    const value = (liqe.expression as LiteralExpressionToken).value;
    const expression = {
      filter: filter,
      operator: '=' as '=',
      value: value?.toString() ?? '',
    };

    return [expression];
  }
  return [];
}

export type SetFilters = {
  name: string;
  types: string[];
};
type FilterKeys = keyof SetFilters;

export const defaultFilters = {
  name: '',
  types: [],
};
