import { Group, Stack, UnstyledButton } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import styles from './ColorSelect.module.css';
import type { ColorSelectProps } from './types';

const colors = ['#e6261f', '#eb7532', '#f7d038', '#a3e048', '#49da9a', '#34bbe6', '#4355db', '#d23be7'];

export function ColorSelect({ defaultValue, onChange, value, ...props }: ColorSelectProps) {
  const [internalValue, handleChange] = useUncontrolled({
    defaultValue,
    finalValue: 'default',
    onChange,
    value,
  });

  const [sliderPosition, setSliderPosition] = useState(0);

  useEffect(() => {
    if (!internalValue) {
      setSliderPosition(0);
      return;
    }

    const exactIndex = colors.findIndex((color) => color.toLowerCase() === internalValue.toLowerCase());
    if (exactIndex !== -1) {
      setSliderPosition(exactIndex);
    }
  }, [internalValue]);

  return (
    <Stack gap={'1rem'} {...props}>
      <Group gap={'0.5rem'} justify={'space-between'}>
        {colors.map((color, i) => {
          const isSelected = internalValue === color;

          return (
            <UnstyledButton
              className={styles.colorSelectButton}
              data-selected={isSelected}
              key={i}
              onClick={() => {
                if (isSelected) {
                  handleChange('default');
                  setSliderPosition(0);
                } else {
                  handleChange(color);
                  setSliderPosition(i);
                }
              }}
              style={{ color: `${color}` }}
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
          '--thumb-color': internalValue === 'default' ? undefined : internalValue,
        }}
        onChange={(event) => {
          const position = Number(event.currentTarget.value);
          setSliderPosition(position);
          handleChange(interpolatePaletteColor(colors, position));
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
