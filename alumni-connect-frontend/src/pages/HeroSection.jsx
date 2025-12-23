import React from 'react';
import { ArrowRight, Sparkles, Users, Briefcase, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float animation-delay-400" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <Badge variant="gradient" size="md" icon={<Sparkles className="w-4 h-4" />}>
              Platform Alumni #1 di Indonesia
            </Badge>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight">
                Terhubung,{' '}
                <span className="gradient-text">Berkembang</span>
                <br />
                Bersama Alumni
              </h1>
              
              <p className="text-xl text-dark-600 leading-relaxed max-w-xl">
                Platform jejaring eksklusif untuk Alumni Sistem Informasi Telkom University. 
                Temukan peluang karir, ikuti event, dan bangun koneksi yang bermakna.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="pulse-glow"
                onClick={() => window.location.href = '/register'}
              >
                Mulai Sekarang
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-dark-900">2,500+</p>
                  <p className="text-sm text-dark-600">Alumni Terdaftar</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-dark-900">850+</p>
                  <p className="text-sm text-dark-600">Lowongan Kerja</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-dark-900">120+</p>
                  <p className="text-sm text-dark-600">Event Alumni</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative animate-slide-up animation-delay-200">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-2xl blur-xl opacity-50" />
                
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                      AS
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Alumni Showcase</h3>
                      <p className="text-dark-500 text-sm">Software Engineer @ Tech Corp</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">React.js</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="success">PostgreSQL</Badge>
                    <Badge variant="info">GraphQL</Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dark-100">
                    <div className="text-center">
                      <p className="font-bold text-2xl gradient-text">156</p>
                      <p className="text-xs text-dark-500">Koneksi</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-2xl gradient-text">42</p>
                      <p className="text-xs text-dark-500">Postingan</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-2xl gradient-text">18</p>
                      <p className="text-xs text-dark-500">Event</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-4 animate-float animation-delay-600 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">New Job!</p>
                    <p className="text-xs text-dark-500">Senior Developer</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-xl p-4 animate-float animation-delay-800 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Upcoming</p>
                    <p className="text-xs text-dark-500">Tech Talk 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;