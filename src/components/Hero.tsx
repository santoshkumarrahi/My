import React from 'react';
import { Logo } from './Logo';
import { Calendar, Bed, ArrowRight, MapPin, CheckCircle2, Sparkles, Building, PhoneCall } from 'lucide-react';
import { HostelSettings } from '../types';

interface HeroProps {
  settings: HostelSettings;
  onOpenBooking: (roomType?: string) => void;
  onOpenVisit: () => void;
  onScrollToRooms: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenBooking,
  onOpenVisit,
  onScrollToRooms,
}) => {
  const oneSeaterPrice = settings?.pricing?.oneSeaterPrice || 24000;
  const fourSeaterPrice = settings?.pricing?.fourSeaterPrice || 6000;

  return (
    <div className="relative bg-gradient-to-br from-white via-amber-50/30 to-rose-50/20 overflow-hidden border-b border-stone-200">
      {/* Background Decorative Graphic Blobs / Peshawar mountain subtle contour */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-rose-100/30 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: BRANDING, HEADLINES, PRICING & CTAs */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Logo Unit matching reference */}
            <div className="mb-4 transform hover:scale-[1.01] transition-transform">
              <Logo size="lg" variant="maroon" showTagline={true} />
            </div>

            {/* Maroon Brush-Stroke Banner */}
            <div className="mt-2 mb-2 inline-block">
              <div className="relative inline-block bg-[#800d1e] text-white font-extrabold uppercase px-5 py-2 rounded-sm shadow-md transform -rotate-1 border-l-4 border-amber-400">
                <span className="text-xl sm:text-2xl md:text-3xl tracking-wide font-black drop-shadow-sm">
                  COMFORTABLE & SAFE
                </span>
                {/* Decorative jagged brush end cut */}
                <div className="absolute -right-2 top-0 bottom-0 w-3 bg-[#800d1e] clip-path-brush" />
              </div>
            </div>

            {/* Massive Bold Headline Treatment */}
            <div className="mt-1 mb-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black text-[#f59e0b] leading-[1.05] tracking-tight drop-shadow-[0_3px_5px_rgba(128,13,30,0.65)] select-none">
                HOSTEL LIVING
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className="text-3xl sm:text-4xl md:text-5xl text-stone-900 font-bold italic tracking-wide"
                  style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
                >
                  in Peshawar
                </span>
                <span className="inline-block h-1 w-12 bg-[#800d1e] rounded-full ml-2" />
              </div>
            </div>

            {/* Supporting Text */}
            <p className="text-stone-700 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl mt-2 mb-4">
              A Safe, Clean & Comfortable Home Away From Home for{' '}
              <strong className="text-[#800d1e] font-bold">Students</strong> &{' '}
              <strong className="text-[#800d1e] font-bold">Working Professionals</strong>.
            </p>

            {/* Highlight Badges & Pricing Cards inspired by the reference */}
            <div className="w-full bg-white rounded-xl p-4 shadow-md border border-amber-200/80 mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#800d1e] text-amber-300 text-[11px] font-black px-3 py-1 rounded-bl-lg tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>1 TO 4 SEATER ROOMS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 pt-2">
                {/* 1 Seater Price Card */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 hover:border-[#800d1e]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      1 Seater Room
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Private
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl font-black text-[#800d1e] mt-1">
                    Rs. {oneSeaterPrice.toLocaleString()}
                    <span className="text-xs font-medium text-stone-500"> / month</span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Bed & mattress included</span>
                  </div>
                </div>

                {/* 4 Seater Price Card */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3 hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      4 Seater Room
                    </span>
                    <span className="text-[10px] font-semibold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                      Popular
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl font-black text-[#800d1e] mt-1">
                    Rs. {fourSeaterPrice.toLocaleString()}
                    <span className="text-xs font-medium text-stone-500"> / person/mo</span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Bed & mattress included</span>
                  </div>
                </div>
              </div>

              {/* 2 & 3 Seater Availability note */}
              <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                <span>
                  <strong>2 & 3 Seater Rooms:</strong> Available upon request
                </span>
                <span className="font-semibold text-[#800d1e] cursor-pointer hover:underline" onClick={onScrollToRooms}>
                  Contact for pricing &rarr;
                </span>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Primary Maroon CTA */}
              <button
                onClick={() => onOpenBooking()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#800d1e] hover:bg-[#991b1b] text-white font-extrabold px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 tracking-wide uppercase text-sm border-2 border-amber-400/50 hover:border-amber-300 transform active:scale-95"
              >
                <Bed className="w-4 h-4 text-amber-300" />
                <span>BOOK A ROOM</span>
              </button>

              {/* Secondary Golden/Amber CTA */}
              <button
                onClick={onOpenVisit}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-[#7a0b1f] font-black px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 tracking-wide uppercase text-sm border border-amber-500/30 transform active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#7a0b1f]" />
                <span>BOOK A VISIT</span>
              </button>

              {/* Smaller CTA: View Rooms */}
              <button
                onClick={onScrollToRooms}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg text-xs md:text-sm font-bold text-stone-800 hover:text-[#800d1e] hover:bg-stone-100 transition-colors"
              >
                <span>VIEW ROOMS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Helpline note */}
            <div className="mt-4 flex items-center gap-2 text-xs text-stone-600">
              <PhoneCall className="w-3.5 h-3.5 text-[#800d1e]" />
              <span>
                Questions? Inquire at <strong>{settings?.phone || '+92 300 0000000'}</strong> or visit our reception desk.
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: MODERN HOSTEL BUILDING & STUDENT VISUAL */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer Golden Glow Border Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-stone-900 group">
                
                {/* Main Hostel Exterior Image */}
                <div className="relative h-72 sm:h-96 md:h-[420px] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
                    alt="Paradise Hostel Building Peshawar"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                  {/* Signboard on the building facade matching the reference */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-md shadow-lg border-l-4 border-[#800d1e]">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-[#800d1e]" />
                      <div className="leading-tight">
                        <div className="text-xs font-black text-[#800d1e] font-serif uppercase tracking-wider">
                          Paradise Hostel
                        </div>
                        <div className="text-[9px] font-bold text-stone-600 tracking-[0.15em] uppercase">
                          PESHAWAR
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Persona Overlay matching the uploaded image */}
                  <div className="absolute bottom-0 right-0 w-[48%] sm:w-[45%] h-[85%] flex items-end justify-end pointer-events-none">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
                      alt="Student at Paradise Boys Hostel"
                      className="h-full w-full object-cover object-top filter drop-shadow-2xl rounded-tl-3xl border-l-2 border-t-2 border-amber-400/80"
                    />
                  </div>

                  {/* "Your Home Away From Home" Badge matching the reference */}
                  <div className="absolute bottom-6 left-4 max-w-[200px] sm:max-w-[230px]">
                    <div className="bg-[#800d1e] text-white p-3 rounded-xl border-2 border-amber-400 shadow-xl backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Peshawar, KP</span>
                      </div>
                      <div className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                        Your Home Away From Home
                      </div>
                      <div className="text-[11px] text-stone-200 mt-1 font-medium">
                        Safe • Clean • Comfortable
                      </div>
                    </div>
                  </div>

                </div>

                {/* Building Status Strip */}
                <div className="bg-stone-900 text-stone-300 px-4 py-2.5 flex items-center justify-between text-xs border-t border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-white">28 Total Rooms (Basement & Upper Floor)</span>
                  </div>
                  <span className="text-amber-400 font-bold">24/7 Security & CCTV</span>
                </div>
              </div>

              {/* Floating admissions stamp */}
              <div className="absolute -top-3 -right-3 bg-amber-400 text-[#7a0b1f] font-black text-xs px-3 py-1.5 rounded-full shadow-lg border-2 border-white transform rotate-6 flex items-center gap-1">
                <span>Admissions 2026</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
