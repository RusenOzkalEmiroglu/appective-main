import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import Footer from '@/components/Footer';
import { getSocialLinks } from '@/lib/data';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Appective | Turkey\'s Best Digital Advertising Agency',
  description: 'Appective - Turkey\'s Best Digital Advertising Agency',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const socialLinks = await getSocialLinks();

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="bg-dark text-light">
        {children}
        <Footer socialLinks={socialLinks} />
      </body>
    </html>
  );
}
