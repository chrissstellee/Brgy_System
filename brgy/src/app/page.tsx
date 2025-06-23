'use client';

// import Link from "next/link";
import React from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

import "@/styles/landing.css";
import "@/styles/container.css"; 
import "@/styles/geometry.css"

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/list");
    }
  }, [isConnected, router]);

  return (
    <div className="container">
      <Navbar />
      <div className="hero">
        <main className="main">
          <Image
            src="/landing-pic.svg"
            alt="Philippine icon"
            width={250}
            height={200}
            priority
            className="image"
          />
          <h1 className="title">BARANGAY INCIDENT REPORTING SYSTEM</h1>
          <p className="subtitle">
            A system for logging and tracking barangay incidents.
          </p>
          <ConnectButton showBalance={false} />
        </main>
      </div>
    </div>
  );
}
