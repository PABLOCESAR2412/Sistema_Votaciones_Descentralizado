// src/pages/home.tsx
"use client";
import React, {useEffect} from 'react';
import Link from 'next/link';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import Voting from '@/components/voting';
import '@/globals.css';

const HomePage: React.FC = () => {

  useEffect(() => {
    const btn1 = document.getElementById('btn1');
    const div2 = document.getElementById('div2');

    if (btn1 && div2) {
      btn1.addEventListener('click', () => {
        div2.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
  );
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Main content with minimum height */}
      <main className="flex-grow flex items-center justify-center rounded-md"
        style={{
          backgroundImage: "url('https://www.elindependiente.com/wp-content/uploads/2017/07/blockchain-g.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div className='w-4/5 p-14 grid grid-cols-1 mr-16 divide-y-4 divide-white divide-dotted '>
          <div id='div1' className='w-11/12 h96 backdrop-blur-xl rounded-3xl drop-shadow-2xl mr-2 mx-20 shadow-lg shadow-black p-4 my-20'>
            <h1 className="text-white text-4xl font-bold mb-8 flex-grow flex items-center justify-center my-6">
              Bienvenido al sistema de votaciones descentralizado
            </h1>
            <div className="text-white text-2xl text-center flex-grow flex items-center justify-center font-bold">
              <p>Este sistema de votaciones está basado en la tecnología blockchain y permite a los usuarios votar de forma segura y transparente.</p>
            </div>
            <br />
            <hr />
            <br />
            <div className="flex-grow flex items-center justify-center">
              <button id='btn1' className="transition ease-in-out delay-150 bg-white hover:-translate-y-1 hover:scale-110 hover:bg-slate-300 duration-300 rounded-md p-2 text-lg tracking-wide font-bold">
                Realizar votacion
              </button>
            </div>
          </div>
          <div id='div2'>
            <Voting />
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
