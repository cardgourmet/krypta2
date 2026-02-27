import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me/bookmarks/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/me/bookmarks/"!</div>
}
