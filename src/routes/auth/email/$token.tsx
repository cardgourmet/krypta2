import { createFileRoute, redirect } from '@tanstack/react-router';
import { confirmUpdateUserEmail } from '@/parcels/auth/api.ts';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';

const UUID_REGEX = /^[0-9A-Fa-f]{8}(-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/;

export const Route = createFileRoute('/auth/email/$token')({
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

    const result = await confirmUpdateUserEmail(token);
    if (result.error) {
      return;
    }

    // verify success, please relogin
    if (context.auth.user) {
      context.auth.logout();
    }
    useLocalUserStateStore.getState().setEmailHasChanged();

    throw redirect({
      to: '/login',
      search: {},
    });
  },
});
