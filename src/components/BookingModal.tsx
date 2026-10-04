import React, { useState } from 'react';
import { Room, FloorType, RoomOccupancy, Booking } from '../types';
import { X, CheckCircle2, Bed, Calendar, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  initialRoomType?: string;
  initialRoomNumber?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  initialRoomType = '4 Seater',
  initialRoomNumber = '',
}) => {
  const [fullName, setFullName] = useState('');
  const [fatherGuardianName, setFatherGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [userType, setUserType] = useState<'Student' | 'Working Professional'>('Student');
  const [institutionOrWorkplace, setInstitutionOrWorkplace] = useState('');
  const [preferredRoomType, setPreferredRoomType] = useState<RoomOccupancy>(
    (initialRoomType as RoomOccupancy) || '4 Seater'
  );
  const [preferredFloor, setPreferredFloor] = useState<FloorType | 'Any'>('Any');
  const [preferredRoomNumber, setPreferredRoomNumber] = useState(initialRoomNumber);
  const [expectedMoveInDate, setExpectedMoveInDate] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Filter available rooms matching floor & capacity
  const eligibleRooms = rooms.filter((r) => {
    if (r.status === 'FULL' || r.status === 'MAINTENANCE') return false;
    if (preferredFloor !== 'Any' && r.floor !== preferredFloor) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !phone || !cnic || !expectedMoveInDate) {
      setErrorMsg('Please fill out all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName,
        fatherGuardianName,
        phone,
        email,
        cnic,
        userType,
        institutionOrWorkplace,
        preferredRoomType,
        preferredFloor,
        preferredRoomNumber: preferredRoomNumber || undefined,
        expectedMoveInDate,
        emergencyContact: {
          name: emergencyName || fatherGuardianName || 'Family Member',
          relationship: emergencyRelation || 'Guardian',
          phone: emergencyPhone || phone,
        },
        additionalMessage,
      };

      const result = await api.createBooking(payload);
      setConfirmedBooking(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRef = () => {
    if (confirmedBooking?.referenceNumber) {
      navigator.clipboard.writeText(confirmedBooking.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation State */}
        {confirmedBooking ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-block bg-amber-100 text-[#7a0b1f] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Request Received (Status: PENDING)
            </div>

            <h3 className="text-2xl font-black text-stone-900 font-serif">
              Booking Request Submitted!
            </h3>

            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              Thank you, <strong>{confirmedBooking.fullName}</strong>. Your application has been logged for review by hostel management.
            </p>

            {/* Reference Number Card */}
            <div className="my-6 bg-stone-50 border border-stone-200 rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-500">
                  Your Booking Reference ID
                </div>
                <div className="text-lg font-black text-[#800d1e] tracking-wider">
                  {confirmedBooking.referenceNumber}
                </div>
              </div>
              <button
                onClick={copyRef}
                className="p-2 text-stone-500 hover:text-[#800d1e] bg-white border border-stone-200 rounded-lg shadow-sm"
                title="Copy Reference"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Important verification rule note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-left text-xs text-amber-900 max-w-md mx-auto mb-6 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Important Policy Notice:</strong> Physical room allocation is not automatically confirmed until the hostel administration verifies your CNIC/credentials and approves the request. Our office will contact you on <strong>{confirmedBooking.phone}</strong>.
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-extrabold py-3.5 px-6 rounded-xl shadow text-xs uppercase tracking-wider"
            >
              Done & Return to Website
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#800d1e] text-white flex items-center justify-center font-bold">
                <Bed className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
                  Reserve a Room / Seat
                </h3>
                <p className="text-xs text-stone-500">
                  Paradise Boys Hostel Peshawar — Admissions 2026
                </p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 mb-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#800d1e] flex-shrink-0" />
              <span>
                1 Seater: <strong>Rs. 24,000/mo</strong> | 4 Seater: <strong>Rs. 6,000/person/mo</strong>. Beds and mattresses provided.
              </span>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Profile Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">
                  I am applying as a: *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('Student')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                      userType === 'Student'
                        ? 'bg-[#800d1e] text-white border-[#800d1e] shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    University / College Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('Working Professional')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                      userType === 'Working Professional'
                        ? 'bg-[#800d1e] text-white border-[#800d1e] shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Job Holder / Working Professional
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Kashif"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Father / Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Khan"
                    value={fatherGuardianName}
                    onChange={(e) => setFatherGuardianName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    CNIC / B-Form Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="17301-XXXXXXX-X"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                  />
                </div>
              </div>

              {/* Institution or Workplace */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {userType === 'Student' ? 'University / College / Department' : 'Workplace / Company / Organization'}
                </label>
                <input
                  type="text"
                  placeholder={userType === 'Student' ? 'e.g. University of Peshawar (Computer Science)' : 'e.g. Software House / Govt Office'}
                  value={institutionOrWorkplace}
                  onChange={(e) => setInstitutionOrWorkplace(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                />
              </div>

              {/* Room Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Room Occupancy *
                  </label>
                  <select
                    value={preferredRoomType}
                    onChange={(e) => setPreferredRoomType(e.target.value as RoomOccupancy)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="1 Seater">1 Seater (Rs. 24,000/mo)</option>
                    <option value="2 Seater">2 Seater (Contact for pricing)</option>
                    <option value="3 Seater">3 Seater (Contact for pricing)</option>
                    <option value="4 Seater">4 Seater (Rs. 6,000/person/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Floor Preference
                  </label>
                  <select
                    value={preferredFloor}
                    onChange={(e) => setPreferredFloor(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Any">Any Available Floor</option>
                    <option value="Basement">Basement (13 Rooms)</option>
                    <option value="Upper Floor">Upper Floor (15 Rooms)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Specific Room (Optional)
                  </label>
                  <select
                    value={preferredRoomNumber}
                    onChange={(e) => setPreferredRoomNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="">No preference</option>
                    {eligibleRooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        {r.roomNumber} ({r.floor} - {r.availableBeds} beds)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Move-in Date & Emergency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Expected Move-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedMoveInDate}
                    onChange={(e) => setExpectedMoveInDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="Guardian or Brother"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="0300-XXXXXXX"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Additional Notes or Study Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Medical student needing quiet corner desk or specific shift hours..."
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-stone-300 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-black py-3.5 px-6 rounded-xl shadow-lg transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Bed className="w-4 h-4 text-amber-300" />
                      <span>Submit Booking Request (Status: Pending)</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-stone-500 text-center mt-2">
                  * By submitting, you agree to hostel verification policies. Room reservation is confirmed upon physical arrival and administration approval.
                </p>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
