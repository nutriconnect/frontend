// frontend/app/(auth)/verify-email/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, ApiRequestError } from '@/lib/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-verify when token is present in the URL.
  useEffect(() => {
    if (!token) return;
    setStatus('verifying');
    api.post('/auth/verify-email', { token })
      .then(() => {
        setStatus('success');
        setTimeout(() => router.push('/login'), 2000);
      })
      .catch((err) => {
        setStatus('error');
        if (err instanceof ApiRequestError) {
          if (err.code === 'TOKEN_EXPIRED') {
            setErrorMsg('El enlace ha expirado. Solicita uno nuevo.');
          } else {
            setErrorMsg('Enlace inválido o ya utilizado.');
          }
        } else {
          setErrorMsg('Algo salió mal. Inténtalo de nuevo.');
        }
      });
  }, [token, router]);

  if (token) {
    return (
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <a href="/" className="auth-logo" style={{ textAlign: 'left' }}>nutri<span>connect</span></a>

        {(status === 'idle' || status === 'verifying') && (
          <>
            <h1 className="auth-heading">Verificando…</h1>
            <p className="auth-sub">Por favor espera un momento.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1 className="auth-heading">¡Email <em>verificado</em>!</h1>
            <p className="auth-sub">Redirigiendo al inicio de sesión…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="auth-alert auth-alert-error">{errorMsg}</div>
            <h1 className="auth-heading">Enlace <em>inválido</em></h1>
            <p className="auth-sub">El enlace de verificación no es válido o ya fue usado.</p>
            <a href="/register" className="btn-auth" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem' }}>
              Volver al registro
            </a>
          </>
        )}
      </div>
    );
  }

  // No token — show "check your inbox" screen.
  return (
    <div className="auth-card" style={{ textAlign: 'center' }}>
      <a href="/" className="auth-logo" style={{ textAlign: 'left' }}>nutri<span>connect</span></a>

      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
      <h1 className="auth-heading">Revisa tu <em>correo</em></h1>
      <p className="auth-sub">
        Te enviamos un enlace de verificación. Haz clic en él para activar tu cuenta.
      </p>

      <a href="/register" className="btn-auth" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%' }}>
        Volver al registro
      </a>

      <hr className="auth-divider" />
      <p className="auth-footer">
        <a href="/login">Volver al inicio de sesión</a>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
