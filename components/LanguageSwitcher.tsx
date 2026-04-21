'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = async (newLocale: string) => {
    // Update cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // Update user preference if logged in (ignore errors)
    try {
      await api.put('/user/preferences', { preferred_locale: newLocale });
    } catch (e) {
      console.log('Failed to update user preference:', e);
    }

    // Redirect to new locale
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace locale segment
    const newPath = segments.join('/');
    router.push(newPath);
    router.refresh();
  };

  return (
    <button
      onClick={() => switchLocale(locale === 'es' ? 'en' : 'es')}
      style={{
        background: 'transparent',
        border: '1px solid var(--nc-border)',
        borderRadius: 6,
        padding: '6px 12px',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--nc-ink)',
      }}
    >
      {locale === 'es' ? '🇬🇧 English' : '🇪🇸 Español'}
    </button>
  );
}
