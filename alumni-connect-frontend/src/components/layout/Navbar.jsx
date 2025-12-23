/*
 * LOKASI FILE: alumni-connect-frontend/src/components/layout/Navbar.jsx
 * 
 * CARA BUAT FOLDER:
 * 1. Masuk ke folder: alumni-connect-frontend/src/components/
 * 2. Buat folder: layout/
 * 3. Masuk ke: layout/
 * 4. Buat file: Navbar.jsx (file ini)
 * 
 * PATH LENGKAP: alumni-connect-frontend/src/components/layout/Navbar.jsx
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Beranda', href: '#home' },
    { label: 'Fitur', href: '#features' },
    { label: 'Tentang', href: '#about' },
    { label: 'Kontak', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text">
                Alumni Connect
              </h1>
              <p className="text-xs text-dark-500 font-medium">
                Telkom University
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-dark-700 hover:text-primary-600 font-semibold transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="md"
              icon={<LogIn className="w-5 h-5" />}
              onClick={() => window.location.href = '/login'}
            >
              Masuk
            </Button>
            <Button 
              variant="primary" 
              size="md"
              icon={<UserPlus className="w-5 h-5" />}
              onClick={() => window.location.href = '/register'}
            >
              Daftar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-dark-700 hover:text-primary-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-down">
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-dark-700 hover:text-primary-600 font-semibold py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              <div className="flex flex-col gap-2 pt-4 border-t border-dark-200">
                <Button 
                  variant="outline" 
                  size="md" 
                  fullWidth
                  icon={<LogIn className="w-5 h-5" />}
                  onClick={() => window.location.href = '/login'}
                >
                  Masuk
                </Button>
                <Button 
                  variant="primary" 
                  size="md" 
                  fullWidth
                  icon={<UserPlus className="w-5 h-5" />}
                  onClick={() => window.location.href = '/register'}
                >
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;