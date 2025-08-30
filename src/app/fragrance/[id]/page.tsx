import { notFound } from "next/navigation";
import Image from "next/image";
import NavBar from "../../../../components/navbar";
import fragrances from "../../../../data/fragrances.json";

type Props = { params: { id: string } };

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function FragrancePage({ params }: Props) {
  const fragrance = fragrances.find((f) => f.ID === parseInt(params.id));
  if (!fragrance) return notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-64 h-64">
              <Image
                src={fragrance["Image URL"]}
                alt={fragrance.Name}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{fragrance.Name}</h1>
              <p className="text-gray-600">{fragrance.Brand}</p>
              <p className="text-green-700 font-medium mt-2">${fragrance.Price}</p>
              <a
                href={fragrance["Purchase URL"]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Buy Now
              </a>
            </div>
          </div>

          {/* Season Ranking */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Best Seasons</h2>
            <div className="grid grid-cols-2 gap-4">
              {fragrance["Season Ranking"].map((s: any) => (
                <div key={s.name}>
                  <p className="capitalize">{s.name}</p>
                  <ProgressBar value={parseInt(s.value) / 100 * 100} color="bg-blue-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Time Ranking */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Best Time</h2>
            {fragrance["Time Ranking"].map((t: any) => (
              <div key={t.name} className="mb-2">
                <p className="capitalize">{t.name}</p>
                <ProgressBar value={parseInt(t.value) / 100 * 100} color="bg-yellow-400" />
              </div>
            ))}
          </div>

          {/* Longevity + Sillage */}
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Longevity</h2>
              <ProgressBar value={parseInt(fragrance.Longevity)} color="bg-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Sillage</h2>
              <ProgressBar value={parseInt(fragrance.Sillage)} color="bg-red-500" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}