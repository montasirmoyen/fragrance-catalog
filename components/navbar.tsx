import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white/50 backdrop-blur-md px-4 lg:px-6 py-4 flex justify-center items-center sticky top-0 z-20 shadow-sm">
      <div className="text-center">
        <Link
          href="/"
          className="text-xl lg:text-2xl font-bold text-gray-800 hover:text-red-500 transition-colors"
        >
          Fragrance Catalog
        </Link>
        <p className="text-gray-600 text-xs lg:text-sm mt-1">
          Browse through the most popular fragrances
        </p>
      </div>
    </nav>
  );
}
