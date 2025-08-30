import Image from "next/image";
import Link from "next/link";
import NavBar from "../../components/navbar";
import fragrances from "../../data/fragrances.json";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Fragrances</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {fragrances.map((f) => (
            <Link key={f.ID} href={`/fragrance/${f.ID}`}>
              <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-lg transition cursor-pointer">
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={f["Image URL"]}
                    alt={f.Name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>

                <h2 className="text-lg font-semibold text-gray-900">{f.Name}</h2>
                <p className="text-gray-600">{f.Brand}</p>
                <p className="text-green-700 font-medium mt-2">${f.Price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}