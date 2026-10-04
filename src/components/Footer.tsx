import React from 'react';
import { Logo } from './Logo';
import { HostelSettings } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Bed,
  LifeBuoy,
  Lock,
  ArrowUp,
} from 'lucide-react';

interface FooterProps {
  settings: HostelSettings;
  onOpenBooking: () => void;
  onOpenVisit: () => void;
  onOpenComplaint: () => void;
  onOpenTracker: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenBooking,
  onOpenVisit,
  onOpenComplaint,
  onOpenTracker,
  onOpenTerms,
  onOpenPrivacy,
  onOpenAdminLogin,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#4d040f] text-white border-t-4 border-amber-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Overview */}
          <div className="lg:col-span-4">
            <Logo variant="light" size="lg" showTagline={true} />
            <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              A safe, clean and comfortable home away from home in Peshawar for ambitious students and dedicated working professionals. Quality beds, mattresses, fiber Wi-Fi, and solar backup.
            </p>
            
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-amber-300 font-bold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>24/7 Security</span>
              </span>
              <span>•</span>
              <span>28 Rooms (Basement & Upper)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4 font-serif">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-medium">
              <li>
                <button onClick={() => scrollToTop()} className="hover:text-amber-300 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('rooms-section')} className="hover:text-amber-300 transition-colors">
                  Rooms & Rates
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('why-choose-us')} className="hover:text-amber-300 transition-colors">
                  Why Choose Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('services-section')} className="hover:text-amber-300 transition-colors">
                  Facilities & Amenities
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('gallery-section')} className="hover:text-amber-300 transition-colors">
                  Hostel Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about-section')} className="hover:text-amber-300 transition-colors">
                  About Paradise Hostel
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('location-section')} className="hover:text-amber-300 transition-colors">
                  Peshawar Location Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Bookings & Grievances */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4 font-serif">
              Admissions & Safety
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-medium">
              <li>
                <button onClick={onOpenBooking} className="text-amber-300 hover:underline flex items-center gap-1.5 font-bold">
                  <Bed className="w-3.5 h-3.5" />
                  <span>Reserve Seat (1-4 Seater)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenVisit} className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Physical Visit</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenComplaint} className="hover:text-amber-300 flex items-center gap-1.5 text-rose-300 font-bold transition-colors">
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>Submit Confidential Complaint</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-amber-300 transition-colors">
                  Track Existing Complaint Status
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-amber-300 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-amber-300 transition-colors">
                  Privacy Policy (Confidentiality)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office Desk */}
          <div className="lg:col-span-3 space-y-3 text-xs text-stone-300">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4 font-serif">
              Front Desk & Contact
            </h4>
            
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{settings.address}, {settings.city}, {settings.province}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{settings.phone}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{settings.email}</span>
            </div>

            <div className="pt-2 text-[11px] text-stone-400">
              Visiting hours: {settings.visitingHours}
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-white bg-stone-900/60 px-3 py-1.5 rounded-lg border border-stone-700/80 transition-colors"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Hostel Staff Portal Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-rose-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Paradise Boys Hostel Peshawar. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={onOpenPrivacy} className="hover:underline">Privacy Policy</button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:underline">Terms of Stay</button>
            <span>•</span>
            <button onClick={scrollToTop} className="hover:text-white flex items-center gap-1">
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
