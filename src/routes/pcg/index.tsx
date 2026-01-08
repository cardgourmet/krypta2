import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/pcg/')({
  loader: () => {
    throw redirect({
      to: '/dlc/cards',
    });
  },
});
