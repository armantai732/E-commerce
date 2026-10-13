import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headset, Sparkles } from 'lucide-react';

const services = [
  {
    id: 1,
    icon: Truck,
    title: 'Complimentary Shipping',
    description: 'On all orders over ₹999',
  },
  {
    id: 2,
    icon: RotateCcw,
    title: 'Hassle-Free Returns',
    description: '7 Days easy return policy',
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: '100% Encrypted & Safe',
  },
  {
    id: 4,
    icon: Headset,
    title: '24/7 Concierge',
    description: 'Dedicated support team',
  },
];

const Services = () => {
  return (
    <section className="w-full bg-[#FAF9F6] border-y border-stone-200/80 py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className="group flex items-center gap-4 p-5 rounded-3xl bg-white border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:border-[#EEDFCD] transition-all duration-300 cursor-default"
            >
              {/* Circular Warm Gold Badge */}
              <div className="w-12 h-12 rounded-2xl bg-[#FAF3EA] border border-[#EEDFCD] flex items-center justify-center text-[#966F33] shrink-0 group-hover:scale-110 group-hover:bg-stone-900 group-hover:text-amber-200 group-hover:border-stone-900 transition-all duration-300 shadow-sm">
                <IconComponent size={22} strokeWidth={2} />
              </div>

              {/* Text Content */}
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-[#966F33] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-400 font-medium">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;