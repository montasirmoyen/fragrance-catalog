import { notFound } from "next/navigation";
import Image from "next/image";
import NavBar from "../../../../components/navbar";
import fragrances from "../../../../data/fragrances.json";
import notes_images from "../../../../data/notes.json";
import Link from "next/link";

type Props = { params: { id: string } };

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-gray-300 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function getAllNotes(f: any): string[] {
  if (!f || !f.Notes) return [];
  const groups = Object.values(f.Notes) as string[][];
  return Array.from(
    new Set(
      groups.flat().map(n => String(n).trim().toLowerCase())
    )
  );
}

function getSimilarFragrances(current: any, all: any[]) {
  const curSet = new Set(getAllNotes(current));
  if (curSet.size === 0) return [];

  return all.filter(f => {
    if (f.ID === current.ID) return false;
    let matches = 0;
    for (const n of getAllNotes(f)) {
      if (curSet.has(n)) {
        matches++;
        if (matches >= 3) return true;
      }
    }
    return false;
  });
}

function getMoreFromDesigner(current: any, all: any[]) {
  return all.filter(f => f.Brand === current.Brand && f.ID !== current.ID);
}

function genderToProperCase(g: string) {
  if (g.toLowerCase() === "male") return "men";
  if (g.toLowerCase() === "female") return "women";
  return "men & women";
}

function getBarColor(value: number) {
  if (value < 25) return "bg-red-500"
  if (value < 40) return "bg-orange-400"
  if (value < 60) return "bg-yellow-400"
  if (value < 85) return "bg-green-500"
  return "bg-blue-500"
}

function FragranceCard({ fragrance }: { fragrance: any }) {
  return (
    <Link href={`/fragrance/${fragrance.ID}`} className="block">
      <div className="bg-white shadow rounded-lg p-4 w-48 hover:shadow-lg transition">
        <div className="relative w-full h-32 mb-2">
          <Image
            src={fragrance["Image URL"]}
            alt={fragrance.Name}
            fill
            className="object-contain rounded"
          />
        </div>
        <h3 className="text-sm font-semibold">{fragrance.Name}</h3>
        <p className="text-xs text-gray-500">{fragrance.Brand}</p>
      </div>
    </Link>
  );
}

export default async function FragrancePage({ params }: Props) {
  const awaitedParams = await params;
  const fragrance = fragrances.find((f) => f.ID === parseInt(awaitedParams.id));
  if (!fragrance) return notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white shadow-md rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-6">

            <div className="relative w-100 h-75">
              <Image
                src={fragrance["Image URL"]}
                alt={fragrance.Name}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            <div>
              {fragrance["Designer Image URL"] && (
                <div className="mt-4">
                  <Image
                    src={fragrance["Designer Image URL"]}
                    alt={`${fragrance.Brand} Designer`}
                    width={120}
                    height={120}
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              <h1 className="text-2xl font-bold">
                {fragrance.Name}{" "}
                <span className="text-xl text-gray-500">
                  for {genderToProperCase(fragrance.Gender)}
                </span>
              </h1>
              <p className="text-gray-500">{fragrance.Brand}</p>
              {/* <p className="text-green-700 font-medium mt-2">${fragrance.Price}</p> */}
              <a
                href={fragrance["Purchase URL"]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Purchase
              </a>
            </div>
          </div>

          {/* Accord List */}
          {fragrance.Accords && fragrance.Accords.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mt-4">Main Accords</h2>
              <p className="text-md capitalize">
                {fragrance.Accords.join(", ")}
              </p>
            </div>
          )}

          <h2 className="text-lg font-semibold mt-4">Ideal Time to Wear</h2>

          {/* Season Ranking */}
          <div className="mt-2">
            {/* <h2 className="text-lg font-semibold">Performance</h2> */}
            <div className="grid grid-cols-2 gap-4">
              {fragrance["Season Ranking"].map((s: any) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="inline-block">
                    <Image
                      src={`/${s.name.toLowerCase()}.png`}
                      alt={s.name}
                      width={32}
                      height={32}
                      className="object-contain"
                      style={{
                        filter: "contrast(0)",
                      }}
                    />
                  </span>
                  <div className="flex-1">
                    <p className="capitalize">{s.name}</p>
                    <ProgressBar
                      value={(parseInt(s.value) / 100) * 100}
                      color={getBarColor((parseInt(s.value) / 100) * 100)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Ranking */}
          <div className="mt-4 grid grid-cols-2 gap-6">
            {fragrance["Time Ranking"].map((t: any) => (
              <div key={t.name} className="flex items-center gap-3">
                <Image
                  src={`/${t.name.toLowerCase()}.png`}
                  alt={t.name}
                  width={32}
                  height={32}
                  style={{
                    filter: "contrast(0)",
                  }}
                />
                <div className="flex-1">
                  <p className="capitalize">{t.name}</p>
                  <ProgressBar
                    value={(parseInt(t.value) / 100) * 100}
                    color={getBarColor((parseInt(t.value) / 100) * 100)}
                  />
                </div>
              </div>
            ))}
          </div>


          {/* Performance */}
          <h2 className="text-lg font-semibold mt-4">Performance</h2>
          <div className="mt-2 grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/longevity.png"
                alt="Longevity"
                width={32}
                height={32}
                style={{
                  filter: "contrast(0)",
                }}
              />
              <div className="flex-1">
                <p>Longevity</p>
                <ProgressBar value={parseInt(fragrance.Longevity)} color={getBarColor(parseInt(fragrance.Longevity))} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="/sillage.png"
                alt="Sillage"
                width={32}
                height={32}
                style={{
                  filter: "contrast(0)",
                }}
              />
              <div className="flex-1">
                <p>Sillage</p>
                <ProgressBar value={parseInt(fragrance.Sillage)} color={getBarColor(parseInt(fragrance.Sillage))} />
              </div>
            </div>
          </div>

          {/* Fragrance Notes */}
          {fragrance.Notes && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">Fragrance Notes</h2>

              {fragrance.Notes.Top?.length > 0 && (
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-medium">Top Notes</h3>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {fragrance.Notes.Top.map((note: string, i: number) => {
                      const imgSrc = notes_images[note as keyof typeof notes_images] ?? "/unknown.png";
                      return (
                        <span key={i} className="flex items-center gap-2 px-3 py-1 rounded-lg text-md">
                          <Image
                            src={imgSrc}
                            alt={note}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                          {note}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {fragrance.Notes.Middle?.length > 0 && (
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-medium">Middle Notes</h3>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {fragrance.Notes.Middle.map((note: string, i: number) => {
                      const imgSrc = notes_images[note as keyof typeof notes_images] ?? "/unknown.png";
                      return (
                        <span key={i} className="flex items-center gap-2 px-3 py-1 rounded-lg text-md">
                          <Image
                            src={imgSrc}
                            alt={note}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                          {note}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {fragrance.Notes.Base?.length > 0 && (
                <div className="text-center">
                  <h3 className="text-xl font-medium">Base Notes</h3>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {fragrance.Notes.Base.map((note: string, i: number) => {
                      const imgSrc = notes_images[note as keyof typeof notes_images] ?? "/unknown.png";
                      return (
                        <span key={i} className="flex items-center gap-2 px-3 py-1 rounded-lg text-md">
                          <Image
                            src={imgSrc}
                            alt={note}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                          {note}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {getSimilarFragrances(fragrance, fragrances).length > 0 && (
        <div className="bg-white shadow-md rounded-2xl p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">This perfume reminds me of</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {getSimilarFragrances(fragrance, fragrances).map((f) => (
              <FragranceCard key={f.ID} fragrance={f} />
            ))}
          </div>
        </div>
      )}

      {/* More from Designer */}
      {getMoreFromDesigner(fragrance, fragrances).length > 0 && (
        <div className="bg-white shadow-md rounded-2xl p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">
            More from {fragrance.Brand}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {getMoreFromDesigner(fragrance, fragrances).map((f) => (
              <FragranceCard key={f.ID} fragrance={f} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}