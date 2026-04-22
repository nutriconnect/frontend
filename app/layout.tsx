import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { getThemeClassName } from '@/lib/theme';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Nutri Red — Tu nutricionista, a un clic',
  description:
    'Conectamos a personas que quieren cuidar su alimentación con nutricionistas certificados.',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const themeClass = getThemeClassName();
  const { locale } = await params;

  return (
    <html
      lang={locale || 'en'}
      className={`${cormorant.variable} ${dmSans.variable} ${themeClass} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
