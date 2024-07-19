"use client";

import React from "react";
import "@/globals.css";
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from "next/link";

const Home = () => {

  return (
    <div>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to the Web3 Voting System</h1>
        <br />
        <button className="bg-blue-800 hover:bg-blue-500 hover:scale-125 transition delay-150 p-4 rounded-lg">
          <Link href="/home" className="text-white font-bold text-3xl">
            Pagina principal
          </Link>
        </button>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
