export function capitalizeFirstLetter(str: string): string {
  if (str.includes('_')) {
    const spl = str.split('_');
    return spl.map((s) => capitalizeFirstLetter(s)).join(' ');
  }

  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
