import React, { useState, useEffect } from 'react';
import {
  Room,
  Booking,
  VisitRequest,
  Complaint,
  Facility,
  GalleryItem,
  HostelSettings,
  AdminUser,
  ActivityLog,
  ComplaintAccessLog,
} from '../../types';
import { api } from '../../services/api';
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Users,
  AlertTriangle,
  Settings,
  Image as ImageIcon,
  DollarSign,
  Activity,
  LogOut,
  X,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Sparkles,
  Phone,
  Clock,
  Lock,
} from 'lucide-react';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onClose: () => void;
  initialRooms: Room[];
  initialSettings: HostelSettings;
  onRefreshData: () => void;
}

type TabType =
  | 'overview'
  | 'rooms'
  | 'bookings'
  | 'visits'
  | 'residents'
  | 'complaints'
  | 'pricing'
  | 'facilities'
  | 'gallery'
  | 'settings'
  | 'logs';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onClose,
  initialRooms,
  initialSettings,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<HostelSettings>(initialSettings);
  const [logs, setLogs] = useState<{ activityLogs: ActivityLog[]; complaintAccessLogs: ComplaintAccessLog[] }>({
    activityLogs: [],
    complaintAccessLogs: [],
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modal states for Editing
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState<Partial<Room>>({
    roomNumber: '',
    floor: 'Basement',
    capacity: 4,
    availableBeds: 4,
    monthlyPrice: 6000,
    status: 'AVAILABLE',
  });

  // Complaint identity reveal modal
  const [revealingComplaint, setRevealingComplaint] = useState<Complaint | null>(null);
  const [revealReason, setRevealReason] = useState('');
  const [revealedIdentity, setRevealedIdentity] = useState<any>(null);

  // Add gallery form
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCat, setNewGalleryCat] = useState<'ROOMS' | 'STUDY AREA' | 'COMMON AREA' | 'DINING' | 'BUILDING' | 'HOSTEL ENVIRONMENT'>('ROOMS');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  // Status message timer
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        statsData,
        roomsData,
        bookingsData,
        visitsData,
        complaintsData,
        facilitiesData,
        galleryData,
        settingsData,
        logsData,
      ] = await Promise.all([
        api.getStats(),
        api.getRooms(),
        api.getBookings(),
        api.getVisits(),
        api.getComplaints(),
        api.getFacilities(),
        api.getGallery(),
        api.getSettings(),
        api.getLogs(),
      ]);

      setStats(statsData);
      setRooms(roomsData);
      setBookings(bookingsData);
      setVisits(visitsData);
      setComplaints(complaintsData);
      setFacilities(facilitiesData);
      setGallery(galleryData);
      setSettings(settingsData);
      setLogs(logsData);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Room Status Update
  const handleUpdateRoomStatus = async (room: Room, newStatus: any) => {
    try {
      const updated = await api.updateRoom(room.id, { status: newStatus });
      setRooms((prev) => prev.map((r) => (r.id === room.id ? updated : r)));
      notify(`Room ${room.roomNumber} status set to ${newStatus}`);
      onRefreshData();
    } catch {
      notify('Failed to update room');
    }
  };

  // Save Room Edits
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      const updated = await api.updateRoom(editingRoom.id, editingRoom);
      setRooms((prev) => prev.map((r) => (r.id === editingRoom.id ? updated : r)));
      setEditingRoom(null);
      notify(`Room ${editingRoom.roomNumber} saved successfully`);
      onRefreshData();
    } catch {
      notify('Failed to save room details');
    }
  };

  // Add Room
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.addRoom(newRoomForm);
      setRooms((prev) => [...prev, created]);
      setIsAddingRoom(false);
      setNewRoomForm({
        roomNumber: '',
        floor: 'Basement',
        capacity: 4,
        availableBeds: 4,
        monthlyPrice: 6000,
        status: 'AVAILABLE',
      });
      notify(`Room ${created.roomNumber} created`);
      onRefreshData();
    } catch {
      notify('Failed to add room');
    }
  };

  // Delete Room
  const handleDeleteRoom = async (id: string, roomNum: string) => {
    if (user.role !== 'SUPER_ADMIN') {
      alert('Only Super Admin can delete rooms.');
      return;
    }
    if (!confirm(`Are you sure you want to delete Room ${roomNum}?`)) return;

    try {
      await api.deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      notify(`Room ${roomNum} deleted`);
      onRefreshData();
    } catch {
      notify('Failed to delete room');
    }
  };

  // Booking Actions
  const handleUpdateBookingStatus = async (booking: Booking, status: any, roomToAssign?: string) => {
    try {
      const updated = await api.updateBookingStatus(
        booking.id,
        status,
        booking.adminNotes,
        roomToAssign
      );
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
      notify(`Booking ${booking.referenceNumber} set to ${status}`);
      loadAllData();
      onRefreshData();
    } catch {
      notify('Error updating booking');
    }
  };

  // Visit Actions
  const handleUpdateVisitStatus = async (visit: VisitRequest, status: any) => {
    try {
      const updated = await api.updateVisitStatus(visit.id, status);
      setVisits((prev) => prev.map((v) => (v.id === visit.id ? updated : v)));
      notify(`Visit ${visit.referenceNumber} set to ${status}`);
    } catch {
      notify('Error updating visit');
    }
  };

  // Complaint Status
  const handleUpdateComplaintStatus = async (complaint: Complaint, status: any, notes?: string) => {
    try {
      const updated = await api.updateComplaintStatus(complaint.id, status, notes);
      setComplaints((prev) => prev.map((c) => (c.id === complaint.id ? updated : c)));
      notify(`Complaint ${complaint.complaintId} set to ${status}`);
    } catch {
      notify('Error updating complaint');
    }
  };

  // Reveal Confidential Identity (Super Admin Only with Audit)
  const handleRevealIdentity = async () => {
    if (!revealingComplaint || !revealReason) {
      alert('A valid reason is required for security audits.');
      return;
    }

    try {
      const data = await api.revealConfidentialIdentity(revealingComplaint.id, revealReason);
      setRevealedIdentity(data);
      notify('Identity revealed & recorded in audit log');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Access denied');
    }
  };

  // Gallery Add
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryUrl) return;

    try {
      const created = await api.addGalleryItem({
        title: newGalleryTitle,
        imageUrl: newGalleryUrl,
        category: newGalleryCat,
        caption: newGalleryCaption,
      });
      setGallery((prev) => [created, ...prev]);
      setNewGalleryTitle('');
      setNewGalleryUrl('');
      setNewGalleryCaption('');
      notify('Photo added to gallery');
    } catch {
      notify('Failed to add image');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    try {
      await api.deleteGalleryItem(id);
      setGallery((prev) => prev.filter((g) => g.id !== id));
      notify('Photo removed from gallery');
    } catch {
      notify('Failed to delete photo');
    }
  };

  // Save Settings & Pricing
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saved = await api.updateSettings(settings);
      setSettings(saved);
      notify('Hostel settings & pricing updated');
      onRefreshData();
    } catch {
      notify('Failed to update settings');
    }
  };

  const hasCriticalComplaints = complaints.some(
    (c) => (c.status !== 'RESOLVED' && c.status !== 'CLOSED') && (c.priority === 'CRITICAL' || c.isCriticalSafety)
  );

  return (
    <div className="fixed inset-0 z-50 bg-stone-900 text-stone-100 flex flex-col overflow-hidden">
      
      {/* Top Admin Header */}
      <div className="bg-[#6b0819] px-4 py-3 flex items-center justify-between border-b border-amber-400/40 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif font-black text-lg text-white">Paradise Boys Hostel</span>
          <span className="bg-amber-400 text-[#7a0b1f] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
            Management Panel
          </span>
          <span className="hidden sm:inline-block text-xs text-stone-300">
            Peshawar, KP
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-xs hidden sm:block">
            <div className="font-bold text-white">{user.name}</div>
            <div className="text-[10px] text-amber-300 font-mono">
              Role: {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'HOSTEL_ADMIN' ? 'Hostel Admin' : 'Staff'}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-[#800d1e] transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-[#800d1e] transition-colors"
            title="Return to Website"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Critical Safety Notification Bar */}
      {hasCriticalComplaints && (
        <div className="bg-rose-700 text-white px-4 py-2 text-xs font-black flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>CRITICAL SAFETY COMPLAINT — IMMEDIATE REVIEW REQUIRED BY ADMINISTRATION</span>
          </div>
          <button
            onClick={() => setActiveTab('complaints')}
            className="bg-white text-rose-800 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold"
          >
            Review Issue &rarr;
          </button>
        </div>
      )}

      {/* Temporary Toast */}
      {notification && (
        <div className="bg-amber-400 text-[#7a0b1f] font-bold text-xs px-4 py-1.5 text-center shadow-md">
          {notification}
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-stone-950 border-r border-stone-800 flex flex-col justify-between overflow-y-auto flex-shrink-0 p-3">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'overview' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activeTab === 'rooms' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bed className="w-4 h-4" />
                <span>Rooms & Floors</span>
              </div>
              <span className="text-[10px] bg-stone-800 px-1.5 py-0.5 rounded font-mono text-stone-300">
                {rooms.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activeTab === 'bookings' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Bookings</span>
              </div>
              {stats?.pendingBookings > 0 && (
                <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded-full">
                  {stats.pendingBookings}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('visits')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activeTab === 'visits' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Visit Requests</span>
              </div>
              {stats?.pendingVisits > 0 && (
                <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded-full">
                  {stats.pendingVisits}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('residents')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'residents' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Residents Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('complaints')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                activeTab === 'complaints' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Confidential Complaints</span>
              </div>
              {stats?.pendingComplaints > 0 && (
                <span className="text-[10px] bg-rose-600 text-white font-black px-1.5 py-0.5 rounded-full">
                  {stats.pendingComplaints}
                </span>
              )}
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase text-stone-600 tracking-wider">
              Content & Settings
            </div>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'pricing' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Pricing & Rates</span>
            </button>

            <button
              onClick={() => setActiveTab('facilities')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'facilities' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Facilities & Amenities</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'gallery' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'settings' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Hostel & Emergency</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'logs' ? 'bg-[#7a0b1f] text-white' : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Security & Audit Logs</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-stone-800 text-[10px] text-stone-500">
            <div>Paradise Hostel v2026.1</div>
            <div>Database Status: Connected</div>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-900">
          
          {/* ========================================================== */}
          {/* 1. OVERVIEW TAB */}
          {/* ========================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                  Executive Dashboard Overview
                </h2>
                <p className="text-xs text-stone-400">
                  Comprehensive real-time metrics for Paradise Boys Hostel Peshawar.
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-bold">
                    <span>Total Rooms</span>
                    <Bed className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-2">
                    {stats?.totalRooms ?? 28}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Basement: 13 | Upper: 15
                  </div>
                </div>

                <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-bold">
                    <span>Available Rooms</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400 mt-2">
                    {stats?.availableRooms ?? 20}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    {stats?.availableBeds ?? 42} Open Beds
                  </div>
                </div>

                <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-bold">
                    <span>Pending Bookings</span>
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-amber-400 mt-2">
                    {stats?.pendingBookings ?? 0}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    {stats?.pendingVisits ?? 0} Visit Requests
                  </div>
                </div>

                <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-bold">
                    <span>Pending Complaints</span>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-3xl font-black text-rose-400 mt-2">
                    {stats?.pendingComplaints ?? 0}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    {stats?.criticalComplaints ?? 0} Critical Safety Alerts
                  </div>
                </div>

              </div>

              {/* Residents Breakdown & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Demographic Cards */}
                <div className="bg-stone-800/60 border border-stone-700/80 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                    Resident Demographics
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-900 p-4 rounded-xl border border-stone-800">
                      <div className="text-xs text-stone-400 font-bold uppercase">Students</div>
                      <div className="text-2xl font-black text-amber-300 mt-1">
                        {stats?.studentsCount ?? 1}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">UET, UoP, Islamia</div>
                    </div>

                    <div className="bg-stone-900 p-4 rounded-xl border border-stone-800">
                      <div className="text-xs text-stone-400 font-bold uppercase">Working Professionals</div>
                      <div className="text-2xl font-black text-white mt-1">
                        {stats?.professionalsCount ?? 0}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">IT, Engineers, Govt</div>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    <strong>Peshawar Regulation Notice:</strong> Maintain up-to-date CNIC photocopies and student/employee cards for every resident to comply with local police guest verification directives.
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-stone-800/60 border border-stone-700/80 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                    Quick Administrative Shortcuts
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <button
                      onClick={() => {
                        setIsAddingRoom(true);
                        setActiveTab('rooms');
                      }}
                      className="p-3 bg-[#7a0b1f] hover:bg-[#991b1b] rounded-xl text-white transition-colors text-left flex items-center justify-between"
                    >
                      <span>Add New Room</span>
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="p-3 bg-stone-900 hover:bg-stone-700 rounded-xl text-stone-200 transition-colors text-left flex items-center justify-between"
                    >
                      <span>Review Bookings</span>
                      <Calendar className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="p-3 bg-stone-900 hover:bg-stone-700 rounded-xl text-stone-200 transition-colors text-left flex items-center justify-between"
                    >
                      <span>Confidential Grievances</span>
                      <ShieldAlert className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="p-3 bg-stone-900 hover:bg-stone-700 rounded-xl text-stone-200 transition-colors text-left flex items-center justify-between"
                    >
                      <span>Update Room Rates</span>
                      <DollarSign className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 2. ROOMS & FLOORS TAB */}
          {/* ========================================================== */}
          {activeTab === 'rooms' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-white">
                    Room Inventory & Availability Management
                  </h2>
                  <p className="text-xs text-stone-400">
                    Manage all 28 rooms across Basement (13 rooms) and Upper Floor (15 rooms).
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingRoom(true)}
                  className="bg-[#7a0b1f] hover:bg-[#991b1b] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Room</span>
                </button>
              </div>

              {/* Room Cards / Table */}
              <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Floor</th>
                        <th className="py-3 px-4">Occupancy</th>
                        <th className="py-3 px-4">Available Beds</th>
                        <th className="py-3 px-4">Monthly Rate</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60 font-medium">
                      {rooms.map((room) => (
                        <tr key={room.id} className="hover:bg-stone-900/40">
                          <td className="py-3 px-4 font-bold text-white">
                            {room.roomNumber}
                          </td>
                          <td className="py-3 px-4 text-stone-300">
                            {room.floor}
                          </td>
                          <td className="py-3 px-4">
                            {room.capacity === 1 ? '1 Seater' : `${room.capacity} Seater`}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-amber-300">
                              {room.availableBeds} / {room.capacity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-300">
                            {room.priceDisplay}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={room.status}
                              onChange={(e) => handleUpdateRoomStatus(room, e.target.value)}
                              className="bg-stone-900 text-xs px-2 py-1 rounded border border-stone-700 text-stone-200 focus:outline-none"
                            >
                              <option value="AVAILABLE">AVAILABLE</option>
                              <option value="ALMOST_FULL">ALMOST FULL</option>
                              <option value="FULL">FULL</option>
                              <option value="MAINTENANCE">MAINTENANCE</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingRoom(room)}
                              className="text-stone-400 hover:text-amber-300 p-1"
                              title="Edit Room"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {user.role === 'SUPER_ADMIN' && (
                              <button
                                onClick={() => handleDeleteRoom(room.id, room.roomNumber)}
                                className="text-stone-400 hover:text-rose-400 p-1"
                                title="Delete Room"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* 3. BOOKINGS TAB */}
          {/* ========================================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Room Reservations & Booking Applications
                </h2>
                <p className="text-xs text-stone-400">
                  Review incoming resident applications. Physical confirmation requires administrative approval.
                </p>
              </div>

              <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Ref Number</th>
                        <th className="py-3 px-4">Applicant</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Preferred Room</th>
                        <th className="py-3 px-4">Move-in Date</th>
                        <th className="py-3 px-4">Phone / Contact</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60 font-medium">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-stone-500">
                            No booking applications on record.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-stone-900/40">
                            <td className="py-3 px-4 font-mono font-bold text-amber-300">
                              {b.referenceNumber}
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-white font-bold">{b.fullName}</div>
                              <div className="text-[10px] text-stone-400">CNIC: {b.cnic}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-stone-800 text-stone-300 text-[10px] px-2 py-0.5 rounded">
                                {b.userType}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-stone-200">
                              {b.preferredRoomType} ({b.preferredFloor})
                            </td>
                            <td className="py-3 px-4 text-stone-300">
                              {b.expectedMoveInDate}
                            </td>
                            <td className="py-3 px-4 text-stone-300">
                              {b.phone}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  b.status === 'APPROVED'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : b.status === 'PENDING'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              {b.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b, 'APPROVED')}
                                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-bold"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b, 'REJECTED')}
                                    className="bg-rose-900 hover:bg-rose-800 text-white px-2.5 py-1 rounded text-[11px] font-bold"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {b.status === 'APPROVED' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b, 'COMPLETED')}
                                  className="text-stone-400 hover:text-white text-[11px]"
                                >
                                  Mark Checked-In
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 4. VISITS TAB */}
          {/* ========================================================== */}
          {activeTab === 'visits' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Scheduled Visit Requests
                </h2>
                <p className="text-xs text-stone-400">
                  Prospective residents scheduling physical tours before confirming room bookings.
                </p>
              </div>

              <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Ref Number</th>
                        <th className="py-3 px-4">Visitor Name</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Preferred Date & Time</th>
                        <th className="py-3 px-4">Interest</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60 font-medium">
                      {visits.map((v) => (
                        <tr key={v.id} className="hover:bg-stone-900/40">
                          <td className="py-3 px-4 font-mono font-bold text-amber-300">
                            {v.referenceNumber}
                          </td>
                          <td className="py-3 px-4 text-white font-bold">{v.fullName}</td>
                          <td className="py-3 px-4 text-stone-300">{v.phone}</td>
                          <td className="py-3 px-4 text-stone-300">
                            {v.preferredDate} ({v.preferredTime})
                          </td>
                          <td className="py-3 px-4 text-stone-300">{v.roomPreference}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                v.status === 'APPROVED'
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : v.status === 'PENDING'
                                  ? 'bg-amber-950 text-amber-300'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {v.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            {v.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateVisitStatus(v, 'APPROVED')}
                                className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px]"
                              >
                                Confirm Tour
                              </button>
                            )}
                            {v.status === 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateVisitStatus(v, 'COMPLETED')}
                                className="bg-stone-800 hover:bg-stone-700 text-white px-2 py-1 rounded text-[11px]"
                              >
                                Completed
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 5. RESIDENTS DIRECTORY TAB */}
          {/* ========================================================== */}
          {activeTab === 'residents' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Residents Directory (Students & Working Professionals)
                </h2>
                <p className="text-xs text-stone-400">
                  Approved residents currently occupying seats or scheduled for move-in.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings
                  .filter((b) => b.status === 'APPROVED' || b.status === 'COMPLETED')
                  .map((b) => (
                    <div
                      key={b.id}
                      className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white">{b.fullName}</span>
                        <span className="text-[10px] font-black uppercase bg-[#7a0b1f] text-white px-2 py-0.5 rounded">
                          {b.userType}
                        </span>
                      </div>

                      <div className="text-xs text-stone-300 space-y-1">
                        <div>
                          <strong>Affiliation:</strong> {b.institutionOrWorkplace || 'N/A'}
                        </div>
                        <div>
                          <strong>Phone:</strong> {b.phone}
                        </div>
                        <div>
                          <strong>CNIC:</strong> {b.cnic}
                        </div>
                        <div>
                          <strong>Room:</strong> {b.preferredRoomType} ({b.preferredRoomNumber || 'Assigned by office'})
                        </div>
                        <div>
                          <strong>Emergency Contact:</strong> {b.emergencyContact?.name} ({b.emergencyContact?.phone})
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 6. CONFIDENTIAL COMPLAINT SYSTEM (CRITICAL PRIVACY) */}
          {/* ========================================================== */}
          {activeTab === 'complaints' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>Confidential Grievance & Safety Incident Queue</span>
                  </h2>
                  <p className="text-xs text-stone-400">
                    Complaints submitted confidentially protect resident identity. Unauthorized staff cannot view complainant data.
                  </p>
                </div>
              </div>

              <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Complainant Privacy</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60 font-medium">
                      {complaints.map((c) => (
                        <tr key={c.id} className="hover:bg-stone-900/40">
                          <td className="py-3 px-4 font-mono font-bold text-amber-300">
                            {c.complaintId}
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            {c.category}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                c.priority === 'CRITICAL' || c.isCriticalSafety
                                  ? 'bg-rose-900 text-white animate-pulse'
                                  : 'bg-stone-800 text-stone-300'
                              }`}
                            >
                              {c.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-300">
                            {c.roomNumber || 'General'}
                          </td>
                          <td className="py-3 px-4">
                            {c.isConfidential ? (
                              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                                <Lock className="w-3 h-3" />
                                <span>Confidential (Protected)</span>
                              </div>
                            ) : (
                              <span className="text-stone-400">{c.complainantName}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-stone-300 max-w-xs truncate">
                            {c.description}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateComplaintStatus(c, e.target.value)}
                              className="bg-stone-900 text-xs px-2 py-1 rounded border border-stone-700 text-stone-200"
                            >
                              <option value="NEW">NEW</option>
                              <option value="UNDER_REVIEW">UNDER REVIEW</option>
                              <option value="IN_PROGRESS">IN PROGRESS</option>
                              <option value="RESOLVED">RESOLVED</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            {/* Inspect Confidential Identity (Only Super Admin / Authorized) */}
                            {c.isConfidential && user.role === 'SUPER_ADMIN' && (
                              <button
                                onClick={() => {
                                  setRevealingComplaint(c);
                                  setRevealReason('');
                                  setRevealedIdentity(null);
                                }}
                                className="text-amber-400 hover:underline text-[10px] font-bold"
                              >
                                Audit Reveal &rarr;
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 7. PRICING TAB */}
          {/* ========================================================== */}
          {activeTab === 'pricing' && (
            <div className="max-w-2xl space-y-5">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Pricing & Rent Configuration
                </h2>
                <p className="text-xs text-stone-400">
                  Update official hostel prices without code changes. Prices propagate to the website instantly.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">
                    1 Seater Room Monthly Rent (PKR) *
                  </label>
                  <input
                    type="number"
                    value={settings.pricing.oneSeaterPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: { ...settings.pricing, oneSeaterPrice: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-stone-500">Confirmed base rate: Rs. 24,000/month</span>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">
                    4 Seater Room Monthly Rent (PKR per Person) *
                  </label>
                  <input
                    type="number"
                    value={settings.pricing.fourSeaterPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: { ...settings.pricing, fourSeaterPrice: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-stone-500">Confirmed base rate: Rs. 6,000 per person/month</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">
                      2 Seater Display Note
                    </label>
                    <input
                      type="text"
                      value={settings.pricing.twoSeaterNote}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricing: { ...settings.pricing, twoSeaterNote: e.target.value },
                        })
                      }
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">
                      3 Seater Display Note
                    </label>
                    <input
                      type="text"
                      value={settings.pricing.threeSeaterNote}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricing: { ...settings.pricing, threeSeaterNote: e.target.value },
                        })
                      }
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">
                    Utility & Inclusions Policy Note
                  </label>
                  <textarea
                    rows={2}
                    value={settings.pricing.utilityNote}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: { ...settings.pricing, utilityNote: e.target.value },
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#7a0b1f] hover:bg-[#991b1b] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  Save Pricing Changes
                </button>
              </form>
            </div>
          )}

          {/* ========================================================== */}
          {/* 8. FACILITIES MANAGEMENT */}
          {/* ========================================================== */}
          {activeTab === 'facilities' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Hostel Facilities & Services Configuration
                </h2>
                <p className="text-xs text-stone-400">
                  Toggle facilities on/off. Never claim unconfirmed facilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facilities.map((fac, idx) => (
                  <div
                    key={fac.id}
                    className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{fac.name}</div>
                      <div className="text-[11px] text-stone-400">{fac.description}</div>
                      <div className="text-[10px] text-amber-300 mt-1">Status: {fac.statusText}</div>
                    </div>
                    <button
                      onClick={async () => {
                        const updated = [...facilities];
                        updated[idx].isIncluded = !updated[idx].isIncluded;
                        setFacilities(updated);
                        await api.updateFacilities(updated);
                        notify(`Toggled ${fac.name}`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                        fac.isIncluded
                          ? 'bg-emerald-800 text-white'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {fac.isIncluded ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 9. GALLERY MANAGER */}
          {/* ========================================================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Gallery Photo Manager
                </h2>
                <p className="text-xs text-stone-400">
                  Add, categorize, and remove hostel imagery.
                </p>
              </div>

              {/* Add Photo Form */}
              <form onSubmit={handleAddGalleryItem} className="bg-stone-950 p-5 rounded-2xl border border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-stone-400 font-bold mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deluxe Single Room"
                    value={newGalleryTitle}
                    onChange={(e) => setNewGalleryTitle(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-bold mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-bold mb-1">Category *</label>
                  <select
                    value={newGalleryCat}
                    onChange={(e) => setNewGalleryCat(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                  >
                    <option value="ROOMS">ROOMS</option>
                    <option value="STUDY AREA">STUDY AREA</option>
                    <option value="COMMON AREA">COMMON AREA</option>
                    <option value="DINING">DINING</option>
                    <option value="BUILDING">BUILDING</option>
                    <option value="HOSTEL ENVIRONMENT">HOSTEL ENVIRONMENT</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-[#7a0b1f] hover:bg-[#991b1b] text-white py-2 rounded-lg font-bold text-xs uppercase"
                  >
                    Upload Image
                  </button>
                </div>
              </form>

              {/* Existing Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="relative rounded-xl overflow-hidden bg-stone-950 border border-stone-800 group">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-36 object-cover" />
                    <div className="p-3 text-xs">
                      <div className="font-bold text-white truncate">{g.title}</div>
                      <div className="text-[10px] text-amber-400 uppercase">{g.category}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteGalleryItem(g.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-900/80 text-white hover:bg-rose-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 10. HOSTEL & EMERGENCY SETTINGS */}
          {/* ========================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-5">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Hostel Profile & Emergency Contacts
                </h2>
                <p className="text-xs text-stone-400">
                  Configure real Peshawar police station and emergency jurisdiction numbers.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Hostel Name</label>
                    <input
                      type="text"
                      value={settings.hostelName}
                      onChange={(e) => setSettings({ ...settings, hostelName: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Helpline Phone</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">WhatsApp Contact</label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Address in Peshawar</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div className="pt-3 border-t border-stone-800">
                  <h4 className="font-bold text-amber-300 mb-3 uppercase tracking-wider text-[11px]">
                    Emergency Services Configuration
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">Local Police Station</label>
                      <input
                        type="text"
                        value={settings.emergency?.localPoliceStationName || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            emergency: { ...settings.emergency, localPoliceStationName: e.target.value },
                          })
                        }
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-300 mb-1">Police District / Jurisdiction</label>
                      <input
                        type="text"
                        value={settings.emergency?.districtLocationNote || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            emergency: { ...settings.emergency, districtLocationNote: e.target.value },
                          })
                        }
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#7a0b1f] hover:bg-[#991b1b] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  Save Profile Settings
                </button>
              </form>
            </div>
          )}

          {/* ========================================================== */}
          {/* 11. SECURITY & AUDIT LOGS */}
          {/* ========================================================== */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">
                  Security Audit Trail & Confidential Access Logs
                </h2>
                <p className="text-xs text-stone-400">
                  Every sensitive action and confidential identity inspection is permanently logged.
                </p>
              </div>

              {/* Confidential Access Log Table */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                  Confidential Identity Inspection Records
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-400 text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-3">Timestamp</th>
                        <th className="py-2 px-3">Complaint ID</th>
                        <th className="py-2 px-3">Accessed By</th>
                        <th className="py-2 px-3">Role</th>
                        <th className="py-2 px-3">Audited Justification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {logs.complaintAccessLogs.map((l) => (
                        <tr key={l.id}>
                          <td className="py-2 px-3 text-stone-400 font-mono text-[10px]">
                            {new Date(l.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 font-bold text-amber-300">{l.complaintId}</td>
                          <td className="py-2 px-3 text-white">{l.accessedByEmail}</td>
                          <td className="py-2 px-3 text-stone-300">{l.accessedByRole}</td>
                          <td className="py-2 px-3 text-stone-300">{l.accessReason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* General Activity Logs */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  System Activity Logs
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-[11px]">
                  {logs.activityLogs.map((act) => (
                    <div key={act.id} className="p-2 rounded bg-stone-900 border border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-amber-400 font-bold mr-2">[{act.action}]</span>
                        <span className="text-stone-300">{act.details}</span>
                        <span className="text-stone-500 ml-2">by {act.performedBy}</span>
                      </div>
                      <span className="text-stone-500 text-[10px]">
                        {new Date(act.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 p-6 rounded-2xl max-w-md w-full text-xs text-stone-300">
            <h3 className="text-base font-bold text-white mb-4">Edit Room {editingRoom.roomNumber}</h3>
            <form onSubmit={handleSaveRoom} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Room Number</label>
                <input
                  type="text"
                  value={editingRoom.roomNumber}
                  onChange={(e) => setEditingRoom({ ...editingRoom, roomNumber: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Floor</label>
                  <select
                    value={editingRoom.floor}
                    onChange={(e) => setEditingRoom({ ...editingRoom, floor: e.target.value as any })}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white"
                  >
                    <option value="Basement">Basement</option>
                    <option value="Upper Floor">Upper Floor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Capacity</label>
                  <select
                    value={editingRoom.capacity}
                    onChange={(e) => setEditingRoom({ ...editingRoom, capacity: Number(e.target.value) })}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white"
                  >
                    <option value={1}>1 Seater</option>
                    <option value={2}>2 Seater</option>
                    <option value={3}>3 Seater</option>
                    <option value={4}>4 Seater</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Available Beds Count</label>
                <input
                  type="number"
                  value={editingRoom.availableBeds}
                  onChange={(e) => setEditingRoom({ ...editingRoom, availableBeds: Number(e.target.value) })}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Monthly Price (PKR)</label>
                <input
                  type="number"
                  value={editingRoom.monthlyPrice || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, monthlyPrice: Number(e.target.value) })}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-[#7a0b1f] hover:bg-[#991b1b] text-white py-2 rounded font-bold">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingRoom(null)} className="flex-1 bg-stone-800 text-stone-300 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddingRoom && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 p-6 rounded-2xl max-w-md w-full text-xs text-stone-300">
            <h3 className="text-base font-bold text-white mb-4">Add New Room</h3>
            <form onSubmit={handleAddRoom} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Room Number (e.g. B-14 or U-16)</label>
                <input
                  type="text"
                  required
                  value={newRoomForm.roomNumber}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, roomNumber: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Floor</label>
                  <select
                    value={newRoomForm.floor}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, floor: e.target.value as any })}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white"
                  >
                    <option value="Basement">Basement</option>
                    <option value="Upper Floor">Upper Floor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Capacity</label>
                  <select
                    value={newRoomForm.capacity}
                    onChange={(e) =>
                      setNewRoomForm({
                        ...newRoomForm,
                        capacity: Number(e.target.value),
                        availableBeds: Number(e.target.value),
                        monthlyPrice: Number(e.target.value) === 1 ? 24000 : 6000,
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white"
                  >
                    <option value={1}>1 Seater</option>
                    <option value={2}>2 Seater</option>
                    <option value={3}>3 Seater</option>
                    <option value={4}>4 Seater</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-[#7a0b1f] text-white py-2 rounded font-bold">
                  Create Room
                </button>
                <button type="button" onClick={() => setIsAddingRoom(false)} className="flex-1 bg-stone-800 text-stone-300 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reveal Confidential Identity Modal (Super Admin Audited) */}
      {revealingComplaint && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-rose-800 p-6 rounded-2xl max-w-lg w-full text-xs text-stone-300">
            <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-base text-white">Confidential Complainant Identity Disclosure</span>
            </div>
            <p className="text-stone-400 mb-4">
              Complaint ID: <strong className="text-amber-300">{revealingComplaint.complaintId}</strong>.
              Access is strictly governed by privacy protocols. Please document your valid investigative reason below.
            </p>

            {revealedIdentity ? (
              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl space-y-2 mb-4 text-white">
                <div><strong>Complainant Name:</strong> {revealedIdentity.complainantName}</div>
                <div><strong>Phone Number:</strong> {revealedIdentity.complainantPhone}</div>
                <div><strong>Email:</strong> {revealedIdentity.complainantEmail || 'N/A'}</div>
                <div className="text-[10px] text-amber-400 mt-2">Audit Entry: {revealedIdentity.auditId}</div>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <label className="block font-bold text-white">
                  Mandatory Recorded Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Physical inspection of reported safety issue in fire escape required contacting resident..."
                  value={revealReason}
                  onChange={(e) => setRevealReason(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-white focus:outline-none"
                />
                <button
                  onClick={handleRevealIdentity}
                  className="w-full bg-rose-700 hover:bg-rose-600 text-white py-2 rounded font-bold uppercase text-[11px]"
                >
                  Verify Reason & Inspect Details
                </button>
              </div>
            )}

            <button
              onClick={() => setRevealingComplaint(null)}
              className="w-full bg-stone-800 text-stone-300 py-2 rounded font-bold"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
