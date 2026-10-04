import React, { useState } from 'react';
import { Logo } from './Logo';
import { HostelSettings, AdminUser } from '../types';
import {
  Phone,
  Calendar,
  Bed,
  ShieldAlert,
  Search,
  Menu,
  X,
  UserCheck,
  Lock,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface HeaderProps {
  settings: HostelSettings;
  adminUser: AdminUser | null;
  onOpenBooking: () => void;
  onOpenVisit: () => void;
  onOpenComplaint: () => void;
  onOpenTracker: () => void;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  adminUser,
  onOpenBooking,
  onOpenVisit,
  onOpenComplaint,
  onOpenTracker,
  onOpenAdminLogin,
  onOpenAdminDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200">
      
      {/* Top Bar matching the reference's color scheme and announcement */}
      <div className="bg-[#6b0819] text-white text-[11px] py-1.5 px-4 border-b border-amber-400/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-300 font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Admissions Open 2026</span>
            </span>
            <span className="hidden md:inline text-stone-400">•</span>
            <span className="hidden md:inline text-stone-200">
              Peshawar, Khyber Pakhtunkhwa — For Students & Working Professionals
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-stone-200">
              <Phone className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Helpline:</span>
              <span className="font-bold text-white">{settings.phone}</span>
            </div>

            {/* Admin Access Switch */}
            {adminUser ? (
              <button
                onClick={onOpenAdminDashboard}
                className="bg-amber-400 hover:bg-amber-300 text-[#7a0b1f] font-black px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <UserCheck className="w-3 h-3" />
                <span>Admin: {adminUser.role === 'SUPER_ADMIN' ? 'Super Admin' : adminUser.role === 'HOSTEL_ADMIN' ? 'Manager' : 'Staff'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="text-stone-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                title="Admin Management Login"
              >
                <Lock className="w-2.5 h-2.5 text-amber-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer"
        >
          <Logo size="md" variant="maroon" showTagline={false} />
        </div>

        {/* Desktop Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-bold text-stone-700 tracking-wide">
          <button
            onClick={() => scrollTo('rooms-section')}
            className="hover:text-[#800d1e] transition-colors uppercase"
          >
            Rooms & Pricing
          </button>
          <button
            onClick={() => scrollTo('why-choose-us')}
            className="hover:text-[#800d1e] transition-colors uppercase"
          >
            Why Choose Us
          </button>
          <button
            onClick={() => scrollTo('services-section')}
            className="hover:text-[#800d1e] transition-colors uppercase"
          >
            Facilities
          </button>
          <button
            onClick={() => scrollTo('gallery-section')}
            className="hover:text-[#800d1e] transition-colors uppercase"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollTo('location-section')}
            className="hover:text-[#800d1e] transition-colors uppercase"
          >
            Location
          </button>
          <button
            onClick={() => scrollTo('faq-section')}
            className="hover:text-[#800d1e] transition-colors uppercase"
          >
            FAQs
          </button>
          <button
            onClick={() => scrollTo('emergency-section')}
            className="text-rose-700 hover:text-rose-900 transition-colors uppercase flex items-center gap-1 font-black"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Track Complaint */}
          <button
            onClick={onOpenTracker}
            className="text-[11px] font-bold text-stone-600 hover:text-[#800d1e] px-2.5 py-2 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1"
            title="Check Complaint Status"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Issue</span>
          </button>

          {/* Report Issue / Complaint */}
          <button
            onClick={onOpenComplaint}
            className="text-[11px] font-bold text-[#800d1e] bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Grievance</span>
          </button>

          {/* Book a Visit */}
          <button
            onClick={onOpenVisit}
            className="bg-amber-100 hover:bg-amber-200 text-[#7a0b1f] border border-amber-300 px-3.5 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>

          {/* Reserve Room */}
          <button
            onClick={onOpenBooking}
            className="bg-[#800d1e] hover:bg-[#991b1b] text-white px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider shadow hover:shadow-md flex items-center gap-1.5 border border-amber-400/40 transition-all"
          >
            <Bed className="w-3.5 h-3.5 text-amber-300" />
            <span>Reserve Room</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 py-5 shadow-2xl space-y-4">
          <nav className="flex flex-col space-y-2 text-sm font-bold text-stone-800">
            <button
              onClick={() => scrollTo('rooms-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>Rooms & Pricing (28 Rooms)</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
            <button
              onClick={() => scrollTo('why-choose-us')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>Why Choose Paradise Boys Hostel</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
            <button
              onClick={() => scrollTo('services-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>Facilities & Solar Backup</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
            <button
              onClick={() => scrollTo('gallery-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>Hostel Photo Gallery</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
            <button
              onClick={() => scrollTo('location-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-50 flex items-center justify-between"
            >
              <span>Peshawar Location & Map</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
            <button
              onClick={() => scrollTo('emergency-section')}
              className="text-left py-2 px-3 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-between font-black"
            >
              <span>Emergency 1122 & Police 15 Support</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </button>
          </nav>

          <div className="pt-3 border-t border-stone-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="bg-[#800d1e] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Bed className="w-4 h-4 text-amber-300" />
              <span>Reserve Room</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVisit();
              }}
              className="bg-amber-400 text-[#7a0b1f] py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Visit</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenComplaint();
              }}
              className="col-span-1 bg-stone-100 text-stone-800 py-2 rounded-xl text-xs font-bold"
            >
              Report Grievance
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="col-span-1 bg-stone-100 text-stone-800 py-2 rounded-xl text-xs font-bold"
            >
              Track Complaint
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
