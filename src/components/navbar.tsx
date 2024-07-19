import Link from 'next/link';
import { useState } from 'react';
import { Providers } from '../app/providers';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import "@/globals.css";



const Navbar = () => {

    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-gray-800 rounded-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 justify-center">
                    <Link href="/home" className="text-white font-bold text-3xl">
                        CRYPTO-CHOISE
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;