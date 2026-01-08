import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/mtg/')({
  loader: () => {
    throw redirect({
      to: '/dlc/cards',
    });
  },
});
