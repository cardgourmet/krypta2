import clsx from 'clsx';
import type { ComponentProps, ComponentType, ElementType } from 'react';
import { maybe } from '@/utils/maybe';
import type { Optional } from '@/utils/optional';
import type { Composable } from './extend';

/*
  Diese Funktion ist dafür gedacht, Basiskomponenten wie den Button
  für bestimmte Einsatzzwecke mit Props vorzubefüllen. Der reine
  Javascript-Part hierfür ist im Grunde genommen nicht sehr aufwendig,
  aber gerade bei Composables ist es anstrengend die Typings korrekt
  anzupassen bzw. zu übernehmen. Zudem sind andere Schritte nötig, je
  nachdem ob eine Komponente ein Composable ist oder nicht.
*/

/**
 * Returns the props of a base type T, which can be either a HTML tag name
 * as a string, the type of a component function or an arbitrary prop type.
 */
type InferBaseProps<T> = T extends ElementType
  ? ComponentProps<T>
  : T extends undefined
    ? // biome-ignore lint/complexity/noBannedTypes: this is valid
      {}
    : T;

/**
 * Returns the props of a composable prop type, without the inherited props
 * from the base element (i.e. all props that can be applied to the
 * component when `asChild` is `true`).
 */
type InferComposableProps<T extends object> = T extends { asChild?: true }
  ? Omit<Extract<T, { asChild: true }>, 'asChild' | 'children'>
  : T;

/**
 * Returns the union of all props that can be applied to a component ever.
 */
type AppliableProps<P extends object, B = undefined> = Omit<
  InferComposableProps<P> & Omit<InferBaseProps<B>, keyof InferComposableProps<P>>,
  'children'
>;

/**
 * Constructs a new prop type for a with `withPropsApplied` wrapped component.
 * - Makes all properties in `D` (defaultProps) optional.
 * - Removes all properties in `F` (fixedProps) from the type.
 *
 * If the wrapped component was a composable, the new component will be as well.
 * Transforming a composable type directly likely breaks the `asChild` mechanic,
 * that's why this type creates a more sophisticated output.
 * @example
 * // Instead of doing roughly this:
 * type ComposableProps = Composable<BaseProps, Props>;
 * type WithDefaultsOptional = Optional<ComposableProps, D>;
 * type WithoutFixed = Omit<WithDefaultsOptional, F>;
 * type Result = WithoutFixed;
 *
 * // It does roughly the following:
 * type DBase = Extract<D, keyof BaseProps>;
 * type FBase = Extract<F, keyof BaseProps>;
 * type TransformedBase = Omit<Optional<BaseProps, DBase>, FBase>;
 *
 * type DComp = Extract<D, keyof Props>;
 * type FComp = Extract<F, keyof Props>;
 * type TransformedProps = Omit<Optional<Props, DComp>, FComp>;
 *
 * type Result = Composable<TransformedBase, TransformedProps>;
 */
type WithPropsAppliedProps<
  I extends ComponentIdentity<object>,
  D extends keyof I['props'] = never,
  F extends keyof I['props'] = never,
> = I['base'] extends undefined
  ? Omit<Optional<I['complexProps'], Extract<D, keyof I['complexProps']>>, F>
  : Composable<
      Omit<Optional<InferBaseProps<I['base']>, Extract<D, keyof InferBaseProps<I['base']>>>, F>,
      Omit<Optional<InferComposableProps<I['complexProps']>, D>, F>
    >;

/**
 * Provides information about the base and props of a component.
 */
export type ComponentIdentity<Props extends object, Base = undefined> = {
  base: Base;
  complexProps: Props;
  props: AppliableProps<Props, Base>;
};

/**
 * Creates a new component from `WrappedComponent` with a set of props pre-filled.
 * @param WrappedComponent The component to wrap. This must be a component with an {@link ComponentIdentity identity}.
 * @param param1 The props to apply.
 * @returns A copy of `WrappedComponent` with the specified props set and correctly adjusted typings.
 */
export function withPropsApplied<
  // biome-ignore lint/suspicious/noExplicitAny: this is valid
  I extends ComponentIdentity<any, any>,
  D extends keyof I['props'] = never,
  F extends keyof I['props'] = never,
>(
  WrappedComponent: ComponentType<NoInfer<I>['complexProps']> & { identity: I },
  {
    className,
    defaultProps,
    fixedProps,
  }: {
    /**
     * Assign a className that will be combined with the className passed to the resulting component.
     * @remarks When the `WrappedComponent` doesn't accept a className, this value cannot be set.
     */
    className?: I['props'] extends { className?: string } ? string : never;
    /**
     * Assign default values to props but keep them overwritable.
     * @remarks When you add a default value for a required prop, it becomes optional in the resulting component.
     * @remarks Add the `satisfies` operator to get auto-complete suggestions.
     * @example
     * {
     *   defaultProps: {
     *     ...
     *   } satisfies ButtonIdentity['props'],
     * }
     */
    defaultProps?: { [K in D]: I['props'][K] };
    /**
     * Assign fixed values to props and remove them from the resulting component.
     * @remarks Add the `satisfies` operator to get auto-complete suggestions.
     * @example
     * {
     *   fixedProps: {
     *     ...
     *   } satisfies ButtonIdentity['props'],
     * }
     */
    fixedProps?: { [K in F]: I['props'][K] };
  },
) {
  function WithPropsApplied({ ...props }: WithPropsAppliedProps<I, D, F>) {
    return (
      <WrappedComponent
        {...defaultProps}
        {...(props as unknown as I['complexProps'])}
        {...maybe(
          'className',
          clsx(className, (props as unknown as I['complexProps']).className),
          typeof className !== 'undefined',
        )}
        {...fixedProps}
      />
    );
  }

  WithPropsApplied.displayName = `WithPropsApplied<${WrappedComponent.displayName}>`;
  WithPropsApplied.identity = undefined! as ComponentIdentity<WithPropsAppliedProps<I, D, F>, I['base']>;

  return WithPropsApplied;
}
