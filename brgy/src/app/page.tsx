'use client';

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import styles from "@/styles/geometry.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/list");
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <div className={`${styles.hero} relative overflow-hidden`}>
        <main className="flex flex-col items-center justify-center py-8 px-4 text-center gap-6 relative z-10">
          <Image
            src="/landing-pic.svg"
            alt="Philippine icon"
            width={250}
            height={200}
            priority
          />
          <h1 className="text-lg sm:text-2xl font-bold">
            BARANGAY INCIDENT REPORTING SYSTEM
          </h1>
          <p className="text-xs sm:text-sm">A system for logging and tracking barangay incidents.</p>

          {/* ✅ No Link needed — use effect handles routing after connect */}
          <ConnectButton showBalance={false} />
        </main>
      </div>
    </div>
  );
}
