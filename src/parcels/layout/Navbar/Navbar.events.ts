import { createUseCustomEvents } from '@/utils/createUseCustomEvents';

type NavbarEvents = {
  openSearchDrawer: (returnFocus?: boolean) => void;
};

export const [useNavbarEvents, createNavbarEvents] = createUseCustomEvents<NavbarEvents>('navbar');

export const navbar = {
  openSearchDrawer: (returnFocus?: boolean) => {
    createNavbarEvents('openSearchDrawer')(returnFocus);
  },
};
