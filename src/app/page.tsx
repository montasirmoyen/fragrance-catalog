
"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../../components/navbar";
import fragrances from "../../data/fragrances.json";

export default function Page() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [designerFilter, setDesignerFilter] = useState<string | null>(null);
  const [noteFilter, setNoteFilter] = useState<string | null>(null);
  const [designerSearch, setDesignerSearch] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [sortBy, setSortBy] = useState("Most popular");
  const [visibleCount, setVisibleCount] = useState(20);

  const designers = useMemo(() => {
    const brands: Record<string, number> = {};
    fragrances.forEach(f => {
      brands[f.Brand] = (brands[f.Brand] || 0) + 1;
    });
    return Object.entries(brands).sort((a, b) => b[1] - a[1]);
  }, []);

  const notes = useMemo(() => {
    const noteMap: Record<string, number> = {};
    fragrances.forEach(f => {
      Object.values(f.Notes).flat().forEach((note: string) => {
        noteMap[note] = (noteMap[note] || 0) + 1;
      });
    });
    return Object.entries(noteMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const filtered = useMemo(() => {
    let results = fragrances.filter(f => {
      if (
        search &&
        !(
          f.Name.toLowerCase().includes(search.toLowerCase()) ||
          f.Brand.toLowerCase().includes(search.toLowerCase())
        )
      )
        return false;
      if (genderFilter && f.Gender !== genderFilter) return false;
      if (designerFilter && f.Brand !== designerFilter) return false;
      if (noteFilter && !Object.values(f.Notes).flat().includes(noteFilter)) return false;
      return true;
    });

if (sortBy === "Longest longevity") {
  results = results.sort((a, b) => Number(b.Longevity) - Number(a.Longevity));
} else if (sortBy === "Highest sillage") {
  results = results.sort((a, b) => Number(b.Sillage) - Number(a.Sillage));
} else {
  results = results.sort((a, b) => a.ID - b.ID);
}


    return results;
  }, [search, genderFilter, designerFilter, noteFilter, sortBy]);

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="flex">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <button
            className="text-sm text-red-500 mb-4"
            onClick={() => {
              setGenderFilter(null);
              setDesignerFilter(null);
              setNoteFilter(null);
              setSearch("");
            }}
          >
            Clear all filters
          </button>

          {/* Sort */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Sort by</label>
            <select
  className="w-full border rounded p-2"
  value={sortBy}
  onChange={e => setSortBy(e.target.value)}
>
  <option>Most popular</option>
  <option>Longest longevity</option>
  <option>Highest sillage</option>
</select>

          </div>

          {/* Gender */}
          <div className="mb-6">
            <p className="font-medium mb-2">Gender</p>
            {["male", "female", "unisex"].map(g => (
              <button
                key={g}
                className={`block w-full text-sm text-left px-1 py-0.5 rounded hover:bg-gray-100 ${
                  genderFilter === g ? "bg-purple-100 font-semibold" : ""
                }`}
                onClick={() => setGenderFilter(genderFilter === g ? null : g)}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Designers */}
          <div className="mb-6">
            <p className="font-medium mb-2">Designers</p>
            <input
              type="text"
              placeholder="Search designers..."
              className="w-full border rounded p-1 mb-2"
              value={designerSearch}
              onChange={(e) => setDesignerSearch(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto text-sm">
              {designers
                .filter(([d]) =>
                  d.toLowerCase().includes(designerSearch.toLowerCase())
                )
                .map(([d, count]) => (
                  <button
                    key={d}
                    className={`block w-full text-left px-1 py-0.5 rounded hover:bg-gray-100 ${
                      designerFilter === d ? "bg-blue-100 font-semibold" : ""
                    }`}
                    onClick={() =>
                      setDesignerFilter(designerFilter === d ? null : d)
                    }
                  >
                    {d} ({count})
                  </button>
                ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="font-medium mb-2">Notes</p>
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full border rounded p-1 mb-2"
              value={noteSearch}
              onChange={(e) => setNoteSearch(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto text-sm">
              {notes
                .filter(([n]) =>
                  n.toLowerCase().includes(noteSearch.toLowerCase())
                )
                .slice(0, 50)
                .map(([note, count]) => (
                  <button
                    key={note}
                    className={`block w-full text-left px-1 py-0.5 rounded hover:bg-gray-100 ${
                      noteFilter === note ? "bg-green-100 font-semibold" : ""
                    }`}
                    onClick={() =>
                      setNoteFilter(noteFilter === note ? null : note)
                    }
                  >
                    {note} ({count})
                  </button>
                ))}
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN */}
        <section className="flex-1 p-8">
          {/* Search bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search fragrance name or designer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border rounded-lg p-3 shadow-sm"
            />
          </div>

          {/* Fragrance grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.slice(0, visibleCount).map(f => (
              <Link key={f.ID} href={`/fragrance/${f.ID}`}>
<div className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-lg transition cursor-pointer h-[300px]">
                  <div className="relative w-full h-48 mb-4">
  <Image
    src={f["Image URL"]}
    alt={f.Name}
    fill
    className="object-contain rounded-lg"
  />
</div>
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
  {f.Name}
</h2>
<p className="text-gray-600 line-clamp-1">{f.Brand}</p>
                  {/* <p className="text-green-700 font-medium mt-2">${f.Price}</p> */}
                </div>
              </Link>
            ))}
          </div>

          {/* Show More */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                onClick={() => setVisibleCount(prev => prev + 20)}
              >
                Show More
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
