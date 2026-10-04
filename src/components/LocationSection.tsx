import React from 'react';
import { HostelSettings } from '../types';
import { MapPin, Navigation, Landmark, Bus, Car, Building2, Phone, ExternalLink } from 'lucide-react';

interface LocationSectionProps {
  settings: HostelSettings;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const openDirections = () => {
    const query = encodeURIComponent(`Paradise Boys Hostel, ${settings.city}, Khyber Pakhtunkhwa, Pakistan`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section id="location-section" className="py-16 md:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#800d1e] bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
            Strategic Peshawar Hub
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight font-serif mt-3">
            Prime Location in Peshawar
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-medium">
            Convenient access to major universities, government directorates, BRT bus transit, and commercial markets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Location Info Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-[#800d1e] font-black text-sm uppercase tracking-wider mb-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Hostel Address</span>
              </div>
              <h3 className="text-2xl font-black text-stone-900 font-serif">
                {settings.hostelName}
              </h3>
              <p className="text-sm font-semibold text-stone-700 mt-1">
                {settings.address}, {settings.city}, {settings.province}, {settings.country}
              </p>

              {/* Proximity Highlights */}
              <div className="mt-6 pt-6 border-t border-stone-100 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">University of Peshawar (UoP)</div>
                    <div className="text-[11px] text-stone-500">Quick commute via University Road corridor</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-[#800d1e] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Peshawar BRT Feeder Network</div>
                    <div className="text-[11px] text-stone-500">Walkable access to public transport stops</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Ring Road Arterial Access</div>
                    <div className="text-[11px] text-stone-500">Smooth connectivity to Motorway M-1 & Saddar Bazaar</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Islamia College & UET Peshawar</div>
                    <div className="text-[11px] text-stone-500">Ideal for engineering, medicine & IT scholars</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={openDirections}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#800d1e] hover:bg-[#991b1b] text-white font-extrabold py-3 px-4 rounded-xl shadow transition-all text-xs uppercase tracking-wider"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Get Directions</span>
              </button>
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-4 rounded-xl transition-colors text-xs"
              >
                <Phone className="w-4 h-4 text-stone-600" />
                <span>Call Warden</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200 h-[380px] sm:h-[450px] relative">
            <iframe
              title="Paradise Boys Hostel Peshawar Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.openstreetmap.org/export/embed.html?bbox=71.4400%2C33.9700%2C71.5500%2C34.0400&amp;layer=mapnik&amp;marker=34.0080%2C71.4880"
              className="w-full h-full filter saturate-150 contrast-95"
            />
            
            {/* Map Overlay Badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-amber-400/40 max-w-sm">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                <MapPin className="w-4 h-4" />
                <span>Hostel Pinpoint</span>
              </div>
              <div className="text-sm font-bold mt-0.5">
                Paradise Boys Hostel Peshawar
              </div>
              <div className="text-[11px] text-stone-300 mt-0.5">
                Near Ring Road corridor, Peshawar, KP.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
