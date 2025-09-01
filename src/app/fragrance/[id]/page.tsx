import { notFound } from "next/navigation";
import Image from "next/image";
import NavBar from "../../../../components/navbar";
import fragrances from "../../../../data/fragrances.json";
import notes_images from "../../../../data/notes.json";
import accords from "../../../../data/accords.json";
import Link from "next/link";

type Props = { params: { id: string } };

const ProgressBar = ({ value, color }: { value: number; color: string }) => {
  const isTailwindClass = color.startsWith("bg-");

  return (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        className={`h-2 rounded ${isTailwindClass ? color : ""}`}
        style={{
          width: `${value}%`,
          backgroundColor: isTailwindClass ? undefined : color,
        }}
      />
    </div>
  );
};

function isNewFragrance(releaseYear: string) {
  const currentYear = new Date().getFullYear();
  return currentYear - parseInt(releaseYear, 10) <= 1;
}

function returnDesc(f: any) {
  const firstAccord = f.Accords[0] ?? "fragrance";

  let description = `<strong>${f.Name}</strong> by <strong>${f.Brand}</strong> is a ${firstAccord} fragrance. `;

  if (isNewFragrance(f.Release)) {
    description += "This is a new fragrance. ";
  }

  description += `${f.Name} was launched in ${f.Release}. `;

  if (f.Notes.Top?.length) {
    description += `Top notes are ${f.Notes.Top.join(", ")}; `;
  }

  if (f.Notes.Middle?.length) {
    description += `middle notes are ${f.Notes.Middle.join(", ")}; `;
  }

  if (f.Notes.Base?.length) {
    description += `base notes are ${f.Notes.Base.join(", ")}.`;
  }

  return description.trim();
}

function getTextColor(hex: string) {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? "black" : "white";
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
  if (value < 25) return "#ff4d4f"
  if (value < 40) return "#fa8c16"
  if (value < 60) return "#fadb14"
  if (value < 85) return "#52c41a"
  return "#1890ff"
}

function FragranceCard({ fragrance }: { fragrance: any }) {
  return (
    <Link href={`/fragrance/${fragrance.ID}`} className="block">
      <div className="bg-white shadow rounded-lg p-4 w-48 hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
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
    <main className="min-h-screen bg-gray-50 bg-[url('/background1.png')] bg-cover bg-center bg-fixed">
      <NavBar />

      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white shadow-md rounded-2xl p-4">

          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-150 h-150">
              <Image
                src={fragrance["Image URL"]}
                alt={fragrance.Name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div>
              {fragrance["Designer Image URL"] && (
                <div>
                  <Image
                    src={fragrance["Designer Image URL"]}
                    alt={`${fragrance.Brand} Designer`}
                    width={150}
                    height={100}
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

              {/* Accord Progress Bars */}
              {fragrance.Accords && fragrance.Accords.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-sm font-semibold">Main Accords</h2>
                  <div className="flex flex-col gap-1 mt-2">
                    {fragrance.Accords.map((accord, index) => {
                      const key = accord.toLowerCase() as keyof typeof accords;
                      const color = accords[key] ?? "#ccc";
                      const textColor = getTextColor(color);
                      const width = `${Math.max(50, 100 - index * 8)}%`;

                      return (
                        <div
                          key={accord}
                          className="text-center rounded-lg px-3 py-1 text-sm font-medium lowercase"
                          style={{ backgroundColor: color, color: textColor, width }}
                        >
                          {accord}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p
            className="mt-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: returnDesc(fragrance) }}
          />

          {fragrance.Perfumer && (
            <div className="flex items-center gap-3 mt-4">
              <h3 className="text-md font-semibold">Perfumer</h3>
              <div className="flex items-center gap-2">
                <Image
                  src={fragrance["Perfumer Image URL"]}
                  alt={fragrance.Perfumer}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span className="text-gray-800">{fragrance.Perfumer}</span>
              </div>
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
        <div className="bg-white/50 backdrop-blur-md shadow-md rounded-2xl p-6 mt-8">
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
        <div className="bg-white/50 backdrop-blur-md shadow-md rounded-2xl p-6 mt-8">
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

      <footer className="text-center text-sm text-gray-500 mt-8 mb-4">
        Images sourced from <a href="https://www.fragrantica.com/" target="_blank" rel="noopener noreferrer" className="underline">Fragrantica</a>.
        All rights reserved to their respective owners.
      </footer>
    </main>
  );
}