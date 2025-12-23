import React from 'react';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const CTASection = () => {
  const benefits = [
    'Akses gratis ke semua fitur premium',
    'Koneksi dengan 2,500+ alumni profesional',
    'Job board eksklusif untuk alumni',
    'Event dan webinar berkualitas',
    'Kartu alumni digital dengan QR code',
    'Dukungan komunitas 24/7'
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Animated orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary-300/20 rounded-full blur-3xl animate-float animation-delay-400" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">
          <Card glass padding="none" className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Content */}
              <div className="p-8 md:p-12 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  Pendaftaran Gratis
                </div>

                <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
                  Bergabung dengan Alumni Connect Sekarang!
                </h2>

                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Raih peluang karir terbaik, perluas jaringan profesional, dan 
                  berkontribusi untuk kemajuan bersama. Daftar sekarang, gratis!
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white/90">{benefit}</p>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="dark"
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                    className="bg-white text-primary-700 hover:bg-white/90 shadow-xl hover:shadow-2xl"
                    onClick={() => window.location.href = '/register'}
                  >
                    Daftar Sekarang
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white border-2 border-white/50 hover:bg-white/10"
                    onClick={() => window.location.href = '/login'}
                  >
                    Sudah Punya Akun?
                  </Button>
                </div>

                <p className="text-sm text-white/70 mt-6">
                  🎉 Promo: Dapatkan badge "Early Adopter" untuk 100 pendaftar pertama!
                </p>
              </div>

              {/* Right Content - Visual Element */}
              <div className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                <div className="relative w-full max-w-sm">
                  {/* Main Card */}
                  <div className="bg-white rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                        AC
                      </div>
                      <div>
                        <p className="font-bold text-dark-900">Alumni Connect</p>
                        <p className="text-sm text-dark-600">Digital Member</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-dark-600">Member ID</span>
                        <span className="font-mono font-bold text-primary-700">AC-2024-001</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-dark-600">Status</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-dark-50 rounded-lg">
                        <p className="font-bold text-lg gradient-text">156</p>
                        <p className="text-xs text-dark-600">Koneksi</p>
                      </div>
                      <div className="text-center p-2 bg-dark-50 rounded-lg">
                        <p className="font-bold text-lg gradient-text">24</p>
                        <p className="text-xs text-dark-600">Events</p>
                      </div>
                      <div className="text-center p-2 bg-dark-50 rounded-lg">
                        <p className="font-bold text-lg gradient-text">89</p>
                        <p className="text-xs text-dark-600">Posts</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 px-4 py-2 bg-white rounded-xl shadow-lg animate-float animation-delay-200">
                    <p className="text-xs font-bold text-primary-700">⚡ Premium</p>
                  </div>

                  <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-white rounded-xl shadow-lg animate-float animation-delay-600">
                    <p className="text-xs font-bold text-secondary-700">✨ Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;