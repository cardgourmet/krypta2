export function queryContainsSetFilter(query: string): string | null {
  if (!query) return null;
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes(' or ')) return null;

  const allowedFilters = ['set', 'setcode', 'setname', 's', 'e', 'setid', 'edition', 'expansion'];
  let allowed = false;
  for (const allowedFilter of allowedFilters) {
    const regex = RegExp(`${allowedFilter}[:=].*`, 'g');
    if (regex.test(query)) {
      allowed = true;
      break;
    }
  }
  if (!allowed) return null;
  return 'quagga';
  /*
  const spl = lowerQuery.split(/[:=]/);
  if (spl.length !== 2) return null;

  let value = spl[1];
  if (value.startsWith('"')) value = value.substring(1);
  if (value.endsWith('"')) value = value.substring(0, value.length - 1);
  return value.trim();*/
}
