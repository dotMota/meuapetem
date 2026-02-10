import Link from "next/link";

const links = [
  { href: "/", label: "Plataforma" },
  { href: "/dashboard", label: "Painel da Imobiliária" }
];

export function Nav() {
  return (
    <header className="header">
      <div className="container nav-wrap">
        <strong>Meu Apê Tem | Plataforma para Imobiliárias</strong>
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
