import type { FunctionComponent, ReactNode } from 'react';
import type { modalRegistry } from '@/modals.consts';
import type { Extend, StructureWithChildren } from '../composition/extend';

// biome-ignore lint/suspicious/noExplicitAny: this is valid
type AnyModalComponent = FunctionComponent<ExtendModalProps<any>>;

export type DefinedModalNames = keyof typeof modalRegistry;
export type ModalName = DefinedModalNames | (string & {});

export type ExtendModalProps<
  // biome-ignore lint/complexity/noBannedTypes: this is valid
  P extends Record<string, unknown> = {},
  T = unknown,
> = Extend<ModalProps<T>, keyof P extends never ? { innerProps?: never } : { innerProps: P }>;

export type ModalContentProps = Extend<StructureWithChildren>;

export type ModalContextValue = {
  closeModal: (id: number) => void;
  // biome-ignore lint/suspicious/noConfusingVoidType: this is valid
  requestModal: <T = unknown>(name: ModalName, data?: ModalRequest) => Promise<T> | void;
};

export type ModalContextProviderProps = {
  children?: ReactNode;
  modals: ModalRegistry;
};

export type ModalFooterProps = Extend<StructureWithChildren>;

export type ModalMetadata = {
  /**
   * The component to render.
   */
  component: AnyModalComponent;
  /**
   * Whether the modal should interrupt all other modals and be presented immediately. This value can be overriden on each individual request.
   */
  highPriority?: boolean;
};

export type ModalProps<T = unknown> = {
  active: boolean;
  children?: ReactNode;
  modalId?: number;
  modalName?: ModalName;
  noOverlay?: boolean;
  onClose?: () => void;
  onReject?: (reason?: unknown) => void;
  onResolve?: (value: T) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  undismissable?: boolean;
  visible: boolean;
};

export type ModalQueueItem = {
  active: boolean;
  Component: AnyModalComponent;
  id: number;
  innerProps?: object;
  interrupting: boolean;
  name: ModalName;
  reject?: (reason?: unknown) => void;
  resolve?: (value: unknown) => void;
  visible: boolean;
};

export type ModalRegistry = Record<string, ModalMetadata>;

export type ModalRequest = {
  /**
   * When set to `true`, the {@link ModalContextValue.requestModal requestModal} function returns a promise that can be resolved or rejected from within the modal.
   */
  async?: boolean;
  /**
   * The component to render. Can be used to show one-off modals that aren't registered in the context.
   */
  component?: AnyModalComponent;
  /**
   * Whether the modal should interrupt all other modals and be presented immediately.
   */
  highPriority?: boolean;
  /**
   * Can be used to pass props to the rendered modal.
   */
  innerProps?: object;
  /**
   * Whether the modal was requested from within the currently active modal.
   */
  nested?: boolean;
};

export type ModalTitleProps = Extend<StructureWithChildren>;
