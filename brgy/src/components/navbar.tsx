"use client";
import Image from "next/image";
import "@/styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Image src="/favicon.svg" alt="BEIS logo" width={50} height={50} />
        <span className="navbar-title">BIRS</span>
      </div>
    </nav>
  );
}
