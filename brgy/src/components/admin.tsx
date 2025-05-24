"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--color-primary)] text-[var(--color-text-secondary)] px-6 py-2 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <Image src="/favicon.svg" alt="BEIS logo" width={50} height={50} />
        <span className="font-bold text-lg ml-[10%]">BEIS</span>
      </div>

      {/* Log Out Button */}
      <Link href="/" className="hover:opacity-90 transition-opacity">
        <button
          className="px-4 py-1.5 rounded text-xs font-semibold"
          style={{ backgroundColor: 'var(--color-red)', color: 'var(--color-bg)' }}
        >
          Disconnect Wallet
        </button>
      </Link>

    </nav>
  );
}
