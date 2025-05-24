"use client";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--color-primary)] text-[var(--color-text-secondary)] px-6 py-2 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <Image src="/favicon.svg" alt="BEIS logo" width={50} height={50} />
        <span className="font-bold text-lg ml-[10%]">BEIS</span>
      </div>
    </nav>
  );
}

