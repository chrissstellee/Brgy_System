'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // If user disconnects, redirect to homepage
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  return (
    <nav className="w-full bg-[var(--color-primary)] text-[var(--color-text-secondary)] px-6 py-2 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <Image src="/favicon.svg" alt="BEIS logo" width={50} height={50} />
        <span className="font-bold text-lg ml-[10%]">BEIS</span>
      </div>

      {/* RainbowKit Wallet Connect / Disconnect Button */}
      <ConnectButton showBalance={false} />
    </nav>
  );
}
