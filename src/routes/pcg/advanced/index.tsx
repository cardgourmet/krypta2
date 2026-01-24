import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pcg/advanced/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pcg/advanced/"!</div>
}
