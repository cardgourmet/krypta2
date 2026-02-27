import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me/favorites/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/me/favorites/"!</div>
}
