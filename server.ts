import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_ROOMS,
  INITIAL_FACILITIES,
  INITIAL_GALLERY,
  INITIAL_SETTINGS,
  INITIAL_BOOKINGS,
  INITIAL_VISITS,
  INITIAL_COMPLAINTS,
} from './src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBStructure {
  rooms: typeof INITIAL_ROOMS;
  facilities: typeof INITIAL_FACILITIES;
  gallery: typeof INITIAL_GALLERY;
  settings: typeof INITIAL_SETTINGS;
  bookings: typeof INITIAL_BOOKINGS;
  visits: typeof INITIAL_VISITS;
  complaints: typeof INITIAL_COMPLAINTS;
  complaintAccessLogs: Array<{
    id: string;
    complaintId: string;
    accessedByEmail: string;
    accessedByRole: string;
    timestamp: string;
    accessReason: string;
  }>;
  activityLogs: Array<{
    id: string;
    action: string;
    performedBy: string;
    role: string;
    details: string;
    timestamp: string;
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'HOSTEL_ADMIN' | 'STAFF';
    passwordHash: string; // Plain/SHA for demo verification
  }>;
}

function getInitialDB(): DBStructure {
  return {
    rooms: INITIAL_ROOMS,
    facilities: INITIAL_FACILITIES,
    gallery: INITIAL_GALLERY,
    settings: INITIAL_SETTINGS,
    bookings: INITIAL_BOOKINGS,
    visits: INITIAL_VISITS,
    complaints: INITIAL_COMPLAINTS,
    complaintAccessLogs: [
      {
        id: 'cal-1',
        complaintId: 'PBH-CMP-102',
        accessedByEmail: 'superadmin@paradisehostel.pk',
        accessedByRole: 'SUPER_ADMIN',
        timestamp: '2026-10-04T02:15:00Z',
        accessReason: 'Emergency verification of backside fire corridor security report',
      },
    ],
    activityLogs: [
      {
        id: 'act-1',
        action: 'System Bootstrapped',
        performedBy: 'System',
        role: 'SUPER_ADMIN',
        details: 'Initial database configured with 28 rooms (13 Basement, 15 Upper Floor).',
        timestamp: new Date().toISOString(),
      },
    ],
    users: [
      {
        id: 'usr-1',
        name: 'Chief Administrator (Super Admin)',
        email: 'superadmin@paradisehostel.pk',
        role: 'SUPER_ADMIN',
        passwordHash: 'Admin@2026',
      },
      {
        id: 'usr-2',
        name: 'Hostel Resident Manager',
        email: 'admin@paradisehostel.pk',
        role: 'HOSTEL_ADMIN',
        passwordHash: 'Hostel@2026',
      },
      {
        id: 'usr-3',
        name: 'Duty Desk Warden (Staff)',
        email: 'staff@paradisehostel.pk',
        role: 'STAFF',
        passwordHash: 'Staff@2026',
      },
    ],
  };
}

let db: DBStructure;

function loadDatabase(): DBStructure {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db file, falling back to initial seed:', err);
  }
  const initial = getInitialDB();
  saveDatabase(initial);
  return initial;
}

function saveDatabase(dataToSave: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db file:', err);
  }
}

db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Helper middleware for logging admin actions
  const logActivity = (action: string, performedBy: string, role: string, details: string) => {
    db.activityLogs.unshift({
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      performedBy,
      role,
      details,
      timestamp: new Date().toISOString(),
    });
    if (db.activityLogs.length > 200) {
      db.activityLogs = db.activityLogs.slice(0, 200);
    }
    saveDatabase(db);
  };

  // Helper auth token validation (Bearer or custom header)
  const getUserFromReq = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const email = authHeader.replace('Bearer ', '').trim();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  };

  // ----------------------------------------------------
  // AUTH ROUTES
  // ----------------------------------------------------
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.passwordHash === String(password)
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    logActivity('Admin Login', user.name, user.role, `Logged into management dashboard as ${user.role}`);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: user.email, // using verified session token
      },
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });

  // ----------------------------------------------------
  // STATS & DASHBOARD OVERVIEW
  // ----------------------------------------------------
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalRooms = db.rooms.length;
    const availableRooms = db.rooms.filter((r) => r.status === 'AVAILABLE' || r.status === 'ALMOST_FULL').length;
    const occupiedRooms = db.rooms.filter((r) => r.status === 'FULL').length;
    const maintenanceRooms = db.rooms.filter((r) => r.status === 'MAINTENANCE').length;
    const totalSeats = db.rooms.reduce((acc, r) => acc + r.capacity, 0);
    const availableBeds = db.rooms.reduce((acc, r) => acc + (r.availableBeds || 0), 0);
    const occupiedBeds = totalSeats - availableBeds;

    const pendingBookings = db.bookings.filter((b) => b.status === 'PENDING').length;
    const approvedBookings = db.bookings.filter((b) => b.status === 'APPROVED').length;
    const pendingVisits = db.visits.filter((v) => v.status === 'PENDING').length;
    const pendingComplaints = db.complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
    const criticalComplaints = db.complaints.filter(
      (c) => (c.status !== 'RESOLVED' && c.status !== 'CLOSED') && (c.priority === 'CRITICAL' || c.isCriticalSafety)
    ).length;

    const studentsCount = db.bookings.filter((b) => b.status === 'APPROVED' && b.userType === 'Student').length;
    const professionalsCount = db.bookings.filter(
      (b) => b.status === 'APPROVED' && b.userType === 'Working Professional'
    ).length;

    res.json({
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      totalSeats,
      availableBeds,
      occupiedBeds,
      pendingBookings,
      approvedBookings,
      pendingVisits,
      pendingComplaints,
      criticalComplaints,
      studentsCount,
      professionalsCount,
    });
  });

  // ----------------------------------------------------
  // ROOMS ROUTES
  // ----------------------------------------------------
  app.get('/api/rooms', (_req: Request, res: Response) => {
    res.json(db.rooms);
  });

  app.post('/api/rooms', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role === 'STAFF') {
      return res.status(403).json({ error: 'Permission denied. Admin role required.' });
    }

    const {
      roomNumber,
      floor,
      capacity,
      availableBeds,
      monthlyPrice,
      status,
      hasBeds,
      hasMattress,
      hasAttachedBath,
      hasStudyDesk,
      hasWifi,
      hasSolarBackup,
      hasCupboard,
      image,
      description,
    } = req.body;

    if (!roomNumber || !floor) {
      return res.status(400).json({ error: 'Room number and floor are required.' });
    }

    const newRoom = {
      id: `room-${Date.now()}`,
      roomNumber,
      floor,
      capacity: Number(capacity) || 1,
      availableBeds: Number(availableBeds) || 1,
      monthlyPrice: monthlyPrice ? Number(monthlyPrice) : null,
      priceDisplay:
        Number(capacity) === 1 && monthlyPrice
          ? `Rs. ${Number(monthlyPrice).toLocaleString()} / month`
          : Number(capacity) === 4 && monthlyPrice
          ? `Rs. ${Number(monthlyPrice).toLocaleString()} / person/month`
          : monthlyPrice
          ? `Rs. ${Number(monthlyPrice).toLocaleString()}`
          : 'Contact for pricing',
      status: status || 'AVAILABLE',
      hasBeds: Boolean(hasBeds ?? true),
      hasMattress: Boolean(hasMattress ?? true),
      hasAttachedBath: Boolean(hasAttachedBath ?? true),
      hasStudyDesk: Boolean(hasStudyDesk ?? true),
      hasWifi: Boolean(hasWifi ?? true),
      hasSolarBackup: Boolean(hasSolarBackup ?? true),
      hasCupboard: Boolean(hasCupboard ?? true),
      image: image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      description: description || 'Comfortable and clean room equipped with standard bedding and study facilities.',
    };

    db.rooms.push(newRoom);
    saveDatabase(db);
    logActivity('Room Added', user.name, user.role, `Added room ${roomNumber} on ${floor}`);

    res.status(201).json(newRoom);
  });

  app.put('/api/rooms/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role === 'STAFF') {
      return res.status(403).json({ error: 'Permission denied. Admin role required.' });
    }

    const { id } = req.params;
    const index = db.rooms.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const updated = {
      ...db.rooms[index],
      ...req.body,
    };

    // Recalculate price display if capacity or price changed
    if (updated.capacity === 1 && updated.monthlyPrice) {
      updated.priceDisplay = `Rs. ${Number(updated.monthlyPrice).toLocaleString()} / month`;
    } else if (updated.capacity === 4 && updated.monthlyPrice) {
      updated.priceDisplay = `Rs. ${Number(updated.monthlyPrice).toLocaleString()} / person/month`;
    } else if (!updated.monthlyPrice) {
      updated.priceDisplay = 'Contact for pricing';
    }

    db.rooms[index] = updated;
    saveDatabase(db);
    logActivity('Room Updated', user.name, user.role, `Updated details for room ${updated.roomNumber} (${updated.status})`);

    res.json(updated);
  });

  app.delete('/api/rooms/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Super Admin privileges required to delete rooms.' });
    }

    const { id } = req.params;
    const room = db.rooms.find((r) => r.id === id);
    db.rooms = db.rooms.filter((r) => r.id !== id);
    saveDatabase(db);

    if (room) {
      logActivity('Room Deleted', user.name, user.role, `Deleted room ${room.roomNumber}`);
    }

    res.json({ success: true, message: 'Room removed' });
  });

  // ----------------------------------------------------
  // BOOKINGS ROUTES
  // ----------------------------------------------------
  app.get('/api/bookings', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Admin access required to view bookings' });
    }
    res.json(db.bookings);
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const {
      fullName,
      fatherGuardianName,
      phone,
      email,
      cnic,
      userType,
      institutionOrWorkplace,
      preferredRoomType,
      preferredFloor,
      preferredRoomNumber,
      expectedMoveInDate,
      emergencyContact,
      additionalMessage,
    } = req.body;

    if (!fullName || !phone || !cnic || !userType || !expectedMoveInDate) {
      return res.status(400).json({ error: 'Please provide all mandatory booking fields.' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `PBH-BK-2026-${randomSuffix}`;

    const newBooking = {
      id: `bk-${Date.now()}`,
      referenceNumber,
      fullName: String(fullName).trim(),
      fatherGuardianName: String(fatherGuardianName || '').trim(),
      phone: String(phone).trim(),
      email: String(email || '').trim(),
      cnic: String(cnic).trim(),
      userType: (userType === 'Student' ? 'Student' : 'Working Professional') as 'Student' | 'Working Professional',
      institutionOrWorkplace: String(institutionOrWorkplace || '').trim(),
      preferredRoomType: preferredRoomType || '4 Seater',
      preferredFloor: preferredFloor || 'Any',
      preferredRoomNumber: preferredRoomNumber || undefined,
      expectedMoveInDate,
      emergencyContact: emergencyContact || {
        name: fatherGuardianName || 'Family Contact',
        relationship: 'Guardian',
        phone: phone,
      },
      additionalMessage: additionalMessage || '',
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
      adminNotes: 'Online booking request submitted. Awaiting physical verification by management.',
    };

    db.bookings.unshift(newBooking);
    saveDatabase(db);
    logActivity('New Booking Request', newBooking.fullName, 'Resident', `Submitted booking ${referenceNumber} (${newBooking.preferredRoomType})`);

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully.',
      booking: newBooking,
    });
  });

  app.put('/api/bookings/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const index = db.bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { status, adminNotes, assignedRoomId } = req.body;
    db.bookings[index] = {
      ...db.bookings[index],
      status: status || db.bookings[index].status,
      adminNotes: adminNotes !== undefined ? adminNotes : db.bookings[index].adminNotes,
      assignedRoomId: assignedRoomId || db.bookings[index].assignedRoomId,
    };

    // If booking was approved and room assigned, optionally update room capacity
    if (status === 'APPROVED' && assignedRoomId) {
      const roomIndex = db.rooms.findIndex((r) => r.id === assignedRoomId);
      if (roomIndex !== -1 && db.rooms[roomIndex].availableBeds > 0) {
        db.rooms[roomIndex].availableBeds = Math.max(0, db.rooms[roomIndex].availableBeds - 1);
        if (db.rooms[roomIndex].availableBeds === 0) {
          db.rooms[roomIndex].status = 'FULL';
        } else {
          db.rooms[roomIndex].status = 'ALMOST_FULL';
        }
      }
    }

    saveDatabase(db);
    logActivity('Booking Status Updated', user.name, user.role, `Updated booking ${db.bookings[index].referenceNumber} to ${status}`);

    res.json(db.bookings[index]);
  });

  // ----------------------------------------------------
  // VISIT REQUESTS ROUTES
  // ----------------------------------------------------
  app.get('/api/visits', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Admin access required' });
    }
    res.json(db.visits);
  });

  app.post('/api/visits', (req: Request, res: Response) => {
    const { fullName, phone, preferredDate, preferredTime, roomPreference, userType } = req.body;
    if (!fullName || !phone || !preferredDate) {
      return res.status(400).json({ error: 'Name, phone and preferred date are required.' });
    }

    const refNumber = `PBH-VIS-${Math.floor(100 + Math.random() * 900)}`;
    const newVisit = {
      id: `vis-${Date.now()}`,
      referenceNumber: refNumber,
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      preferredDate,
      preferredTime: preferredTime || 'Morning (10:00 AM - 1:00 PM)',
      roomPreference: roomPreference || 'General Tour',
      userType: (userType === 'Student' ? 'Student' : 'Working Professional') as 'Student' | 'Working Professional',
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
      notes: 'Visitor registered online. Warden notified for tour assistance.',
    };

    db.visits.unshift(newVisit);
    saveDatabase(db);
    logActivity('Visit Request Received', newVisit.fullName, 'Visitor', `Scheduled visit for ${preferredDate}`);

    res.status(201).json({
      success: true,
      message: 'Visit scheduled successfully',
      visit: newVisit,
    });
  });

  app.put('/api/visits/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const index = db.visits.findIndex((v) => v.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    db.visits[index] = {
      ...db.visits[index],
      ...req.body,
    };

    saveDatabase(db);
    logActivity('Visit Updated', user.name, user.role, `Visit ${db.visits[index].referenceNumber} set to ${db.visits[index].status}`);

    res.json(db.visits[index]);
  });

  // ----------------------------------------------------
  // COMPLAINT SYSTEM (CRITICAL PRIVACY & SECURITY)
  // ----------------------------------------------------
  app.post('/api/complaints', (req: Request, res: Response) => {
    const {
      category,
      priority,
      description,
      roomNumber,
      isConfidential,
      complainantName,
      complainantPhone,
      complainantEmail,
    } = req.body;

    if (!category || !description) {
      return res.status(400).json({ error: 'Category and description are required.' });
    }

    const cid = `PBH-CMP-${Math.floor(100 + Math.random() * 900)}`;
    const trackingPin = String(Math.floor(1000 + Math.random() * 9000));
    const isCritical = priority === 'CRITICAL' || category === 'Safety' || category === 'Harassment';

    const newComplaint = {
      id: `cmp-${Date.now()}`,
      complaintId: cid,
      trackingPin,
      category,
      priority: isCritical ? 'CRITICAL' : priority || 'NORMAL',
      description: String(description).trim(),
      roomNumber: roomNumber ? String(roomNumber).trim() : undefined,
      isConfidential: Boolean(isConfidential),
      complainantName: complainantName ? String(complainantName).trim() : 'Anonymous Resident',
      complainantPhone: complainantPhone ? String(complainantPhone).trim() : '',
      complainantEmail: complainantEmail ? String(complainantEmail).trim() : '',
      status: 'NEW' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminResolutionNotes: 'Received into secure incident logging queue.',
      isCriticalSafety: isCritical,
    };

    db.complaints.unshift(newComplaint);
    saveDatabase(db);

    logActivity(
      isCritical ? 'CRITICAL SAFETY COMPLAINT' : 'Complaint Submitted',
      newComplaint.isConfidential ? '[Confidential Resident]' : newComplaint.complainantName,
      'Resident',
      `Filed complaint ${cid} under category ${category} (Confidential: ${newComplaint.isConfidential})`
    );

    res.status(201).json({
      success: true,
      message: 'Complaint submitted securely.',
      complaintId: cid,
      trackingPin,
      isConfidential: newComplaint.isConfidential,
      isCriticalSafety: newComplaint.isCriticalSafety,
    });
  });

  // Public status tracking by Complaint ID and Tracking Pin
  app.get('/api/complaints/track/:complaintId', (req: Request, res: Response) => {
    const { complaintId } = req.params;
    const { pin } = req.query;

    const complaint = db.complaints.find(
      (c) => c.complaintId.toLowerCase() === complaintId.toLowerCase()
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint ID not found in system.' });
    }

    if (pin && String(complaint.trackingPin) !== String(pin)) {
      return res.status(401).json({ error: 'Invalid tracking PIN for this complaint.' });
    }

    // Return public, privacy-safe status representation
    res.json({
      complaintId: complaint.complaintId,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      roomNumber: complaint.roomNumber,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      adminResolutionNotes: complaint.adminResolutionNotes,
      isConfidential: complaint.isConfidential,
      isCriticalSafety: complaint.isCriticalSafety,
    });
  });

  // Admin complaint list with strict role-based confidential protection
  app.get('/api/complaints', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Admin access required' });
    }

    // Role-based filtering:
    // If role is STAFF: Mask all confidential complainants' identities
    // If category is 'Staff' or 'Management', staff cannot see complainant identity
    const sanitizedComplaints = db.complaints.map((c) => {
      const isStaff = user.role === 'STAFF';
      const isCategoryConcerningStaff = c.category === 'Staff' || c.category === 'Management';

      if ((c.isConfidential && isStaff) || (isCategoryConcerningStaff && isStaff)) {
        return {
          ...c,
          complainantName: '[Confidential Resident - Identity Protected]',
          complainantPhone: '***-PROTECTED',
          complainantEmail: '***-PROTECTED',
          hasIdentityMasked: true,
        };
      }

      return {
        ...c,
        hasIdentityMasked: false,
      };
    });

    res.json(sanitizedComplaints);
  });

  // Audited reveal for Super Admin / Hostel Admin
  app.post('/api/complaints/:id/reveal-identity', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.role === 'STAFF') {
      return res.status(403).json({
        error: 'Security Policy Violation: Staff members are strictly prohibited from viewing confidential complainant identities.',
      });
    }

    const { id } = req.params;
    const { accessReason } = req.body;

    if (!accessReason || accessReason.length < 5) {
      return res.status(400).json({ error: 'A valid recorded safety/investigative reason is mandatory to inspect confidential identity.' });
    }

    const complaint = db.complaints.find((c) => c.id === id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Record audit log
    const auditEntry = {
      id: `cal-${Date.now()}`,
      complaintId: complaint.complaintId,
      accessedByEmail: user.email,
      accessedByRole: user.role,
      timestamp: new Date().toISOString(),
      accessReason: String(accessReason).trim(),
    };

    db.complaintAccessLogs.unshift(auditEntry);
    logActivity(
      'Confidential Complaint Identity Accessed',
      user.name,
      user.role,
      `Inspected identity for ${complaint.complaintId}. Reason: ${accessReason}`
    );
    saveDatabase(db);

    res.json({
      complaintId: complaint.complaintId,
      complainantName: complaint.complainantName,
      complainantPhone: complaint.complainantPhone,
      complainantEmail: complaint.complainantEmail,
      auditId: auditEntry.id,
    });
  });

  app.put('/api/complaints/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const index = db.complaints.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const { status, adminResolutionNotes, priority } = req.body;

    db.complaints[index] = {
      ...db.complaints[index],
      status: status || db.complaints[index].status,
      adminResolutionNotes:
        adminResolutionNotes !== undefined ? adminResolutionNotes : db.complaints[index].adminResolutionNotes,
      priority: priority || db.complaints[index].priority,
      updatedAt: new Date().toISOString(),
    };

    saveDatabase(db);
    logActivity('Complaint Status Updated', user.name, user.role, `Updated complaint ${db.complaints[index].complaintId} to ${status}`);

    res.json(db.complaints[index]);
  });

  // ----------------------------------------------------
  // FACILITIES, PRICING, SETTINGS, GALLERY
  // ----------------------------------------------------
  app.get('/api/facilities', (_req: Request, res: Response) => {
    res.json(db.facilities);
  });

  app.put('/api/facilities', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role === 'STAFF') {
      return res.status(403).json({ error: 'Admin permission required.' });
    }

    db.facilities = req.body;
    saveDatabase(db);
    logActivity('Facilities Updated', user.name, user.role, 'Updated hostel facilities list & status');
    res.json(db.facilities);
  });

  app.get('/api/gallery', (_req: Request, res: Response) => {
    res.json(db.gallery);
  });

  app.post('/api/gallery', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role === 'STAFF') {
      return res.status(403).json({ error: 'Admin permission required.' });
    }

    const { title, category, imageUrl, caption } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Title and image URL are required.' });
    }

    const newItem = {
      id: `g-${Date.now()}`,
      title,
      category: category || 'ROOMS',
      imageUrl,
      caption: caption || '',
    };

    db.gallery.unshift(newItem);
    saveDatabase(db);
    logActivity('Gallery Photo Added', user.name, user.role, `Added photo "${title}" to ${category}`);
    res.status(201).json(newItem);
  });

  app.delete('/api/gallery/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role === 'STAFF') {
      return res.status(403).json({ error: 'Admin permission required.' });
    }

    const { id } = req.params;
    db.gallery = db.gallery.filter((g) => g.id !== id);
    saveDatabase(db);
    logActivity('Gallery Photo Removed', user.name, user.role, `Deleted gallery item ${id}`);
    res.json({ success: true });
  });

  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json(db.settings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role === 'STAFF') {
      return res.status(403).json({ error: 'Admin permission required.' });
    }

    db.settings = {
      ...db.settings,
      ...req.body,
    };
    saveDatabase(db);
    logActivity('Settings Modified', user.name, user.role, 'Updated hostel contact/pricing/emergency configuration');
    res.json(db.settings);
  });

  app.get('/api/logs', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Admin access required' });
    }

    res.json({
      activityLogs: db.activityLogs,
      complaintAccessLogs: user.role === 'SUPER_ADMIN' ? db.complaintAccessLogs : [],
    });
  });

  // ----------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC ASSETS
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Paradise Boys Hostel Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
