import { createFileRoute } from '@tanstack/react-router';
import { Logo } from '@/parcels/app/Logo/Logo';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <main style={{ display: 'grid', height: '100dvh', placeItems: 'center' }}>
      <Logo />
    </main>
  );
}
