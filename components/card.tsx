export function Card({
  title,
  value,
  subtitle
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <article className="card">
      <p>{title}</p>
      <h3>{value}</h3>
      <small>{subtitle}</small>
    </article>
  );
}
