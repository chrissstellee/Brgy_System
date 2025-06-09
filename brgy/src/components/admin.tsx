/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

import "@/styles/navbar.css";

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
    <nav className="navbar">
          <div className="navbar-logo">
            <Image src="/favicon.svg" alt="BEIS logo" width={50} height={50} />
            <span className="navbar-title">BEIS</span>
          </div>

      {/* RainbowKit Wallet Connect / Disconnect Button */}
      <ConnectButton showBalance={false} />
    </nav>
  );
}
