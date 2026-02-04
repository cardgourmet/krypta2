export function slugify(t: string): string {
  return t
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll(/[^a-zA-Z0-9-]+/g, '');
}
