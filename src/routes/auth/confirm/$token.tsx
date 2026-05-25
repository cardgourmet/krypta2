import { createFileRoute, redirect } from '@tanstack/react-router';
import { confirmEmailAddress } from '@/parcels/auth/api.ts';

const UUID_REGEX = /^[0-9A-Fa-f]{8}(-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/;

export const Route = createFileRoute('/auth/confirm/$token')({
  beforeLoad: ({ params }) => {
    const token = params.token;
    if (!UUID_REGEX.test(token)) {
      throw redirect({
        to: '/',
      });
    }
  },
  loader: async ({ params, context }) => {
    const token = params.token;

    const result = await confirmEmailAddress({ token: token });
    if (result.error) {
      return;
    }

    // verify success, please relogin
    if (context.auth.user) {
      context.auth.logout();
    }
    context.auth.verify();

    throw redirect({
      to: '/login',
      search: {},
    });
  },
});
