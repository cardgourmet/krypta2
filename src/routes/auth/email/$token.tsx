import {createFileRoute, redirect} from '@tanstack/react-router';
import {confirmUpdateUserEmail} from '@/parcels/auth/api.ts';

const UUID_REGEX = /^[0-9A-Fa-f]{8}(-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/;

export const Route = createFileRoute('/auth/email/$token')({
  beforeLoad: ({ params, context }) => {
    const token = params.token;
    if (!UUID_REGEX.test(token)) {
      throw redirect({
        to: '/',
      });
    }

    if (context.auth.user?.state !== 'verified') {
      throw redirect({
        to: '/',
      });
    }
  },
  loader: async ({ params, context }) => {
    const token = params.token;

    const result = await confirmUpdateUserEmail(token);
    if (result.error) {
      return;
    }

    // verify success, please relogin
    context.auth.logout();
    context.auth.setEmailHasChanged();

    throw redirect({
      to: '/login',
      search: {},
    });
  },
});
