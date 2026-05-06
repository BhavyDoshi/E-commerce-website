import './globals.css';
import AdminNav from '@/components/AdminNav';
import Providers from './providers';

export const metadata = {
  title: 'E-commerce Admin',
  description: 'Admin dashboard for the e-commerce platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AdminNav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
