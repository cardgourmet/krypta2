import { Group, Stack, UnstyledButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import styles from './ColorSelect.module.css';

export function ColorSelect({ value, onChange }: { value: string | undefined; onChange: (v?: string) => void }) {
  //const colors = ['FFADAD', 'FFD6A5', 'FDFFB6', 'CAFFBF', '9BF6FF', 'A0C4FF', 'BDB2FF', 'FFC6FF'];
  const colors = ['#e6261f', '#eb7532', '#f7d038', '#a3e048', '#49da9a', '#34bbe6', '#4355db', '#d23be7'];
  const [_, setCurrentSelected] = useState<string | undefined>(value);

  const [sliderPosition, setSliderPosition] = useState(0);
  useEffect(() => {
    if (!value) {
      setSliderPosition(0);
      return;
    }

    const exactIndex = colors.findIndex((color) => color.toLowerCase() === value.toLowerCase());
    if (exactIndex !== -1) {
      setSliderPosition(exactIndex);
    }
  }, [value]);

  return (
    <Stack gap={'1rem'}>
      <Group gap={'0.5rem'} justify={'space-between'}>
        {colors.map((color, i) => {
          const isSelected = value === color;

          return (
            <UnstyledButton
              onClick={() => {
                if (isSelected) {
                  setCurrentSelected(undefined);
                  onChange(undefined);
                  setSliderPosition(0);
                } else {
                  setCurrentSelected(color);
                  onChange(color);
                  setSliderPosition(i);
                }
              }}
              key={i}
              style={{ color: `${color}` }}
              className={styles.colorSelectButton}
              data-selected={isSelected}
            />
          );
        })}
      </Group>

      <input
        type="range"
        min={0}
        max={colors.length - 1}
        step={0.01}
        value={sliderPosition}
        style={{
          background: `linear-gradient(90deg, ${colors.join(', ')})`,
          '--thumb-color': value,
        }}
        onChange={(event) => {
          const position = Number(event.currentTarget.value);
          setSliderPosition(position);
          onChange(interpolatePaletteColor(colors, position));
        }}
        className={styles.colorSlider}
        aria-label="Choose custom color"
      />
    </Stack>
  );
}

// thanks AI, I will never again in my life write custom RGB conversion
function interpolatePaletteColor(colors: string[], position: number) {
  const clampedPosition = Math.max(0, Math.min(position, colors.length - 1));
  const startIndex = Math.floor(clampedPosition);
  const endIndex = Math.min(startIndex + 1, colors.length - 1);
  const progress = clampedPosition - startIndex;

  if (startIndex === endIndex) {
    return colors[startIndex];
  }

  return interpolateHex(colors[startIndex], colors[endIndex], progress);
}

function interpolateHex(startHex: string, endHex: string, progress: number) {
  const start = hexToRgb(startHex);
  const end = hexToRgb(endHex);

  const r = Math.round(start.r + (end.r - start.r) * progress);
  const g = Math.round(start.g + (end.g - start.g) * progress);
  const b = Math.round(start.b + (end.b - start.b) * progress);

  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}
