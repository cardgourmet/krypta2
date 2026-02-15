import {Text} from '@mantine/core';
import {Link} from '@tanstack/react-router';
import {useAuth} from '@/parcels/auth/AuthContext.tsx';
import styles from '@/parcels/homepage/Navbar/Navbar.module.css';

export function UserDisplay() {
  const user = useAuth();

  console.log(user);

  return (
    <>
      {user && <Text>{user.displayName}</Text>}
      {!user && (
        <Link to={'/login'} style={{ textDecoration: 'none' }}>
          <button type="button" className={styles.loginButton}>
            Anmelden / Registrieren
          </button>
        </Link>
      )}
    </>
  );
}
