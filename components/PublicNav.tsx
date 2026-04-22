'use client';

export function PublicNav() {
  return (
    <nav className="lp-nav">
      href={`/${locale}/`} className="nav-logo">
        nutri<span>red</span>
      </a>
      <ul className="nav-links">
        <li>href={`/${locale}/nutritionists`}>Buscar nutricionistas</a></li>
        <li>href={`/${locale}/how`}>Cómo funciona</a></li>
        <li>href={`/${locale}/for-nutritionists`}>Para nutricionistas</a></li>
      </ul>
      href={`/${locale}/login`} className="btn-nav">Iniciar sesión</a>
    </nav>
  );
}
