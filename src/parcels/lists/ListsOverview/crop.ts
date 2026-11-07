import type { CSSProperties } from 'react';
import type { UserListThumbnailCrop } from '@/parcels/lists/types.ts';

type CropPoint = {
  x: number;
  y: number;
};

function parseCropPoint(point?: string | null): CropPoint | undefined {
  if (!point) return undefined;

  const [x, y] = point.split(',').map(Number);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return undefined;
  }

  return { x, y };
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getThumbnailCropStyle(crop?: UserListThumbnailCrop | null): CSSProperties | undefined {
  if (!crop || crop.type !== 'rect') return undefined;

  const p1 = parseCropPoint(crop.p1);
  const p2 = parseCropPoint(crop.p2);

  if (!p1 || !p2) return undefined;

  const left = clamp01(Math.min(p1.x, p2.x));
  const top = clamp01(Math.min(p1.y, p2.y));
  const right = clamp01(Math.max(p1.x, p2.x));
  const bottom = clamp01(Math.max(p1.y, p2.y));

  const width = right - left;
  const height = bottom - top;

  if (width <= 0 || height <= 0) return undefined;

  return {
    position: 'absolute',
    width: `${100 / width}%`,
    height: `${100 / height}%`,
    left: `${-(left / width) * 100}%`,
    top: `${-(top / height) * 100}%`,
    objectFit: 'cover',
  };
}
