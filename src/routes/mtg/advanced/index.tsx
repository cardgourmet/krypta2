import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mtg/advanced/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mtg/advanced/"!</div>
}
