import createClient, { type Middleware } from 'openapi-fetch';
import type { UserSession } from '@/parcels/auth/AuthContext.ts';
import { CGM_USER_SESSION } from '@/parcels/auth/AuthContextProvider.tsx';
import type { paths } from '@/schema/api';

const umoriClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});
const authMiddleware: Middleware = {
  onRequest({ request }) {
    const session = JSON.parse(localStorage.getItem(CGM_USER_SESSION) ?? 'null') as UserSession | null;
    if (session?.token) {
      request.headers.set('x-user-session', session.token);
    }

    // TODO: only during testing. prod server won't expect basic authh
    request.headers.set('Authorization', `Basic ${btoa('quagga:omnivoregarden42')}`);
    return request;
  },
};
umoriClient.use(authMiddleware);

export default umoriClient;
