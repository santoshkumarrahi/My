import React, { useState } from 'react';
import { VisitRequest, RoomOccupancy } from '../types';
import { X, Calendar, CheckCircle2, Copy, Check, Clock, User, Phone } from 'lucide-react';
import { api } from '../services/api';

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitModal: React.FC<VisitModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState<
    'Morning (10:00 AM - 1:00 PM)' | 'Afternoon (2:00 PM - 5:00 PM)' | 'Evening (5:00 PM - 8:00 PM)'
  >('Morning (10:00 AM - 1:00 PM)');
  const [roomPreference, setRoomPreference] = useState<RoomOccupancy | 'General Tour'>('General Tour');
  const [userType, setUserType] = useState<'Student' | 'Working Professional'>('Student');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedVisit, setConfirmedVisit] = useState<VisitRequest | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !phone || !preferredDate) {
      setErrorMsg('Please enter your name, phone number, and preferred date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.createVisit({
        fullName,
        phone,
        preferredDate,
        preferredTime,
        roomPreference,
        userType,
      });
      setConfirmedVisit(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule visit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRef = () => {
    if (confirmedVisit?.referenceNumber) {
      navigator.clipboard.writeText(confirmedVisit.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedVisit ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="bg-amber-100 text-[#7a0b1f] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Visit Request Scheduled
            </span>

            <h3 className="text-2xl font-black text-stone-900 font-serif mt-2">
              We Look Forward to Welcoming You!
            </h3>

            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              Dear <strong>{confirmedVisit.fullName}</strong>, your visit request has been recorded for{' '}
              <strong>{confirmedVisit.preferredDate}</strong> ({confirmedVisit.preferredTime}).
            </p>

            <div className="my-5 bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-500">Visit Reference</div>
                <div className="text-lg font-black text-[#800d1e]">{confirmedVisit.referenceNumber}</div>
              </div>
              <button
                onClick={copyRef}
                className="p-2 text-stone-500 hover:text-[#800d1e] bg-white border border-stone-200 rounded-lg shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-6">
              Our hostel duty warden has been notified. Please bring your student or national ID upon arrival for entry registration.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-extrabold py-3.5 px-6 rounded-xl shadow text-xs uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-[#7a0b1f] flex items-center justify-center font-bold shadow-sm">
                <Calendar className="w-5 h-5 text-[#7a0b1f]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
                  Book a Hostel Visit
                </h3>
                <p className="text-xs text-stone-500">
                  Tour the rooms, check amenities & meet the warden in person
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Ullah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phone / WhatsApp Number *
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Room Preference
                  </label>
                  <select
                    value={roomPreference}
                    onChange={(e) => setRoomPreference(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="General Tour">General Tour</option>
                    <option value="1 Seater">1 Seater Room</option>
                    <option value="2 Seater">2 Seater Room</option>
                    <option value="3 Seater">3 Seater Room</option>
                    <option value="4 Seater">4 Seater Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Visitor Category
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-black py-3.5 px-6 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'Scheduling...' : 'Schedule My Visit'}</span>
                </button>
                <p className="text-[11px] text-stone-500 text-center mt-2">
                  Visiting hours: 10:00 AM – 8:00 PM daily. No charges for tour.
                </p>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
