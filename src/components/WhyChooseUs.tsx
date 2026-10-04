import React from 'react';
import {
  Wifi,
  Sparkles,
  Bed,
  Users,
  ShieldCheck,
  Video,
  Sun,
  BookOpen,
  Laptop,
  Briefcase,
  Layers,
  Trash2,
  Shirt,
  Utensils,
  MapPin,
  HeartHandshake,
} from 'lucide-react';

export const WhyChooseUs: React.FC<{ onReserveClick: () => void }> = ({ onReserveClick }) => {
  const points = [
    {
      icon: <Wifi className="w-5 h-5 text-[#800d1e]" />,
      title: 'High-Speed Fiber Optic Wi-Fi',
      desc: 'Seamless connectivity designed for academic research, Zoom lectures, and job deliverables.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#800d1e]" />,
      title: 'Neat & Clean Rooms',
      desc: 'Daily floor sweeping, tidy corridors, and disciplined hygiene protocols.',
    },
    {
      icon: <Bed className="w-5 h-5 text-[#800d1e]" />,
      title: 'Comfortable Beds & Mattresses',
      desc: 'Quality wooden/iron beds with comfortable foam mattresses ready on move-in.',
    },
    {
      icon: <Users className="w-5 h-5 text-[#800d1e]" />,
      title: 'Friendly & Peaceful Environment',
      desc: 'Respectful student and professional community with strict quiet hours after 10:30 PM.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#800d1e]" />,
      title: '24/7 Physical Security',
      desc: 'Vigilant guard presence at entry points and visitor logging around the clock.',
    },
    {
      icon: <Video className="w-5 h-5 text-[#800d1e]" />,
      title: 'CCTV Surveillance',
      desc: 'High-definition cameras monitoring hallways, gates, and communal premises for resident safety.',
    },
    {
      icon: <Sun className="w-5 h-5 text-[#800d1e]" />,
      title: 'Solar & Power Backup',
      desc: 'Essential lighting, ceiling fans, and Wi-Fi stay energized during load-shedding.',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#800d1e]" />,
      title: 'Study-Friendly Environment',
      desc: 'Individual reading corners, ergonomic study chairs, and dedicated quiet zones.',
    },
    {
      icon: <Laptop className="w-5 h-5 text-[#800d1e]" />,
      title: 'Suitable for Online Classes',
      desc: 'High bandwidth low-latency network with power backup for uninterrupted Zoom/Teams sessions.',
    },
    {
      icon: <Briefcase className="w-5 h-5 text-[#800d1e]" />,
      title: 'Suitable for Job Holders',
      desc: 'Flexible schedules, serene single rooms, and convenient proximity to Peshawar workplaces.',
    },
    {
      icon: <Layers className="w-5 h-5 text-[#800d1e]" />,
      title: 'Furnished Rooms',
      desc: 'Equipped with study tables, clothes wardrobes, curtains, and lighting fixtures.',
    },
    {
      icon: <Trash2 className="w-5 h-5 text-[#800d1e]" />,
      title: 'Regular Cleaning',
      desc: 'Scheduled housekeeping support for common washrooms, dining areas, and garbage disposal.',
    },
    {
      icon: <Shirt className="w-5 h-5 text-[#800d1e]" />,
      title: 'Laundry Facility',
      desc: 'On-site washing machines and rooftop clothesline space to keep clothes fresh with zero hassle.',
    },
    {
      icon: <Utensils className="w-5 h-5 text-[#800d1e]" />,
      title: 'Common Dining / Meal Area',
      desc: 'Comfortable shared dining hall with clean drinking water dispensers.',
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#800d1e]" />,
      title: 'Convenient Peshawar Location',
      desc: 'Immediate access to Ring Road, BRT routes, Saddar, and Peshawar University.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#800d1e]" />,
      title: 'Safe & Supportive Environment',
      desc: 'Approachable resident warden, prompt grievance handling, and respectful atmosphere.',
    },
  ];

  return (
    <section id="why-choose-us" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-[#800d1e] bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200 mb-2">
            Why Residents Trust Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight font-serif">
            Why Choose Paradise Boys Hostel?
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-medium">
            Everything you need for a comfortable stay, academic excellence, and a peaceful lifestyle in Peshawar.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-stone-50 hover:bg-white rounded-xl p-5 border border-stone-200/80 hover:border-amber-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-[#800d1e] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#800d1e] group-hover:text-amber-300 transition-all duration-200">
                  {pt.icon}
                </div>
                <h3 className="text-sm md:text-base font-bold text-stone-900 mb-1.5 leading-snug">
                  {pt.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {pt.desc}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-200/50 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Verified Facility</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#7a0b1f] to-[#991b1b] rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border-2 border-amber-400">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 block mb-1">
              Affordable Luxury in Peshawar
            </span>
            <h3 className="text-xl md:text-2xl font-bold font-serif text-white">
              Ready to secure your room at Paradise Boys Hostel?
            </h3>
            <p className="text-stone-200 text-xs sm:text-sm mt-1 max-w-xl">
              1 Seater (Rs. 24,000/mo) and 4 Seater (Rs. 6,000/person/mo) accommodations available.
              Apply early before university semester starts!
            </p>
          </div>
          <button
            onClick={onReserveClick}
            className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-[#7a0b1f] font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-xs md:text-sm uppercase tracking-wider"
          >
            Apply for Admission
          </button>
        </div>

      </div>
    </section>
  );
};
