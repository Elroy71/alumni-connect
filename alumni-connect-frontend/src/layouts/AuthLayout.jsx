import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float animation-delay-400" />
      
      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-dark-600 hover:text-primary-600 transition-colors font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Beranda
      </Link>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="font-display font-bold text-2xl gradient-text">
                  Alumni Connect
                </h1>
                <p className="text-xs text-dark-500 font-medium">
                  Telkom University
                </p>
              </div>
            </Link>

            <h2 className="font-display font-bold text-3xl text-dark-900 mb-2">
              {title}
            </h2>
            <p className="text-dark-600">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;