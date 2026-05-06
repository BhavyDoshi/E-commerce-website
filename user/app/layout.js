import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from './providers';

export const metadata = {
  title: 'E-commerce User',
  description: 'User storefront for the e-commerce platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
