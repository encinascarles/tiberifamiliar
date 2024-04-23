import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="mr-6 flex items-center space-x-2 font-bold text-orange-600 tracking-wide"
    >
      <span>Tiberi Familiar</span>
    </Link>
  );
};

export default Logo;
