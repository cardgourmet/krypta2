import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { IconUser } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext';
import { Avatar as AvatarComponent } from '@/parcels/user/Avatar/Avatar';

const avatarStyle = new Style(definition);

export const UserNavbarTriggerContent = () => {
  const { user } = useAuth();

  const avatarUrl = useMemo(() => {
    if (!user) return;
    if (user.avatarUrl) return user.avatarUrl;

    const avatar = new Avatar(avatarStyle, { seed: user.id });
    return avatar.toDataUri();
  }, [user]);

  if (avatarUrl) {
    return <AvatarComponent alt={`Avatar of ${user?.displayName}`} src={avatarUrl} />;
  }

  return <IconUser />;
};
