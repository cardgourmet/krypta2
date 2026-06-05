export const MtgSetIcon = ({ setCode, fontSize, color }: { setCode: string; fontSize?: string; color?: string }) => {
  return (
    <i
      className={`ss ss-${setCode.toLowerCase()}`}
      style={{ color: color ?? 'var(--gourmet-neutral-9)', fontSize: fontSize ?? '1.75rem' }}
    />
  );
};
