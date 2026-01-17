import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from '@/schema/api';

const umoriClient = createClient<paths>({
  baseUrl: 'http://localhost:8080',
});
const authMiddleware: Middleware = {
  onRequest({ request }) {
    request.headers.set('Authorization', `Basic ${btoa('quagga:omnivoregarden42')}`);
    return request;
  },
};
umoriClient.use(authMiddleware);

export default umoriClient;
