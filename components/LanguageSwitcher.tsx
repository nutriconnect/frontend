'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const switchLocale = async (newLocale: string) => {
    try {
      // Update cookie
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

      // Update user preference if logged in (ignore errors)
      try {
        await api.put('/user/preferences', { preferred_locale: newLocale });
      } catch (e) {
        // Silently fail - user may not be logged in
      }

      // Redirect to new locale
      const segments = pathname.split('/');
      segments[1] = newLocale; // Replace locale segment
      const newPath = segments.join('/');

      router.push(newPath);
      router.refresh();
    } catch (error) {
      console.error('Failed to switch locale:', error);
    }
  };

  if (!isClient) {
    return (
      <button
        style={{
          width: '100%',
          background: 'rgba(90, 138, 64, 0.08)',
          border: '1px solid rgba(90, 138, 64, 0.2)',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: 'var(--nc-stone)',
          transition: 'all 0.2s ease',
          opacity: 0.5,
        }}
        disabled
      >
        <span style={{ fontSize: 16 }}>🌐</span>
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => switchLocale(locale === 'es' ? 'en' : 'es')}
      style={{
        width: '100%',
        background: 'rgba(240, 244, 235, 0.1)',
        border: '1px solid rgba(240, 244, 235, 0.2)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: 'rgba(240, 244, 235, 0.9)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(240, 244, 235, 0.15)';
        e.currentTarget.style.borderColor = 'rgba(240, 244, 235, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(240, 244, 235, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(240, 244, 235, 0.2)';
      }}
    >
      <span style={{ fontSize: 16 }}>🌐</span>
      <span>{locale === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
}
