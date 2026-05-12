import {createFileRoute, redirect} from '@tanstack/react-router';
import z from 'zod';
import {LoginForm} from '@/parcels/auth/login/LoginForm.tsx';
import {ResetPasswordForm} from '@/parcels/auth/login/ResetPasswordForm.tsx';

export const loginParamsSchema = z.object({
  redirect: z.string().optional(),
  reset: z.string().optional(),
});

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.user?.id) {
      // if the user is already logged in -> forward to the home page
      throw redirect({
        to: '/',
      });
    }
  },
  validateSearch: loginParamsSchema,
});

function RouteComponent() {
  const { reset, redirect } = Route.useSearch();

  return (
    <>
      {!reset && <LoginForm />}

      {reset && <ResetPasswordForm token={reset} redirect={redirect} />}
    </>
  );
}
