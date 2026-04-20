import {MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';
import {TanStackDevtools} from '@tanstack/react-devtools';
import {createRootRouteWithContext} from '@tanstack/react-router';
import {TanStackRouterDevtoolsPanel} from '@tanstack/react-router-devtools';
import type {useAuth} from '@/parcels/auth/AuthContext.ts';
import App from '@/parcels/homepage/App/App.tsx';
import {theme} from '../theme';

type RouterContext = {
  auth: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <Notifications />
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
