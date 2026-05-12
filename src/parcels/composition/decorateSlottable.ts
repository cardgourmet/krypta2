import type { ReactNode } from 'react';
import React from 'react';

/*
  Wir benutzen die Slot-Komponente von Radix, um Composables umzusetzen.
  Dabei wird das direkte Child innerhalb des Slots als Root-Node gerendert,
  und alle Props des Slots werden mit denen des Childs zusammengeführt.

  Bei Composables die eigenen Content mitsamt der Children rendern wollen,
  ist das ein Problem, denn der Slot hätte dann nicht mehr den durchgereichten
  Content als direktes Child sondern entweder mehrere (das funktioniert generell nicht)
  oder immer das selbe, z.B. wenn wir ein Fragment benutzen, um die "Dekorationen"
  und die Children zu wrappen (das funktioniert, asChild hat dann aber keinen Effekt).

  Radix hat für diesen Fall <Slottable>, dessen direktes Child vom Slot
  alternativ als Root-Node benutzt wird, sofern Slottable Teil der Children
  des Slots ist. Das funktioniert jedoch ebenfalls nur mit 2 Einschränkungen:
    1. Slottable muss ein direktes Child des Slots sein,
       kann also nicht z.B. in einem `div` gewrappt werden.
    2. Das einzige Child des Slottable dürfen wieder nur
       die durchgereichte Children unseres Composables sein
       (ansonsten wiederholt sich das oberige Problem wieder).

  Wir wollen aber z.B. beim Button die Children mit Icons ergänzen
  und brauchen eine Lösung für genau diesen Fall -> decorateSlottable
*/

/**
 * Allows decorating a node (wrapping with or adding other nodes) for usage
 * with Radix' `<Slottable>`. The function works by extracting the children
 * from the only direct child, applies a transform to them and uses the result
 * as the children again. This way, the single next node that Slottable finds
 * will always be the first child passed to the composable.
 *
 * @example
 * // Let's assume we pass these children to a component with `asChild=true`.
 * // Inside the component, we want to decorate the children by wrapping them in a <strong>.
 * const children = (
 *   <a href="#">Hello World!</a>
 * );
 *
 * // Returns <strong><a href="#">Hello World!</a></strong>
 * // Won't work, because now <strong> is the node used for composition instead of the <a> passed as a child.
 * <Slottable>
 *   <strong>{children}</strong>
 * </Slottable>
 *
 * // Throws an error
 * // Won't work, because Slottable is no longer a direct child of the Slot.
 * <strong>
 *   <Slottable>{children}</Slottable>
 * </strong>
 *
 * // We need the <a> to be the only child inside Slottable, that means the only place
 * // where the <strong> can be is inside the <a>, wrapped around it's children.
 * // But <a> is part of the children passed, that's where this function comes in!
 * // Returns <a href="#"><strong>Hello World!</strong></a>
 * <Slottable>
 *   {decorateSlottable(true, children, (children) => <strong>{children}</strong>)}
 * </Slottable>
 */
export function decorateSlottable(
  asChild: true | undefined,
  children: ReactNode,
  render: (children: ReactNode) => ReactNode,
) {
  return asChild
    ? React.isValidElement(children)
      ? React.cloneElement(children, undefined, render((children.props as { children: ReactNode }).children))
      : null
    : render(children);
}
