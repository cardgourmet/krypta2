import type { CSSProperties } from 'react';
import styles from './MTGColorIndicator.module.css';

const colorValues: Record<string, string> = {
  B: '#393736',
  G: '#38614C',
  R: '#DA3946',
  U: '#3277A7',
  W: '#FAFDE8',
};

export const MtgColorIndicator = ({ colors }: { colors: string[] }) => {
  const style = colors
    .map((d) => d.replace(/\{}/g, ''))
    .reduce(
      (vars, color, index) => ({
        // biome-ignore lint/performance/noAccumulatingSpread: _
        ...vars,
        [`--mtg-ci-color-${index + 1}`]: colorValues[color] ?? 'transparent',
      }),
      {},
    ) as CSSProperties;

  return <span className={styles.base} color-count={colors.length.toString()} style={style} />;
};
