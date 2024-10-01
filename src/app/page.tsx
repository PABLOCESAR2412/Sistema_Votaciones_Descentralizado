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
        <div className="text-center">

          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossOrigin="anonymous"></script>

          <ins className="adsbygoogle"
            style={{display: 'inline-block', width: '728px', height: '90px'}}
            data-ad-client="ca-pub-1234567890123456"
            data-ad-slot="1234567890"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
