import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white px-6 py-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
        Fragrance Catalog
      </Link>
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
