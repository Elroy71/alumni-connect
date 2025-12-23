/*
 * LOKASI FILE: alumni-connect-frontend/src/components/layout/Footer.jsx
 * 
 * CARA BUAT:
 * 1. Masuk ke folder: alumni-connect-frontend/src/components/layout/
 * 2. Buat file: Footer.jsx (file ini)
 * 
 * PATH LENGKAP: alumni-connect-frontend/src/components/layout/Footer.jsx
 */

import React from 'react';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter,
  Heart 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: 'Tentang Kami', href: '#' },
      { label: 'Visi & Misi', href: '#' },
      { label: 'Tim Kami', href: '#' },
      { label: 'Karir', href: '#' },
    ],
    features: [
      { label: 'Forum Alumni', href: '#' },
      { label: 'Lowongan Kerja', href: '#' },
      { label: 'Event', href: '#' },
      { label: 'Funding', href: '#' },
    ],
    support: [
      { label: 'Bantuan', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Kebijakan Privasi', href: '#' },
      { label: 'Syarat & Ketentuan', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="bg-gradient-dark text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      
      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">Alumni Connect</h3>
                <p className="text-sm text-dark-300">Telkom University</p>
              </div>
            </div>
            
            <p className="text-dark-300 mb-6 leading-relaxed">
              Platform jejaring alumni Sistem Informasi Telkom University. 
              Mempererat hubungan, berbagi peluang, dan tumbuh bersama.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-dark-300">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-sm">Jl. Telekomunikasi No.1, Bandung</span>
              </div>
              <div className="flex items-center gap-3 text-dark-300">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-sm">alumni@telkomuniversity.ac.id</span>
              </div>
              <div className="flex items-center gap-3 text-dark-300">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-sm">+62 22 7564108</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Tentang</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-dark-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Fitur</h4>
            <ul className="space-y-3">
              {footerLinks.features.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-dark-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Dukungan</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-dark-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-dark-700 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-dark-300 text-sm">
              <span>© {currentYear} Alumni Connect.</span>
              <span>Dibuat dengan</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>oleh Tim Alumni SI</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-dark-800 hover:bg-gradient-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;