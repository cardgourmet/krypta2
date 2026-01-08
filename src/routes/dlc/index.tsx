import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/dlc/')({
  loader: () => {
    throw redirect({
      to: '/dlc/cards',
    });
  },
});
