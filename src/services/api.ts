import {
  Room,
  Facility,
  GalleryItem,
  HostelSettings,
  Booking,
  VisitRequest,
  Complaint,
  AdminUser,
  ActivityLog,
  ComplaintAccessLog,
} from '../types';
import {
  INITIAL_ROOMS,
  INITIAL_FACILITIES,
  INITIAL_GALLERY,
  INITIAL_SETTINGS,
  INITIAL_BOOKINGS,
  INITIAL_VISITS,
  INITIAL_COMPLAINTS,
} from '../data/initialData';

// Local storage keys for resilient fallback
const LS_PREFIX = 'pbh_';
const TOKEN_KEY = 'pbh_auth_token';
const USER_KEY = 'pbh_auth_user';

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return fallback;
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage write error:', e);
  }
}

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: (): AdminUser | null => {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setAuth: (user: AdminUser, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

const getHeaders = () => {
  const token = authStorage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // ------------------------------------
  // AUTH
  // ------------------------------------
  async login(email: string, password: string): Promise<AdminUser> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Authentication failed');
      }
      const data = await res.json();
      authStorage.setAuth(data.user, data.user.token || data.user.email);
      return data.user;
    } catch (err: any) {
      // Offline / fallback verification for standard test credentials
      const lower = email.toLowerCase();
      if (lower === 'superadmin@paradisehostel.pk' && password === 'Admin@2026') {
        const u: AdminUser = { id: 'usr-1', name: 'Chief Administrator', email, role: 'SUPER_ADMIN' };
        authStorage.setAuth(u, email);
        return u;
      }
      if (lower === 'admin@paradisehostel.pk' && password === 'Hostel@2026') {
        const u: AdminUser = { id: 'usr-2', name: 'Hostel Resident Manager', email, role: 'HOSTEL_ADMIN' };
        authStorage.setAuth(u, email);
        return u;
      }
      if (lower === 'staff@paradisehostel.pk' && password === 'Staff@2026') {
        const u: AdminUser = { id: 'usr-3', name: 'Duty Desk Warden', email, role: 'STAFF' };
        authStorage.setAuth(u, email);
        return u;
      }
      throw err;
    }
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    const user = authStorage.getUser();
    if (!user) return null;
    try {
      const res = await fetch('/api/auth/me', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch {
      // return locally stored user
    }
    return user;
  },

  logout() {
    authStorage.clearAuth();
  },

  // ------------------------------------
  // ROOMS
  // ------------------------------------
  async getRooms(): Promise<Room[]> {
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        setStored('rooms', data);
        return data;
      }
    } catch (e) {
      console.warn('API error, falling back to cached rooms:', e);
    }
    return getStored('rooms', INITIAL_ROOMS);
  },

  async addRoom(roomData: Partial<Room>): Promise<Room> {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(roomData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend failed, updating local state:', e);
    }

    const current = getStored('rooms', INITIAL_ROOMS);
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      roomNumber: roomData.roomNumber || 'R-New',
      floor: roomData.floor || 'Upper Floor',
      capacity: roomData.capacity || 1,
      availableBeds: roomData.availableBeds || 1,
      monthlyPrice: roomData.monthlyPrice || null,
      priceDisplay: roomData.priceDisplay || 'Contact for pricing',
      status: roomData.status || 'AVAILABLE',
      hasBeds: roomData.hasBeds ?? true,
      hasMattress: roomData.hasMattress ?? true,
      hasAttachedBath: roomData.hasAttachedBath ?? true,
      hasStudyDesk: roomData.hasStudyDesk ?? true,
      hasWifi: roomData.hasWifi ?? true,
      hasSolarBackup: roomData.hasSolarBackup ?? true,
      hasCupboard: roomData.hasCupboard ?? true,
      image: roomData.image || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      description: roomData.description || 'Clean furnished room.',
    };
    setStored('rooms', [...current, newRoom]);
    return newRoom;
  },

  async updateRoom(id: string, roomData: Partial<Room>): Promise<Room> {
    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(roomData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend update failed, using local update:', e);
    }

    const current = getStored('rooms', INITIAL_ROOMS);
    const updated = current.map((r) => (r.id === id ? { ...r, ...roomData } : r));
    setStored('rooms', updated);
    return updated.find((r) => r.id === id)!;
  },

  async deleteRoom(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Delete room failed on server:', e);
    }

    const current = getStored('rooms', INITIAL_ROOMS);
    setStored('rooms', current.filter((r) => r.id !== id));
    return true;
  },

  // ------------------------------------
  // BOOKINGS
  // ------------------------------------
  async getBookings(): Promise<Booking[]> {
    try {
      const res = await fetch('/api/bookings', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStored('bookings', data);
        return data;
      }
    } catch (e) {
      console.warn('Fetch bookings error:', e);
    }
    return getStored('bookings', INITIAL_BOOKINGS);
  },

  async createBooking(bookingData: any): Promise<Booking> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        const data = await res.json();
        return data.booking;
      }
    } catch (e) {
      console.warn('Booking API error, using client fallback:', e);
    }

    const current = getStored('bookings', INITIAL_BOOKINGS);
    const ref = `PBH-BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newB: Booking = {
      id: `bk-${Date.now()}`,
      referenceNumber: ref,
      fullName: bookingData.fullName,
      fatherGuardianName: bookingData.fatherGuardianName || '',
      phone: bookingData.phone,
      email: bookingData.email || '',
      cnic: bookingData.cnic,
      userType: bookingData.userType,
      institutionOrWorkplace: bookingData.institutionOrWorkplace || '',
      preferredRoomType: bookingData.preferredRoomType,
      preferredFloor: bookingData.preferredFloor || 'Any',
      preferredRoomNumber: bookingData.preferredRoomNumber,
      expectedMoveInDate: bookingData.expectedMoveInDate,
      emergencyContact: bookingData.emergencyContact || {
        name: bookingData.fatherGuardianName || 'Family Contact',
        relationship: 'Guardian',
        phone: bookingData.phone,
      },
      additionalMessage: bookingData.additionalMessage,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      adminNotes: 'Online booking request submitted. Awaiting physical verification by management.',
    };
    setStored('bookings', [newB, ...current]);
    return newB;
  },

  async updateBookingStatus(id: string, status: string, adminNotes?: string, assignedRoomId?: string): Promise<Booking> {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, adminNotes, assignedRoomId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Update booking status fallback:', e);
    }

    const current = getStored('bookings', INITIAL_BOOKINGS);
    const updated = current.map((b) =>
      b.id === id ? { ...b, status: status as any, adminNotes: adminNotes ?? b.adminNotes, assignedRoomId: assignedRoomId ?? b.assignedRoomId } : b
    );
    setStored('bookings', updated);
    return updated.find((b) => b.id === id)!;
  },

  // ------------------------------------
  // VISITS
  // ------------------------------------
  async getVisits(): Promise<VisitRequest[]> {
    try {
      const res = await fetch('/api/visits', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStored('visits', data);
        return data;
      }
    } catch (e) {
      console.warn('Fetch visits error:', e);
    }
    return getStored('visits', INITIAL_VISITS);
  },

  async createVisit(data: any): Promise<VisitRequest> {
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resp = await res.json();
        return resp.visit;
      }
    } catch (e) {
      console.warn('Visit API error:', e);
    }

    const current = getStored('visits', INITIAL_VISITS);
    const newV: VisitRequest = {
      id: `vis-${Date.now()}`,
      referenceNumber: `PBH-VIS-${Math.floor(100 + Math.random() * 900)}`,
      fullName: data.fullName,
      phone: data.phone,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      roomPreference: data.roomPreference,
      userType: data.userType,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      notes: 'Visitor registered online.',
    };
    setStored('visits', [newV, ...current]);
    return newV;
  },

  async updateVisitStatus(id: string, status: string, notes?: string): Promise<VisitRequest> {
    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Update visit error:', e);
    }

    const current = getStored('visits', INITIAL_VISITS);
    const updated = current.map((v) => (v.id === id ? { ...v, status: status as any, notes: notes ?? v.notes } : v));
    setStored('visits', updated);
    return updated.find((v) => v.id === id)!;
  },

  // ------------------------------------
  // COMPLAINTS (CONFIDENTIAL & PROTECTED)
  // ------------------------------------
  async submitComplaint(data: any): Promise<{ complaintId: string; trackingPin: string }> {
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resp = await res.json();
        return { complaintId: resp.complaintId, trackingPin: resp.trackingPin };
      }
    } catch (e) {
      console.warn('Complaint submit error:', e);
    }

    const current = getStored('complaints', INITIAL_COMPLAINTS);
    const complaintId = `PBH-CMP-${Math.floor(100 + Math.random() * 900)}`;
    const trackingPin = String(Math.floor(1000 + Math.random() * 9000));
    const isCritical = data.priority === 'CRITICAL' || data.category === 'Safety' || data.category === 'Harassment';

    const newC: Complaint = {
      id: `cmp-${Date.now()}`,
      complaintId,
      trackingPin,
      category: data.category,
      priority: isCritical ? 'CRITICAL' : data.priority || 'NORMAL',
      description: data.description,
      roomNumber: data.roomNumber,
      isConfidential: Boolean(data.isConfidential),
      complainantName: data.isConfidential ? '[Confidential Resident]' : (data.complainantName || 'Resident'),
      complainantPhone: data.isConfidential ? '***-PROTECTED' : (data.complainantPhone || ''),
      complainantEmail: data.isConfidential ? '***-PROTECTED' : (data.complainantEmail || ''),
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminResolutionNotes: 'Received into secure incident logging queue.',
      isCriticalSafety: isCritical,
    };
    setStored('complaints', [newC, ...current]);
    return { complaintId, trackingPin };
  },

  async trackComplaint(complaintId: string, pin?: string): Promise<any> {
    try {
      const url = `/api/complaints/track/${encodeURIComponent(complaintId)}${pin ? `?pin=${encodeURIComponent(pin)}` : ''}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Complaint tracking error:', e);
    }

    const current = getStored('complaints', INITIAL_COMPLAINTS);
    const found = current.find((c) => c.complaintId.toLowerCase() === complaintId.toLowerCase());
    if (!found) throw new Error('Complaint ID not found.');
    return {
      complaintId: found.complaintId,
      category: found.category,
      priority: found.priority,
      status: found.status,
      roomNumber: found.roomNumber,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      adminResolutionNotes: found.adminResolutionNotes,
      isConfidential: found.isConfidential,
      isCriticalSafety: found.isCriticalSafety,
    };
  },

  async getComplaints(): Promise<Complaint[]> {
    try {
      const res = await fetch('/api/complaints', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStored('complaints', data);
        return data;
      }
    } catch (e) {
      console.warn('Fetch complaints error:', e);
    }
    return getStored('complaints', INITIAL_COMPLAINTS);
  },

  async revealConfidentialIdentity(complaintId: string, accessReason: string): Promise<any> {
    const res = await fetch(`/api/complaints/${complaintId}/reveal-identity`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ accessReason }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to reveal confidential identity. Audit check failed.');
    }
    return await res.json();
  },

  async updateComplaintStatus(id: string, status: string, adminResolutionNotes?: string, priority?: string): Promise<Complaint> {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, adminResolutionNotes, priority }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Update complaint status error:', e);
    }

    const current = getStored('complaints', INITIAL_COMPLAINTS);
    const updated = current.map((c) =>
      c.id === id
        ? {
            ...c,
            status: status as any,
            adminResolutionNotes: adminResolutionNotes ?? c.adminResolutionNotes,
            priority: (priority as any) ?? c.priority,
            updatedAt: new Date().toISOString(),
          }
        : c
    );
    setStored('complaints', updated);
    return updated.find((c) => c.id === id)!;
  },

  // ------------------------------------
  // FACILITIES, PRICING, SETTINGS, STATS
  // ------------------------------------
  async getFacilities(): Promise<Facility[]> {
    try {
      const res = await fetch('/api/facilities');
      if (res.ok) {
        const data = await res.json();
        setStored('facilities', data);
        return data;
      }
    } catch (e) {
      console.warn('Facilities fetch error:', e);
    }
    return getStored('facilities', INITIAL_FACILITIES);
  },

  async updateFacilities(facilities: Facility[]): Promise<Facility[]> {
    try {
      const res = await fetch('/api/facilities', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(facilities),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Update facilities error:', e);
    }
    setStored('facilities', facilities);
    return facilities;
  },

  async getGallery(): Promise<GalleryItem[]> {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setStored('gallery', data);
        return data;
      }
    } catch (e) {
      console.warn('Gallery fetch error:', e);
    }
    return getStored('gallery', INITIAL_GALLERY);
  },

  async addGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Add gallery item error:', e);
    }

    const current = getStored('gallery', INITIAL_GALLERY);
    const newG: GalleryItem = {
      id: `g-${Date.now()}`,
      title: item.title || 'Hostel View',
      category: item.category || 'ROOMS',
      imageUrl: item.imageUrl || '',
      caption: item.caption || '',
    };
    setStored('gallery', [newG, ...current]);
    return newG;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Delete gallery error:', e);
    }
    const current = getStored('gallery', INITIAL_GALLERY);
    setStored('gallery', current.filter((g) => g.id !== id));
    return true;
  },

  async getSettings(): Promise<HostelSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setStored('settings', data);
        return data;
      }
    } catch (e) {
      console.warn('Settings fetch error:', e);
    }
    return getStored('settings', INITIAL_SETTINGS);
  },

  async updateSettings(settings: HostelSettings): Promise<HostelSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Settings update error:', e);
    }
    setStored('settings', settings);
    return settings;
  },

  async getStats(): Promise<any> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Stats fetch error:', e);
    }
    // Calculate locally
    const rooms = getStored('rooms', INITIAL_ROOMS);
    const bookings = getStored('bookings', INITIAL_BOOKINGS);
    const visits = getStored('visits', INITIAL_VISITS);
    const complaints = getStored('complaints', INITIAL_COMPLAINTS);
    const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE' || r.status === 'ALMOST_FULL').length;
    const occupiedRooms = rooms.filter((r) => r.status === 'FULL').length;
    const totalSeats = rooms.reduce((acc, r) => acc + r.capacity, 0);
    const availableBeds = rooms.reduce((acc, r) => acc + (r.availableBeds || 0), 0);

    return {
      totalRooms: rooms.length,
      availableRooms,
      occupiedRooms,
      maintenanceRooms: rooms.filter((r) => r.status === 'MAINTENANCE').length,
      totalSeats,
      availableBeds,
      occupiedBeds: totalSeats - availableBeds,
      pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
      approvedBookings: bookings.filter((b) => b.status === 'APPROVED').length,
      pendingVisits: visits.filter((v) => v.status === 'PENDING').length,
      pendingComplaints: complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length,
      criticalComplaints: complaints.filter(
        (c) => (c.status !== 'RESOLVED' && c.status !== 'CLOSED') && (c.priority === 'CRITICAL' || c.isCriticalSafety)
      ).length,
      studentsCount: bookings.filter((b) => b.status === 'APPROVED' && b.userType === 'Student').length,
      professionalsCount: bookings.filter((b) => b.status === 'APPROVED' && b.userType === 'Working Professional').length,
    };
  },

  async getLogs(): Promise<{ activityLogs: ActivityLog[]; complaintAccessLogs: ComplaintAccessLog[] }> {
    try {
      const res = await fetch('/api/logs', { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Logs fetch error:', e);
    }
    return { activityLogs: [], complaintAccessLogs: [] };
  },
};
