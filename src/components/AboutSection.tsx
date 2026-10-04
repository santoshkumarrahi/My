import React from 'react';
import { ShieldCheck, HeartHandshake, Award, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Paradise Boys Hostel Peshawar Community"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-stone-700 text-white">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Disciplined & Peaceful</span>
                </div>
                <div className="text-sm font-bold mt-1">
                  Dedicated to Serious Academics & Professional Success
                </div>
              </div>
            </div>

            {/* Floating pill badge */}
            <div className="absolute -bottom-5 -right-5 hidden sm:flex items-center gap-2 bg-[#7a0b1f] text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-amber-400">
              <Award className="w-5 h-5 text-amber-300" />
              <div>
                <div className="text-[10px] text-stone-300 uppercase font-bold">Total Rooms</div>
                <div className="text-base font-black text-amber-300">28 Rooms in Peshawar</div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-[#7a0b1f] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-3 w-max">
              <HeartHandshake className="w-3.5 h-3.5 text-[#7a0b1f]" />
              <span>About Our Hostel</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight font-serif">
              About Paradise Boys Hostel
            </h2>

            <div className="mt-5 space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              <p className="font-semibold text-stone-800 text-base sm:text-lg">
                Paradise Boys Hostel Peshawar provides a safe, comfortable and supportive home away from home for students and working professionals.
              </p>
              <p>
                Our goal is to provide clean accommodation, reliable facilities, a peaceful environment and a secure place where residents can study, work and live comfortably.
              </p>
              <p>
                Located near the Ring Road and University Road corridor in Peshawar, our 28-room building is purpose-structured to accommodate individual privacy in executive single rooms as well as budget-friendly shared 4-seater accommodations.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Beds & Mattresses Included</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>24/7 Gate Guard & CCTV</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Solar Battery Backup</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Strict Quiet Hours</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
