import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { modalRegistry } from '@/modals.consts';
import type { useAuth } from '@/parcels/auth/AuthContext.ts';
import App from '@/parcels/homepage/App/App.tsx';
import { ModalContextProvider } from '@/parcels/modals/Modal.context';
import { ErrorComponent } from '@/parcels/router/ErrorComponent.tsx';
import SearchHistoryProvider from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider';
import TcgProvider from '@/parcels/tcg/TcgProvider';
import { theme } from '../theme';

type RouterContext = {
  auth: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <TcgProvider>
          <SearchHistoryProvider>
            <ModalContextProvider modals={modalRegistry}>
              <Notifications />
              <App />
            </ModalContextProvider>

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
          </SearchHistoryProvider>
        </TcgProvider>
      </MantineProvider>
    </>
  ),
  errorComponent: ErrorComponent,
});
