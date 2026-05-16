import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import { withPropsApplied } from '../composition/withPropsApplied';
import { Button, type ButtonIdentity } from '../generic/Button/Button';
import { Typeset } from '../generic/Typeset/Typeset';
import { MODAL_DISMISSED_REASON } from './consts';
import styles from './Modal.module.css';
import type { ModalContentProps, ModalFooterProps, ModalProps, ModalTitleProps } from './types';

const Root = ({
  active,
  children,
  modalId,
  modalName,
  noOverlay = false,
  onClose,
  onReject,
  onResolve,
  size = 'sm',
  title,
  undismissable = false,
  visible,
  ...props
}: ModalProps) => {
  return (
    <Dialog
      onOpenChange={
        undismissable
          ? undefined
          : () => {
              onReject?.(MODAL_DISMISSED_REASON);
              onClose?.();
            }
      }
      open={active}
    >
      <DialogPortal>
        {!noOverlay && (
          <DialogOverlay asChild>
            <div className={styles.overlay} />
          </DialogOverlay>
        )}

        <DialogContent aria-describedby={undefined} asChild>
          <div
            className={styles.base}
            data-cgm-debug-id={modalId}
            data-cgm-debug-name={modalName}
            data-cgm-size={size}
            {...props}
          >
            {!undismissable && (
              <DialogClose asChild>
                <Button
                  aria-label="Modal schließen"
                  className={styles.closeButton}
                  leadingIcon={<IconX />}
                  size="sm"
                  variant="tertiary"
                />
              </DialogClose>
            )}

            {children}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export const ModalContent = ({ children, className, ...props }: ModalContentProps) => {
  return (
    <div className={clsx(styles.content, className)} {...props}>
      {children}
    </div>
  );
};

ModalContent.displayName = 'Modal.Content';

export const ModalFooter = ({ children, className, ...props }: ModalFooterProps) => {
  return (
    <div className={styles.footerWrapper}>
      <footer className={clsx(styles.footer, className)} {...props}>
        {children}
      </footer>
    </div>
  );
};

ModalFooter.displayName = 'Modal.Footer';

export const ModalPrimaryButton = withPropsApplied(Button, {
  className: styles.modalButton,
  defaultProps: {
    size: 'md',
  } satisfies ButtonIdentity['props'],
  fixedProps: {
    variant: 'primary',
  } satisfies ButtonIdentity['props'],
});

ModalPrimaryButton.displayName = 'Modal.PrimaryButton';

export const ModalSecondaryButton = withPropsApplied(Button, {
  className: styles.modalButton,
  defaultProps: {
    size: 'md',
  } satisfies ButtonIdentity['props'],
  fixedProps: {
    variant: 'secondary',
  } satisfies ButtonIdentity['props'],
});

ModalSecondaryButton.displayName = 'Modal.SecondaryButton';

export const ModalTitle = ({ children, className, ...props }: ModalTitleProps) => {
  return (
    <DialogTitle asChild>
      <Typeset asChild size="lg">
        <h2 className={clsx(styles.title, className)} {...props}>
          {children}
        </h2>
      </Typeset>
    </DialogTitle>
  );
};

ModalTitle.displayName = 'Modal.Title';

export const Modal = Object.assign(Root, {
  displayName: 'Modal',
  Content: ModalContent,
  Footer: ModalFooter,
  PrimaryButton: ModalPrimaryButton,
  SecondaryButton: ModalSecondaryButton,
  Title: ModalTitle,
});
