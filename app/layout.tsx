import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nutri Red — Tu nutricionista, a un clic',
  description:
    'Conectamos a personas que quieren cuidar su alimentación con nutricionistas certificados.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
