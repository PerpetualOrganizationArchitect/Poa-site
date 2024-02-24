import Link from "next/link";

const Navigation = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/architect">Architect</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
};

export default Navigation;
