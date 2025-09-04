import Link from "next/link";

export default function NavBar() {
  return (
<nav className="bg-white/50 backdrop-blur-md px-6 py-4 flex justify-center items-center">
      <div className="text-center">
  <Link
    href="/"
    className="text-2xl font-bold text-gray-800 hover:text-red-300 transition"
  >
    Fragrance Catalog
  </Link>
  <p className="text-gray-600 text-sm mt-1">
    Browse through the most popular fragrances
  </p>
</div>
    </nav>
  );
}

/*
 <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
          About
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">
          Contact
        </Link>
 */
