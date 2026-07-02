import clsx from 'clsx';
import { Print } from '../Print';
import styles from './BasicCard.module.css';
import type { BasicCardProps } from './types';

export const BasicCard = ({ className, print }: BasicCardProps) => {
  const face = Print.getPhysicalFront(print);

  return <img alt={face.name} className={clsx(styles.base, className)} src={face.imageUrls?.full ?? ''} />;
};
