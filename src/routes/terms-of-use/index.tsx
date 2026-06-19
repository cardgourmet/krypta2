import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms-of-use/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/terms-of-use/"!</div>;
}
