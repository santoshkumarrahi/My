import React from 'react';
import { ShieldCheck, Wifi, Sparkles, Sun, BedDouble, MapPin } from 'lucide-react';

interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const FeatureStrip: React.FC = () => {
  const features: FeatureItem[] = [
    {
      id: 'sec',
      icon: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.2} />,
      title: '24/7 SECURITY',
      desc: 'CCTV Surveillance & Secure Environment',
    },
    {
      id: 'wifi',
      icon: <Wifi className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.2} />,
      title: 'HIGH-SPEED WI-FI',
      desc: 'Fast Internet for Study, Work & Entertainment',
    },
    {
      id: 'clean',
      icon: <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.2} />,
      title: 'NEAT & CLEAN ROOMS',
      desc: 'Comfortable and Well-Maintained Rooms',
    },
    {
      id: 'solar',
      icon: <Sun className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.2} />,
      title: 'SOLAR BACKUP',
      desc: 'Power Backup for Essential Hostel Needs',
    },
    {
      id: 'furn',
      icon: <BedDouble className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.2} />,
      title: 'FURNISHED ROOMS',
      desc: 'Beds, Mattresses & Essential Furniture',
    },
    {
      id: 'loc',
      icon: <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.2} />,
      title: 'PRIME LOCATION',
      desc: 'Convenient Access to Universities, Markets & Transport',
    },
  ];

  return (
    <section className="bg-white border-y border-stone-200 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-amber-300/70">
          {features.map((item, idx) => (
            <div
              key={item.id}
              className={`flex flex-col items-center text-center px-2 ${
                idx > 0 ? 'pt-4 md:pt-0' : ''
              }`}
            >
              {/* Circular Maroon/Red Icon with White Symbol */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#7a0b1f] hover:bg-[#991b1b] transition-transform duration-300 hover:scale-105 flex items-center justify-center shadow-md mb-3 ring-4 ring-amber-100 flex-shrink-0">
                {item.icon}
              </div>
              <h3 className="text-xs md:text-sm font-black text-stone-900 tracking-wide uppercase">
                {item.title}
              </h3>
              <p className="text-[11px] md:text-xs text-stone-600 mt-1 font-medium leading-relaxed max-w-[170px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
