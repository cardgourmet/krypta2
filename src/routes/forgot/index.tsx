import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { ResetPasswordForm } from '@/parcels/auth/login/ResetPasswordForm.tsx';

export const forgotParamsSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/forgot/')({
  component: RouteComponent,
  validateSearch: forgotParamsSchema,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return <ResetPasswordForm redirect={redirect} />;
}
