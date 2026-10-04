import React from 'react';
import { Facility } from '../types';
import {
  Wifi,
  ShieldCheck,
  Video,
  Sparkles,
  Bed,
  Sun,
  Zap,
  BookOpen,
  Shirt,
  Utensils,
  Droplets,
  Brush,
  Car,
  MapPin,
  CheckCircle,
} from 'lucide-react';

interface ServicesGridProps {
  facilities: Facility[];
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ facilities }) => {
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-6 h-6" />;
      case 'shieldcheck':
      case 'security':
        return <ShieldCheck className="w-6 h-6" />;
      case 'sun':
      case 'solar':
        return <Sun className="w-6 h-6" />;
      case 'beddouble':
      case 'bed':
        return <Bed className="w-6 h-6" />;
      case 'sparkles':
      case 'clean':
        return <Sparkles className="w-6 h-6" />;
      case 'bookopen':
      case 'study':
        return <BookOpen className="w-6 h-6" />;
      case 'droplets':
      case 'water':
        return <Droplets className="w-6 h-6" />;
      case 'utensils':
      case 'dining':
        return <Utensils className="w-6 h-6" />;
      case 'shirt':
      case 'laundry':
        return <Shirt className="w-6 h-6" />;
      case 'mappin':
      case 'location':
        return <MapPin className="w-6 h-6" />;
      case 'car':
      case 'parking':
        return <Car className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  return (
    <section id="services-section" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#800d1e] bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200">
            Hostel Services & Amenities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight font-serif mt-3">
            Standard Facilities for Every Resident
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-medium">
            Managed carefully by our on-site administrative staff to ensure a worry-free stay.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                fac.isIncluded
                  ? 'bg-stone-50 hover:bg-white border-stone-200 hover:border-amber-400 hover:shadow-lg'
                  : 'bg-stone-100/50 border-dashed border-stone-300 opacity-60'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#7a0b1f] text-amber-300 flex items-center justify-center mb-4 shadow-sm">
                  {getIcon(fac.iconName)}
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1 leading-snug">
                  {fac.name}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal mb-3">
                  {fac.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-stone-500 uppercase">{fac.category}</span>
                <span
                  className={`font-black px-2 py-0.5 rounded text-[10px] ${
                    fac.isIncluded
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {fac.statusText || (fac.isIncluded ? 'Included' : 'Optional')}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
