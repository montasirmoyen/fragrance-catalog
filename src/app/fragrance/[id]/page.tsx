import { notFound } from "next/navigation";
import Image from "next/image";
import NavBar from "../../../../components/navbar";
import fragrances from "../../../../data/fragrances.json";
import notes_images from "../../../../data/notes.json";
import accords from "../../../../data/accords.json";
import Link from "next/link";
import FragranceGalleryClient from "../../../../components/gallery";

type Props = { params: { id: string } };

const ProgressBar = ({ value, color }: { value: number; color: string }) => {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-2 rounded-full transition-all"
        style={{
          width: `${value}%`,
          backgroundColor: color,
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
    <Link href={`/fragrance/${fragrance.ID}`} className="block flex-shrink-0">
      <div className="bg-white shadow-md rounded-lg p-3 w-40 lg:w-48 hover:shadow-xl transition-all hover:scale-[1.02]">
        <div className="relative w-full h-28 lg:h-32 mb-2">
          <Image
            src={fragrance["Image URL"]}
            alt={fragrance.Name}
            fill
            className="object-contain rounded"
          />
        </div>
        <h3 className="text-xs lg:text-sm font-semibold line-clamp-2">{fragrance.Name}</h3>
        <p className="text-xs text-gray-500 line-clamp-1">{fragrance.Brand}</p>
      </div>
    </Link>
  );
}

export default async function FragrancePage({ params }: Props) {
  const awaitedParams = await params;
  const fragrance = fragrances.find((f) => f.ID === parseInt(awaitedParams.id));
  if (!fragrance) return notFound();

  return (
    <main className="min-h-screen bg-[url('/background1.png')] bg-cover bg-center bg-fixed">
      <NavBar />

      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        <div className="bg-white/75 backdrop-blur-sm shadow-lg rounded-xl lg:rounded-2xl p-4 lg:p-6">
          <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
            <div className="relative w-full md:w-64 h-64 md:h-80 flex-shrink-0 mx-auto md:mx-0">
              <Image
                src={fragrance["Image URL"]}
                alt={fragrance.Name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="flex-1">
              {fragrance["Designer Image URL"] && (
                <div className="mb-3">
                  <Image
                    src={fragrance["Designer Image URL"]}
                    alt={`${fragrance.Brand} Designer`}
                    width={120}
                    height={80}
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                {fragrance.Name}
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mb-1">
                for {genderToProperCase(fragrance.Gender)}
              </p>
              <p className="text-sm lg:text-base text-gray-500 mb-4">{fragrance.Brand}</p>
              <a
                href={fragrance["Purchase URL"]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
              >
                Purchase
              </a>

              {/* Accord Progress Bars */}
              {fragrance.Accords && fragrance.Accords.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-sm lg:text-base font-semibold mb-2">Main Accords</h2>
                  <div className="flex flex-wrap gap-2">
                    {fragrance.Accords.map((accord, index) => {
                      const key = accord.toLowerCase() as keyof typeof accords;
                      const color = accords[key] ?? "#ccc";
                      const textColor = getTextColor(color);

                      return (
                        <div
                          key={accord}
                          className="text-center rounded-lg px-3 py-1.5 text-xs lg:text-sm font-medium lowercase"
                          style={{ backgroundColor: color, color: textColor }}
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
            className="mt-4 text-sm lg:text-base text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: returnDesc(fragrance) }}
          />

          {fragrance.Perfumer && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-4">
              <h3 className="text-sm lg:text-base font-semibold">Perfumer</h3>
              <div className="flex items-center gap-2">
                <Image
                  src={fragrance["Perfumer Image URL"]}
                  alt={fragrance.Perfumer}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span className="text-sm lg:text-base text-gray-800">{fragrance.Perfumer}</span>
              </div>
            </div>
          )}

          <FragranceGalleryClient
            images={fragrance['Fragrance Images']}
            fragranceName={fragrance.Name}
          />

          <h2 className="text-base lg:text-lg font-semibold mt-6 mb-3">Ideal Time to Wear</h2>

          {/* Season Ranking */}
          <div className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {fragrance["Season Ranking"].map((s: any) => (
                <div key={s.name} className="flex items-center gap-3">
                  <Image
                    src={`/${s.name.toLowerCase()}.png`}
                    alt={s.name}
                    width={28}
                    height={28}
                    className="object-contain flex-shrink-0"
                    style={{ filter: "contrast(0)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm capitalize mb-1">{s.name}</p>
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
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {fragrance["Time Ranking"].map((t: any) => (
              <div key={t.name} className="flex items-center gap-3">
                <Image
                  src={`/${t.name.toLowerCase()}.png`}
                  alt={t.name}
                  width={28}
                  height={28}
                  className="object-contain flex-shrink-0"
                  style={{ filter: "contrast(0)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm capitalize mb-1">{t.name}</p>
                  <ProgressBar
                    value={(parseInt(t.value) / 100) * 100}
                    color={getBarColor((parseInt(t.value) / 100) * 100)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Performance */}
          <h2 className="text-base lg:text-lg font-semibold mt-6 mb-3">Performance</h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/longevity.png"
                alt="Longevity"
                width={28}
                height={28}
                className="flex-shrink-0"
                style={{ filter: "contrast(0)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-1">Longevity</p>
                <ProgressBar value={parseInt(fragrance.Longevity)} color={getBarColor(parseInt(fragrance.Longevity))} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="/sillage.png"
                alt="Sillage"
                width={28}
                height={28}
                className="flex-shrink-0"
                style={{ filter: "contrast(0)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-1">Sillage</p>
                <ProgressBar value={parseInt(fragrance.Sillage)} color={getBarColor(parseInt(fragrance.Sillage))} />
              </div>
            </div>
          </div>

          {/* Fragrance Notes */}
          {fragrance.Notes && (
            <div className="mt-6">
              <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-center">Fragrance Notes</h2>

              {fragrance.Notes.Top?.length > 0 && (
                <div className="mb-4 text-center">
                  <h3 className="text-lg lg:text-xl font-medium mb-2">Top Notes</h3>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {fragrance.Notes.Top.map((note: string, i: number) => {
                      const imgSrc = notes_images[note as keyof typeof notes_images] ?? "/unknown.png";
                      return (
                        <span key={i} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-50 text-sm lg:text-base">
                          <Image
                            src={imgSrc}
                            alt={note}
                            width={32}
                            height={32}
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
                  <h3 className="text-lg lg:text-xl font-medium mb-2">Middle Notes</h3>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {fragrance.Notes.Middle.map((note: string, i: number) => {
                      const imgSrc = notes_images[note as keyof typeof notes_images] ?? "/unknown.png";
                      return (
                        <span key={i} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-50 text-sm lg:text-base">
                          <Image
                            src={imgSrc}
                            alt={note}
                            width={32}
                            height={32}
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
                  <h3 className="text-lg lg:text-xl font-medium mb-2">Base Notes</h3>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {fragrance.Notes.Base.map((note: string, i: number) => {
                      const imgSrc = notes_images[note as keyof typeof notes_images] ?? "/unknown.png";
                      return (
                        <span key={i} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-50 text-sm lg:text-base">
                          <Image
                            src={imgSrc}
                            alt={note}
                            width={32}
                            height={32}
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
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="bg-white/50 backdrop-blur-sm shadow-md rounded-xl lg:rounded-2xl p-4 lg:p-6 mt-4 lg:mt-8">
            <h2 className="text-base lg:text-lg font-semibold mb-4">This perfume reminds me of</h2>
            <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {getSimilarFragrances(fragrance, fragrances).map((f) => (
                <FragranceCard key={f.ID} fragrance={f} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More from Designer */}
      {getMoreFromDesigner(fragrance, fragrances).length > 0 && (
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="bg-white/50 backdrop-blur-sm shadow-md rounded-xl lg:rounded-2xl p-4 lg:p-6 mt-4 lg:mt-8">
            <h2 className="text-base lg:text-lg font-semibold mb-4">
              More from {fragrance.Brand}
            </h2>
            <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {getMoreFromDesigner(fragrance, fragrances).map((f) => (
                <FragranceCard key={f.ID} fragrance={f} />
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-xs lg:text-sm text-gray-500 mt-6 lg:mt-8 mb-4 px-4">
        Images sourced from <a href="https://www.fragrantica.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Fragrantica</a>.
        All rights reserved to their respective owners.
      </footer>
    </main>
  );
}