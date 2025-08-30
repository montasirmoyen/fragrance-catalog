import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Fragrance DB</h1>
      <div className="space-x-6">
        <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
          Home
        </Link>
        <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
          About
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">
          Contact
        </Link>
      </div>
    </nav>
  );
}