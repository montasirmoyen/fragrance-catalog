import fragrances from "../../data/fragrances.json";

export default function Page() {
  return (
    <div>
      <h1>Fragrances</h1>
      <ul>
        {fragrances.map(f => (
          <li key={f.ID}>
            {f.Name} – {f.Brand} (${f.Price})
          </li>
        ))}
      </ul>
    </div>
  );
}