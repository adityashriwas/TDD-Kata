"use client";
import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';

const NavBar = () => {
  const { user, logout } = useAuthContext();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="container-md flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold">Sweet Shop</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          {user?.role === 'admin' && (
            <Link href="/admin/sweets" className="hover:underline">Admin</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
