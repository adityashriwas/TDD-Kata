import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'Sweet Shop',
  description: 'Sweets inventory and storefront',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <main className="container-md py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
