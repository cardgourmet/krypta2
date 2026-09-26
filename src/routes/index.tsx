import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/parcels/homepage/Home/Home.tsx';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Home />;
}
