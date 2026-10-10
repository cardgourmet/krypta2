export function slugify(t: string): string {
  return slugify2(t);

  /*return t
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll(/[^a-zA-Z0-9-_]+/g, '');*/
}

export function slugify2(value: string, replacement = '-') {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // biome-ignore lint/suspicious/noControlCharactersInRegex: <>
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .trim()
      .replace(/\s+/g, replacement)
      .toLowerCase()
  );
}
