import Image from "next/image";
import fragrances from "../../../../data/fragrances.json";

type Props = {
  params: { id: string };
};

export default function FragrancePage({ params }: Props) {
  const fragrance = fragrances.find((f) => f.ID.toString() === params.id);

  if (!fragrance) {
    return <h1 className="p-8 text-red-600">Fragrance not found</h1>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="relative w-full h-80 mb-6">
          <Image
            src={fragrance["Image URL"]}
            alt={fragrance.Name}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{fragrance.Name}</h1>
        <p className="text-lg text-gray-600 mb-2">{fragrance.Brand}</p>
        <p className="text-green-700 font-semibold text-xl mb-6">
          ${fragrance.Price}
        </p>

        <h2 className="text-xl font-semibold mb-2">Notes</h2>
        <ul className="mb-6 text-gray-700 list-disc pl-5">
          <li><strong>Top:</strong> {fragrance.Notes.Top.join(", ")}</li>
          <li><strong>Middle:</strong> {fragrance.Notes.Middle.join(", ")}</li>
          <li><strong>Base:</strong> {fragrance.Notes.Base.join(", ")}</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">Accords</h2>
        <p className="mb-6 text-gray-700">{fragrance.Accords.join(", ")}</p>

        <a
          href={fragrance["Purchase URL"]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Buy Now
        </a>
      </div>
    </main>
  );
}
