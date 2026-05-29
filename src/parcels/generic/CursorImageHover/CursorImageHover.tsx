import { Group } from '@mantine/core';
import { type ReactNode, useState } from 'react';

type CursorImageHoverProps = {
  children: ReactNode;
  images: CursorImage[];
};

export type CursorImage = {
  imageUrl: string;
  alt?: string;
};

export function CursorImageHover({ children, images }: CursorImageHoverProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <_>
    <span
      style={{ display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseMove={(event) => {
        setPosition({
          x: event.clientX,
          y: event.clientY,
        });
      }}
    >
      {children}

      {isVisible && (
        <Group gap={0}>
          {images.map((i, index) => (
            <img
              key={i.imageUrl}
              src={i.imageUrl}
              alt={i.alt}
              style={{
                position: 'fixed',
                left: position.x + 32 + index * 240,
                top: position.y - 32,
                width: `240px`,
                borderRadius: '1rem',
                boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.35)',
                pointerEvents: 'none',
                zIndex: 9999,
              }}
            />
          ))}
        </Group>
      )}
    </span>
  );
}
