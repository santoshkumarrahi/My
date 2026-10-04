import React from 'react';
import { HostelSettings } from '../types';
import { ShieldAlert, PhoneCall, AlertCircle, Building2, Flame, Ambulance, LifeBuoy } from 'lucide-react';

interface EmergencySectionProps {
  settings: HostelSettings;
  onOpenComplaint: () => void;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  settings,
  onOpenComplaint,
}) => {
  const emergency = settings.emergency || {
    policeEmergencyNumber: '15',
    rescueNumber: '1122',
    fireBrigadeNumber: '16',
    ambulanceNumber: '115',
    localPoliceStationName: 'Pishtakhara / Tehkal Police Station, Peshawar',
    localPoliceStationPhone: '15 (Police Helpline)',
    hostelWardenPhone: 'Contact Hostel Reception Desk',
    hostelSecurityGuardPhone: 'Main Entrance Post (24/7)',
    districtLocationNote: 'Khyber Pakhtunkhwa Police District Peshawar',
  };

  return (
    <section id="emergency-section" className="py-14 md:py-18 bg-rose-950 text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-rose-800/60 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-900/80 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-rose-700">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Resident Security Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-white">
              Emergency & Safety Support
            </h2>
            <p className="text-rose-200 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              We maintain active coordination with Peshawar emergency services and local law enforcement.
            </p>
          </div>

          <button
            onClick={onOpenComplaint}
            className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-[#7a0b1f] font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-[#7a0b1f]" />
            <span>File Confidential Safety Report</span>
          </button>
        </div>

        {/* Emergency Notice Card */}
        <div className="bg-rose-900/40 border-2 border-rose-700/80 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5 backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            <strong className="text-amber-300 font-bold">Important Notice:</strong> For immediate danger, active crime, severe medical emergency or fire, immediately contact the official government emergency authorities below. The hostel management maintains an automated internal warning queue for safety alerts, but life-safety calls must be routed directly to emergency responders.
          </div>
        </div>

        {/* Hotline Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Rescue 1122 */}
          <div className="bg-rose-900/30 border border-rose-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-red-600/30 text-amber-300 flex items-center justify-center mb-2">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div className="text-xs text-rose-300 font-semibold uppercase">KP Rescue Helpline</div>
              <div className="text-2xl font-black text-white mt-0.5 tracking-wider">
                {emergency.rescueNumber}
              </div>
            </div>
            <a
              href={`tel:${emergency.rescueNumber}`}
              className="mt-3 text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Dial 1122</span>
            </a>
          </div>

          {/* Police Emergency 15 */}
          <div className="bg-rose-900/30 border border-rose-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-amber-300 flex items-center justify-center mb-2">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="text-xs text-rose-300 font-semibold uppercase">Police Emergency</div>
              <div className="text-2xl font-black text-white mt-0.5 tracking-wider">
                {emergency.policeEmergencyNumber}
              </div>
            </div>
            <a
              href={`tel:${emergency.policeEmergencyNumber}`}
              className="mt-3 text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Dial 15</span>
            </a>
          </div>

          {/* Fire Brigade 16 */}
          <div className="bg-rose-900/30 border border-rose-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-600/30 text-amber-300 flex items-center justify-center mb-2">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-xs text-rose-300 font-semibold uppercase">Fire Brigade</div>
              <div className="text-2xl font-black text-white mt-0.5 tracking-wider">
                {emergency.fireBrigadeNumber}
              </div>
            </div>
            <a
              href={`tel:${emergency.fireBrigadeNumber}`}
              className="mt-3 text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Dial 16</span>
            </a>
          </div>

          {/* Ambulance 115 */}
          <div className="bg-rose-900/30 border border-rose-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-600/30 text-amber-300 flex items-center justify-center mb-2">
                <Ambulance className="w-5 h-5" />
              </div>
              <div className="text-xs text-rose-300 font-semibold uppercase">Edhi Ambulance</div>
              <div className="text-2xl font-black text-white mt-0.5 tracking-wider">
                {emergency.ambulanceNumber}
              </div>
            </div>
            <a
              href={`tel:${emergency.ambulanceNumber}`}
              className="mt-3 text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Dial 115</span>
            </a>
          </div>

        </div>

        {/* Local Jurisdiction & Internal Warden Box */}
        <div className="bg-rose-900/20 border border-rose-800/80 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-rose-300 font-semibold block uppercase text-[10px]">
                Configured Local Police Station
              </span>
              <span className="font-bold text-white text-sm">
                {emergency.localPoliceStationName}
              </span>
              <p className="text-stone-300 text-[11px] mt-0.5">
                Jurisdiction: {emergency.districtLocationNote}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-rose-300 font-semibold block uppercase text-[10px]">
                Hostel Internal Security & Warden Desk
              </span>
              <span className="font-bold text-white text-sm">
                {emergency.hostelSecurityGuardPhone}
              </span>
              <p className="text-stone-300 text-[11px] mt-0.5">
                On-site assistance: {emergency.hostelWardenPhone}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
