import React from 'react';
import { MapPin, Landmark, GraduationCap, ShieldCheck, Home } from 'lucide-react';

interface ThumbnailItem {
  id: string;
  title: string;
  image: string;
}

export const HeroThumbnails: React.FC<{ onSelectCategory?: (cat: string) => void }> = ({
  onSelectCategory,
}) => {
  const items: ThumbnailItem[] = [
    {
      id: 'furn',
      title: 'FURNISHED ROOMS',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'study',
      title: 'STUDY & WORK FRIENDLY ENVIRONMENT',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'mess',
      title: 'MESS & DINING',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'laundry',
      title: 'LAUNDRY FACILITY',
      image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'relax',
      title: 'RELAX & CONNECT',
      image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="w-full">
      {/* 5 Photo Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-2 bg-stone-900">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCategory && onSelectCategory(item.title)}
            className="group relative h-28 md:h-36 overflow-hidden rounded shadow cursor-pointer border border-stone-800"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-1.5 inset-x-1.5">
              <div className="bg-[#7a0b1f]/95 text-white text-[10px] md:text-xs font-black uppercase py-1 px-2 rounded text-center tracking-wider shadow-sm truncate border-t border-amber-400/40">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info Bar matching reference image */}
      <div className="bg-[#6b0819] text-white py-3 px-4 border-t-2 border-amber-400">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-xs md:text-[13px] font-medium text-stone-200">
            {/* Address */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-[#6b0819] flex items-center justify-center font-bold">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-white block sm:inline">Paradise Hostel Peshawar</span>
                <span className="text-stone-300 text-[11px] block sm:inline sm:ml-1">
                  — Near Ring Road, Peshawar, KP
                </span>
              </div>
            </div>

            {/* University & Transport */}
            <div className="hidden sm:flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-300" />
              <span>Close to Peshawar University & Transport Routes</span>
            </div>

            {/* Target */}
            <div className="hidden md:flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Ideal for Students & Job Holders</span>
            </div>

            {/* Tagline */}
            <div className="hidden xl:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Safe • Secure • Supportive</span>
            </div>

            <div className="hidden 2xl:flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-300" />
              <span>A Home Away From Home</span>
            </div>
          </div>

          {/* Admissions Open 2026 Gold Badge */}
          <div className="flex-shrink-0 bg-gradient-to-r from-amber-400 to-amber-300 text-[#7a0b1f] px-4 py-1.5 rounded-full font-black text-xs md:text-sm tracking-wide shadow-md flex items-center gap-2 border border-amber-200">
            <GraduationCap className="w-4 h-4" />
            <span>ADMISSIONS OPEN 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
