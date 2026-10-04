import React from 'react';
import { GraduationCap, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

interface StudentsProfessionalsProps {
  onFindRoom: (type: 'Student' | 'Working Professional') => void;
}

export const StudentsProfessionalsSection: React.FC<StudentsProfessionalsProps> = ({
  onFindRoom,
}) => {
  return (
    <section className="py-16 md:py-24 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#800d1e] bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-300">
            Tailored Living Environments
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight font-serif mt-3">
            Built for Students & Working Professionals
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-medium">
            Whether you are preparing for medical, engineering, or civil services exams, or working full-time in Peshawar, we provide the ideal atmosphere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: STUDENTS */}
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-stone-200 hover:border-amber-400 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#800d1e] flex items-center justify-center mb-6 shadow-sm">
                <GraduationCap className="w-8 h-8" />
              </div>

              <div className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-2">
                For College & University Learners
              </div>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight font-serif mb-4">
                STUDENTS
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  'Peaceful study environment & silence discipline',
                  'High-speed Wi-Fi with uninterrupted solar backup',
                  'Online class & video lecture support',
                  'Comfortable accommodation with provided mattress',
                  'Secure environment with CCTV & 24/7 gate guards',
                  'Affordable shared rooms starting from Rs. 6,000/mo',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onFindRoom('Student')}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#800d1e] hover:bg-[#991b1b] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm uppercase tracking-wider group-hover:bg-[#800d1e]"
            >
              <span>Find Your Student Room</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          {/* Card 2: WORKING PROFESSIONALS */}
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-stone-200 hover:border-[#800d1e] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#800d1e]/10 text-[#800d1e] flex items-center justify-center mb-6 shadow-sm">
                <Briefcase className="w-7 h-7" />
              </div>

              <div className="inline-block text-[11px] font-black uppercase tracking-wider text-[#800d1e] bg-rose-50 px-2.5 py-0.5 rounded-full mb-2">
                For Job Holders & Freelancers
              </div>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight font-serif mb-4">
                WORKING PROFESSIONALS
              </h3>

              <ul className="space-y-3 mb-8">
                {[
                  'Comfortable furnished executive single rooms (Rs. 24,000/mo)',
                  'Reliable fiber internet for remote office tasks & calls',
                  'Convenient location near Ring Road & transport arteries',
                  'Peaceful environment to unwind after exhausting shifts',
                  'Flexible room occupancy (1, 2, or shared seater)',
                  'Secure accommodation with strict privacy & security',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-[#800d1e] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onFindRoom('Working Professional')}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-stone-900 to-stone-800 hover:from-black hover:to-stone-900 text-amber-300 font-extrabold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm uppercase tracking-wider"
            >
              <span>Find Your Professional Room</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
