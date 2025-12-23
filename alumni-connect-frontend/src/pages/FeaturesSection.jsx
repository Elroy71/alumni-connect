import React from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Award,
  TrendingUp,
  Shield
} from 'lucide-react';
import Card from '../components/ui/Card';

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Forum Alumni',
      description: 'Berbagi cerita, pencapaian, dan pengalaman dengan sesama alumni. Bangun koneksi yang bermakna.',
      color: 'primary',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Briefcase,
      title: 'Lowongan Kerja',
      description: 'Akses eksklusif ke lowongan kerja dari alumni untuk alumni. Tingkatkan karir Anda bersama.',
      color: 'secondary',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Event & Reuni',
      description: 'Ikuti event menarik, webinar, dan reuni alumni. Perluas jaringan profesional Anda.',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: DollarSign,
      title: 'Crowdfunding',
      description: 'Dukung adik tingkat melalui program beasiswa dan penggalangan dana bersama.',
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Award,
      title: 'Kartu Alumni Digital',
      description: 'Dapatkan kartu anggota digital dengan QR code untuk akses eksklusif ke berbagai fasilitas.',
      color: 'red',
      gradient: 'from-red-500 to-rose-500'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Pantau perkembangan karir Anda dan dapatkan insight dari alumni senior.',
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-500'
    },
  ];

  return (
    <section id="features" className="section-padding bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-30 -z-10" />

      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-4">
            <Shield className="w-4 h-4" />
            Fitur Unggulan
          </div>
          
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Semua yang Anda Butuhkan dalam{' '}
            <span className="gradient-text">Satu Platform</span>
          </h2>
          
          <p className="text-lg text-dark-600 leading-relaxed">
            Alumni Connect menyediakan berbagai fitur untuk mendukung perkembangan 
            karir dan memperkuat hubungan antar alumni.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card hover padding="lg" className="h-full">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${feature.gradient} opacity-50 animate-pulse`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold text-xl mb-3 text-dark-900 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-dark-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Line */}
                  <div className="mt-6 h-1 bg-gradient-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in animation-delay-600">
          <p className="text-dark-600 mb-4">
            Siap bergabung dengan komunitas alumni terbesar?
          </p>
          <button 
            onClick={() => window.location.href = '/register'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white font-bold rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            <Users className="w-5 h-5" />
            Bergabung Sekarang
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;