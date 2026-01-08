import { MantineProvider } from '@mantine/core';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import App from '@/components/App.tsx';
import { theme } from '../theme';

export const Route = createRootRoute({
  component: () => (
    <>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <App />

        <TanStackDevtools
          config={{
            triggerHidden: true,
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </MantineProvider>
    </>
  ),
});
