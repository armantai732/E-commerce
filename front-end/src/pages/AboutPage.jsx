import React from 'react';
import { Target, HeartHandshake, Eye, Sparkles, ShieldCheck, Award, Users2, Truck } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Curated Products', value: '10K+' },
    { label: 'Global Brands', value: '250+' },
    { label: 'Customer Rating', value: '4.9 ★' },
  ];

  const features = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To curate premium fashion & lifestyle collections that seamlessly deliver luxury, elegance, and unmatched value.',
    },
    {
      icon: HeartHandshake,
      title: 'Our Values',
      description: 'Built on absolute transparency, uncompromising product quality, and a deeply customer-centric approach.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To set the global benchmark for modern, seamless, and trustworthy luxury e-commerce experiences.',
    },
  ];

  const highlights = [
    { icon: ShieldCheck, title: '100% Authentic', desc: 'Guaranteed original products direct from verified brands.' },
    { icon: Truck, title: 'Express Delivery', desc: 'Swift, insured, and seamless shipping right to your doorstep.' },
    { icon: Award, title: 'Premium Quality', desc: 'Handpicked items subjected to rigorous quality checks.' },
    { icon: Users2, title: '24/7 Concierge', desc: 'Dedicated customer support tailored to your every need.' },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* 1. Luxury Light Hero Banner */}
        <div className="relative w-full rounded-3xl bg-stone-900 overflow-hidden min-h-[200px] sm:min-h-[260px] flex items-center justify-between p-6 sm:p-12 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-stone-800">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
            alt="Shop Nest Luxury Boutique"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

          {/* Banner Details */}
          <div className="relative z-10 max-w-xl text-white space-y-3">
            <span className="bg-[#FAF3EA]/20 border border-[#FAF3EA]/30 text-amber-200 text-[10px] sm:text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles size={12} /> Crafting Excellence
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              About ShopNest
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
              We are more than just a boutique — we are your ultimate destination for elevated, mindful lifestyle shopping.
            </p>
          </div>

          {/* Decorative Subtle Side Image */}
          <div className="relative z-10 hidden lg:block w-48 h-36 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"
              alt="Shopping Bags"
              className="w-full h-full object-contain mix-blend-lighten drop-shadow-2xl"
            />
          </div>
        </div>

        {/* 2. Stat Counter Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] text-center space-y-1 hover:border-[#EEDFCD] transition-all"
            >
              <p className="text-xl sm:text-2xl font-black text-[#966F33]">
                {stat.value}
              </p>
              <p className="text-xs font-extrabold text-stone-500 tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* 3. Our Story Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#966F33]">
              Behind The Brand
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Our Story & Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium pt-1">
              ShopNest was founded on a distinct premise — to eliminate the clutter of mass market e-commerce and replace it with a thoughtfully curated, premium shopping environment. From handpicked apparel to luxury accessories and home essentials, we combine quality craftsmanship with seamless delivery right to your doorstep.
            </p>
          </div>

          {/* Mission, Values, Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-100">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group bg-[#FAF9F6] hover:bg-white p-6 rounded-3xl border border-stone-200/70 hover:border-[#EEDFCD] hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)] transition-all duration-300 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF3EA] border border-[#EEDFCD] flex items-center justify-center text-[#966F33] group-hover:scale-110 transition-transform">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-[#966F33] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Why Choose Us Highlights */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
              The ShopNest Advantage
            </h2>
            <p className="text-xs text-stone-400 font-medium">
              Why discerning shoppers trust us worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-2 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF3EA] border border-[#EEDFCD] text-[#966F33] flex items-center justify-center mb-1">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-xs font-extrabold text-stone-900">
                    {h.title}
                  </h4>
                  <p className="text-[11px] text-stone-400 font-medium leading-normal">
                    {h.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;