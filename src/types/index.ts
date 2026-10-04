export type RoomOccupancy = '1 Seater' | '2 Seater' | '3 Seater' | '4 Seater';

export type FloorType = 'Basement' | 'Upper Floor';

export type RoomStatus = 'AVAILABLE' | 'ALMOST_FULL' | 'FULL' | 'MAINTENANCE';

export interface Room {
  id: string;
  roomNumber: string; // e.g. "B-01" or "U-05"
  floor: FloorType;
  capacity: number; // 1, 2, 3, 4
  availableBeds: number;
  monthlyPrice: number | null; // 24000 for 1-seater, 6000 for 4-seater, null for contact
  priceDisplay?: string; // "Rs. 24,000/mo" or "Rs. 6,000/person" or "Contact for pricing"
  status: RoomStatus;
  hasBeds: boolean;
  hasMattress: boolean;
  hasAttachedBath: boolean;
  hasStudyDesk: boolean;
  hasWifi: boolean;
  hasSolarBackup: boolean;
  hasCupboard: boolean;
  image: string;
  description: string;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  referenceNumber: string; // PBH-BK-2026-XXXX
  fullName: string;
  fatherGuardianName: string;
  phone: string;
  email: string;
  cnic: string;
  userType: 'Student' | 'Working Professional';
  institutionOrWorkplace: string;
  preferredRoomType: RoomOccupancy;
  preferredFloor: FloorType | 'Any';
  preferredRoomNumber?: string;
  expectedMoveInDate: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  additionalMessage?: string;
  status: BookingStatus;
  createdAt: string;
  adminNotes?: string;
  assignedRoomId?: string;
}

export type VisitStatus = 'PENDING' | 'APPROVED' | 'RESCHEDULED' | 'REJECTED' | 'COMPLETED';

export interface VisitRequest {
  id: string;
  referenceNumber: string; // PBH-VIS-XXXX
  fullName: string;
  phone: string;
  preferredDate: string;
  preferredTime: 'Morning (10:00 AM - 1:00 PM)' | 'Afternoon (2:00 PM - 5:00 PM)' | 'Evening (5:00 PM - 8:00 PM)';
  roomPreference: RoomOccupancy | 'General Tour';
  userType: 'Student' | 'Working Professional';
  status: VisitStatus;
  notes?: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'Security'
  | 'Room'
  | 'Cleanliness'
  | 'Electricity'
  | 'Wi-Fi'
  | 'Staff'
  | 'Management'
  | 'Harassment'
  | 'Safety'
  | 'Other';

export type ComplaintPriority = 'NORMAL' | 'HIGH' | 'CRITICAL';

export type ComplaintStatus = 'NEW' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Complaint {
  id: string;
  complaintId: string; // e.g. PBH-CMP-1024
  trackingPin: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  description: string;
  roomNumber?: string;
  isConfidential: boolean; // Protects identity from unauthorized staff
  complainantName?: string;
  complainantPhone?: string;
  complainantEmail?: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  adminResolutionNotes?: string;
  isCriticalSafety: boolean;
}

export interface ComplaintAccessLog {
  id: string;
  complaintId: string;
  accessedByEmail: string;
  accessedByRole: 'SUPER_ADMIN' | 'HOSTEL_ADMIN' | 'STAFF';
  timestamp: string;
  accessReason: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  details: string;
  timestamp: string;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  isIncluded: boolean;
  statusText: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ROOMS' | 'STUDY AREA' | 'COMMON AREA' | 'DINING' | 'BUILDING' | 'HOSTEL ENVIRONMENT';
  imageUrl: string;
  caption: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'HOSTEL_ADMIN' | 'STAFF';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  token?: string;
}

export interface PricingConfig {
  oneSeaterPrice: number; // 24000
  fourSeaterPrice: number; // 6000
  twoSeaterNote: string; // "Contact for pricing"
  threeSeaterNote: string; // "Contact for pricing"
  securityDepositNote: string;
  utilityNote: string;
}

export interface EmergencySettings {
  policeEmergencyNumber: string; // "15"
  rescueNumber: string; // "1122"
  fireBrigadeNumber: string; // "16"
  ambulanceNumber: string; // "115"
  localPoliceStationName: string; // Configurable by admin e.g. "Pishtakhara / Tehkal Police Station, Peshawar"
  localPoliceStationPhone: string;
  hostelWardenPhone: string;
  hostelSecurityGuardPhone: string;
  districtLocationNote: string;
}

export interface HostelSettings {
  hostelName: string;
  tagline: string;
  address: string;
  city: string;
  province: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  visitingHours: string;
  officeHours: string;
  googleMapsEmbedUrl?: string;
  pricing: PricingConfig;
  emergency: EmergencySettings;
}
