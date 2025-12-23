import React from 'react';
import { Star, Quote } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Software Engineer',
      company: 'Google Indonesia',
      batch: 'Angkatan 2018',
      image: 'BS',
      rating: 5,
      text: 'Alumni Connect benar-benar membantu saya menemukan pekerjaan impian. Networking dengan sesama alumni sangat valuable!',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Siti Nurhaliza',
      role: 'Product Manager',
      company: 'Tokopedia',
      batch: 'Angkatan 2017',
      image: 'SN',
      rating: 5,
      text: 'Platform yang luar biasa! Event-event yang diadakan selalu berkualitas dan menambah wawasan. Highly recommended!',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Ahmad Wijaya',
      role: 'Data Scientist',
      company: 'Gojek',
      batch: 'Angkatan 2019',
      image: 'AW',
      rating: 5,
      text: 'Melalui Alumni Connect, saya bisa berbagi pengalaman dan belajar dari alumni senior. Komunitas yang sangat supportif!',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Rina Permata',
      role: 'UI/UX Designer',
      company: 'Bukalapak',
      batch: 'Angkatan 2020',
      image: 'RP',
      rating: 5,
      text: 'Fitur forum dan job board-nya sangat membantu. Saya dapat pekerjaan pertama melalui platform ini!',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Dedi Kurniawan',
      role: 'DevOps Engineer',
      company: 'Traveloka',
      batch: 'Angkatan 2016',
      image: 'DK',
      rating: 5,
      text: 'Program crowdfunding-nya keren! Senang bisa membantu adik tingkat melalui beasiswa.',
      color: 'from-red-500 to-rose-500'
    },
    {
      name: 'Maya Kusuma',
      role: 'Business Analyst',
      company: 'Shopee',
      batch: 'Angkatan 2019',
      image: 'MK',
      rating: 5,
      text: 'Best investment untuk karir! Koneksi yang saya bangun di sini sangat membantu pengembangan karir saya.',
      color: 'from-indigo-500 to-blue-500'
    },
  ];

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white to-primary-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-secondary-200/50 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary-200/50 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 font-semibold text-sm mb-4">
            <Star className="w-4 h-4 fill-secondary-700" />
            Testimoni Alumni
          </div>
          
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Apa Kata{' '}
            <span className="gradient-text">Alumni Kami</span>
          </h2>
          
          <p className="text-lg text-dark-600 leading-relaxed">
            Dengarkan cerita sukses dari alumni yang telah merasakan manfaat 
            bergabung dengan Alumni Connect.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card hover padding="lg" className="h-full relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-primary-600" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-dark-700 leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-dark-100">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold`}>
                    {testimonial.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-dark-900">{testimonial.name}</h4>
                    <p className="text-sm text-dark-600">{testimonial.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary" size="sm">{testimonial.company}</Badge>
                      <span className="text-xs text-dark-500">{testimonial.batch}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in animation-delay-600">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="font-bold text-2xl text-dark-900">4.9/5</p>
            <p className="text-sm text-dark-600">Rating Platform</p>
          </div>

          <div className="text-center">
            <p className="font-bold text-3xl gradient-text mb-1">98%</p>
            <p className="text-sm text-dark-600">Rekomendasi</p>
          </div>

          <div className="text-center">
            <p className="font-bold text-3xl gradient-text mb-1">2.5K+</p>
            <p className="text-sm text-dark-600">Reviews</p>
          </div>

          <div className="text-center">
            <p className="font-bold text-3xl gradient-text mb-1">24/7</p>
            <p className="text-sm text-dark-600">Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;