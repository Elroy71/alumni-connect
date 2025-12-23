import React from 'react';
import { Users, Briefcase, Calendar, Trophy, TrendingUp, Globe } from 'lucide-react';
import Card from '../components/ui/Card';

const StatisticsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '2,500+',
      label: 'Alumni Aktif',
      description: 'Tergabung dalam platform',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Briefcase,
      value: '850+',
      label: 'Lowongan Kerja',
      description: 'Diposting setiap bulan',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      value: '120+',
      label: 'Event Alumni',
      description: 'Terselenggara tahun ini',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Trophy,
      value: '95%',
      label: 'Tingkat Kepuasan',
      description: 'Dari pengguna aktif',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: TrendingUp,
      value: '78%',
      label: 'Career Growth',
      description: 'Alumni naik jabatan',
      color: 'from-red-500 to-rose-500'
    },
    {
      icon: Globe,
      value: '25+',
      label: 'Negara',
      description: 'Alumni tersebar',
      color: 'from-indigo-500 to-blue-500'
    },
  ];

  return (
    <section className="section-padding bg-gradient-dark text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-float animation-delay-400" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Alumni Connect dalam{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Angka
            </span>
          </h2>
          
          <p className="text-lg text-dark-300 leading-relaxed">
            Bergabunglah dengan ribuan alumni yang telah merasakan manfaat 
            dari platform jejaring profesional terbesar.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card glass padding="lg" className="h-full group hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="font-display font-bold text-3xl md:text-4xl mb-1 text-white">
                        {stat.value}
                      </p>
                      <p className="font-semibold text-lg text-white mb-1">
                        {stat.label}
                      </p>
                      <p className="text-sm text-dark-400">
                        {stat.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                      style={{ 
                        width: '0%',
                        animation: 'fillProgress 1.5s ease-out forwards',
                        animationDelay: `${index * 0.1 + 0.5}s`
                      }}
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center animate-fade-in animation-delay-800">
          <Card glass padding="lg" className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="font-display font-bold text-2xl mb-2">
                  Siap Menjadi Bagian dari Kami?
                </h3>
                <p className="text-dark-300">
                  Bergabunglah dengan komunitas alumni yang terus bertumbuh.
                </p>
              </div>
              <button 
                onClick={() => window.location.href = '/register'}
                className="px-8 py-4 bg-white text-dark-900 font-bold rounded-xl hover:scale-105 transition-transform whitespace-nowrap"
              >
                Daftar Gratis
              </button>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fillProgress {
          from {
            width: 0%;
          }
          to {
            width: 85%;
          }
        }
      `}</style>
    </section>
  );
};

export default StatisticsSection;