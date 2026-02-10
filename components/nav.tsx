import Link from "next/link";

const links = [
  { href: "/", label: "Plataforma" },
  { href: "/assinante", label: "Painel do Assinante" },
  { href: "/dashboard", label: "Dashboard Corretores" }
];

export function Nav() {
  return (
    <header className="header">
      <div className="container nav-wrap">
        <strong>Meu Apê Tem SaaS</strong>
        <nav>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
