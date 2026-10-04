import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeatureStrip } from './components/FeatureStrip';
import { HeroThumbnails } from './components/HeroThumbnails';
import { RoomsSection } from './components/RoomsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { StudentsProfessionalsSection } from './components/StudentsProfessionalsSection';
import { ServicesGrid } from './components/ServicesGrid';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { EmergencySection } from './components/EmergencySection';
import { FAQSection } from './components/FAQSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Modals
import { BookingModal } from './components/BookingModal';
import { VisitModal } from './components/VisitModal';
import { ComplaintModal } from './components/ComplaintModal';
import { ComplaintTrackerModal } from './components/ComplaintTrackerModal';
import { RoomDetailModal } from './components/RoomDetailModal';
import { TermsModal, PrivacyModal } from './components/TermsModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Data & Types
import { Room, Facility, GalleryItem, HostelSettings, AdminUser } from './types';
import {
  INITIAL_ROOMS,
  INITIAL_FACILITIES,
  INITIAL_GALLERY,
  INITIAL_SETTINGS,
} from './data/initialData';
import { api, authStorage } from './services/api';

export default function App() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [settings, setSettings] = useState<HostelSettings>(INITIAL_SETTINGS);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Modal visibility states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRoomType, setBookingRoomType] = useState<string>('4 Seater');
  const [bookingRoomNumber, setBookingRoomNumber] = useState<string>('');

  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerComplaintId, setTrackerComplaintId] = useState<string>('');

  const [selectedRoomDetail, setSelectedRoomDetail] = useState<Room | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const refreshData = async () => {
    try {
      const [fetchedRooms, fetchedFacilities, fetchedGallery, fetchedSettings] = await Promise.all([
        api.getRooms(),
        api.getFacilities(),
        api.getGallery(),
        api.getSettings(),
      ]);
      setRooms(fetchedRooms);
      setFacilities(fetchedFacilities);
      setGallery(fetchedGallery);
      setSettings(fetchedSettings);
    } catch (e) {
      console.warn('Initial data load error:', e);
    }
  };

  useEffect(() => {
    refreshData();
    const storedUser = authStorage.getUser();
    if (storedUser) {
      setAdminUser(storedUser);
    }
  }, []);

  const handleOpenBooking = (roomType = '4 Seater', roomNumber = '') => {
    setBookingRoomType(roomType);
    setBookingRoomNumber(roomNumber);
    setIsBookingOpen(true);
  };

  const handleOpenVisit = () => {
    setIsVisitOpen(true);
  };

  const handleOpenComplaint = () => {
    setIsComplaintOpen(true);
  };

  const handleOpenTracker = (id = '') => {
    setTrackerComplaintId(id);
    setIsTrackerOpen(true);
  };

  const scrollToRooms = () => {
    const el = document.getElementById('rooms-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    api.logout();
    setAdminUser(null);
    setIsAdminDashboardOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col selection:bg-[#7a0b1f] selection:text-white">
      
      {/* 1. Header Navigation */}
      <Header
        settings={settings}
        adminUser={adminUser}
        onOpenBooking={() => handleOpenBooking()}
        onOpenVisit={handleOpenVisit}
        onOpenComplaint={handleOpenComplaint}
        onOpenTracker={() => handleOpenTracker()}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section (Recreated from reference image) */}
        <Hero
          settings={settings}
          onOpenBooking={handleOpenBooking}
          onOpenVisit={handleOpenVisit}
          onScrollToRooms={scrollToRooms}
        />

        {/* 3. Hero Feature Strip (Circular maroon icons with gold dividers) */}
        <FeatureStrip />

        {/* 4. Bottom 5-Photo Highlights Strip & Information Ribbon */}
        <HeroThumbnails onSelectCategory={() => scrollToRooms()} />

        {/* 5. Hostel Room Information (Basement: 13, Upper: 15, Total: 28 Rooms) */}
        <RoomsSection
          rooms={rooms}
          onOpenBooking={handleOpenBooking}
          onOpenVisit={handleOpenVisit}
          onViewRoomDetails={(room) => setSelectedRoomDetail(room)}
        />

        {/* 6. Why Choose Paradise Boys Hostel (15 verified advantages) */}
        <WhyChooseUs onReserveClick={() => handleOpenBooking()} />

        {/* 7. Built for Students & Working Professionals (Tailored cards) */}
        <StudentsProfessionalsSection
          onFindRoom={(type) => {
            handleOpenBooking(type === 'Student' ? '4 Seater' : '1 Seater');
          }}
        />

        {/* 8. Hostel Services & Amenities Grid */}
        <ServicesGrid facilities={facilities} />

        {/* 9. Photo Gallery with Lightbox */}
        <GallerySection items={gallery} />

        {/* 10. Peshawar Location & Proximity */}
        <LocationSection settings={settings} />

        {/* 11. Emergency & Safety Support (1122, Police 15, Police Station) */}
        <EmergencySection
          settings={settings}
          onOpenComplaint={handleOpenComplaint}
        />

        {/* 12. About Paradise Boys Hostel */}
        <AboutSection />

        {/* 13. Frequently Asked Questions */}
        <FAQSection />

        {/* 14. Contact Section with WhatsApp & Hotline */}
        <ContactSection settings={settings} />
      </main>

      {/* 15. Deep Maroon Footer */}
      <Footer
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenVisit={handleOpenVisit}
        onOpenComplaint={handleOpenComplaint}
        onOpenTracker={() => handleOpenTracker()}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}

      {/* Room Reservation Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        rooms={rooms}
        initialRoomType={bookingRoomType}
        initialRoomNumber={bookingRoomNumber}
      />

      {/* Visit Scheduler Modal */}
      <VisitModal
        isOpen={isVisitOpen}
        onClose={() => setIsVisitOpen(false)}
      />

      {/* Confidential Complaint & Reporting Modal */}
      <ComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
        settings={settings}
        onOpenTracker={(cid) => handleOpenTracker(cid)}
      />

      {/* Complaint Status Tracker Modal */}
      <ComplaintTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialComplaintId={trackerComplaintId}
      />

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoomDetail}
        onClose={() => setSelectedRoomDetail(null)}
        onReserve={(room) => handleOpenBooking(room.capacity === 1 ? '1 Seater' : `${room.capacity} Seater`, room.roomNumber)}
        onBookVisit={handleOpenVisit}
      />

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Admin Management Dashboard */}
      {isAdminDashboardOpen && adminUser && (
        <AdminDashboard
          user={adminUser}
          onLogout={handleAdminLogout}
          onClose={() => setIsAdminDashboardOpen(false)}
          initialRooms={rooms}
          initialSettings={settings}
          onRefreshData={refreshData}
        />
      )}

    </div>
  );
}
