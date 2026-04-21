import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es';
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid (middleware and layout already validate, but provide fallback)
  const validLocale = locale && locales.includes(locale as Locale) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});
