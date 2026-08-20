import { withPropsApplied } from '@/parcels/composition/withPropsApplied';
import { Button, type ButtonIdentity } from '../Button/Button';
import styles from './ActionButton.module.css';

export const ActionButton = withPropsApplied(Button, {
  className: styles.base,
  defaultProps: {
    variant: 'tertiary',
  } satisfies ButtonIdentity['props'],
  fixedProps: {
    leadingIcon: undefined,
    trailingIcon: undefined,
  } satisfies ButtonIdentity['props'],
});
