import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  // TODO: button to login with username + password
  // TODO: button to login with Google or Github

  return <div>Hello "/login/"!</div>;
}
