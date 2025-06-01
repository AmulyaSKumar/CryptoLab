import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ currentPage }) => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Introduction", path: "/c0-crypto" },
    { name: "Caesar Cipher", path: "/c1-caesar" },
    {name: "Playfair Cipher", path: "/c2-playfair"},
    { name: "Hill Cipher", path: "/c3-hill" },
    { name: "One Time Pad", path: "/c4-otp" },
    { name: "Vigenère Cipher", path: "/c5-vigenere" },
    { name: "Vernam Cipher", path: "/c6-vernam" },
    { name: "Rail Fence", path: "/c7-railfence" },
    {name: "DES", path: "/c8-des"},
    {name:"AES" ,path:'/c9-aes'},
    {name:"RSA", path:"/c10-rsa"},
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2"
        >
          <span className="text-sm">← Back</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {navItems.filter(item => item.path !== currentPage).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-4 py-2 text-sm text-slate-600 hover:text-emerald-600 rounded-md transition-colors relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          ))}
        </div>

        {/* Mobile navigation - simplified dropdown */}
        <div className="md:hidden relative">
          <Link
            to="/"
            className="px-3 py-1.5 text-sm text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 