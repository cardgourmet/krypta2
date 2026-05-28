import { startTransition, type TransitionFunction } from 'react';

// "If one frame is still not enough, use a double requestAnimationFrame"
// - and so I did. (it actually works, with only one it doesn't)
//
// This should only be used for things that React would normally try to render
// in the same render cycle as the calls before i.e., when it doesn't know how much
// render work the `scope` function actually triggers.
//
// For example: Calling the `navigate` function of TanStack-Router, which triggers a full re-render
// of pages like the set overview. Since these pages have a lot of nodes, this will cause a lag.
// (even though we just want to update the URL)
export function requestAnimationFrameTransition(scope: TransitionFunction) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      startTransition(scope);
    });
  });
}
