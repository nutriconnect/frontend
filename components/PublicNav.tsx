'use client';

export function PublicNav() {
  return (
    <nav className="lp-nav">
      <a href="/" className="nav-logo">
        nutri<span>red</span>
      </a>
      <ul className="nav-links">
        <li><a href="/nutritionists">Buscar nutricionistas</a></li>
        <li><a href="/how">Cómo funciona</a></li>
        <li><a href="/for-nutritionists">Para nutricionistas</a></li>
      </ul>
      <a href="/login" className="btn-nav">Iniciar sesión</a>
    </nav>
  );
}
