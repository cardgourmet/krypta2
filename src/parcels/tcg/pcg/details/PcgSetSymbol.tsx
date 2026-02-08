const images = import.meta.glob<string>('/src/parcels/tcg/pcg/icons/sets/**/*.{png,svg}', {
  eager: true,
  import: 'default',
});

export function PcgSetSymbol({ setCode }: { setCode: string }) {
  console.log(Object.keys(images));

  const entry = Object.entries(images).find(([key, _]) => key.includes(setCode.toLowerCase()));
  if (entry) {
    const [fileName, fileData] = entry;
    const asSvg = fileName.endsWith('.svg');

    if (asSvg) return <img src={fileData} alt={fileName} width={28} />;
    return <img src={fileData} alt={fileName} width={28} />;
  }
  return <>{entry}</>;
}
