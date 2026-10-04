import React from 'react';
import { X, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#800d1e] text-white flex items-center justify-center font-bold">
            <FileText className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
              Terms & Conditions
            </h3>
            <p className="text-xs text-stone-500">
              Paradise Boys Hostel Peshawar — Resident & Visitor Rules
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 max-h-[65vh] overflow-y-auto pr-2 leading-relaxed border-t border-stone-200 pt-4">
          <div>
            <h4 className="font-bold text-stone-900 mb-1">1. Booking Requests & Physical Confirmation</h4>
            <p className="text-stone-600">
              Online booking requests submitted via this platform are strictly subject to physical room and seat availability. Room allocation is confirmed exclusively by hostel management upon document verification, CNIC submission, and physical approval.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">2. Pricing & Fee Structure</h4>
            <p className="text-stone-600">
              Monthly rent (1 Seater: Rs. 24,000/month, 4 Seater: Rs. 6,000 per person/month) is payable in advance at the start of each calendar month. Management reserves the right to review and adjust tariffs with advance notice. Refundable security deposits apply upon enrollment.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">3. Resident Code of Conduct & Quiet Hours</h4>
            <p className="text-stone-600">
              Residents must respect quiet hours enforced from 10:30 PM to 6:00 AM daily to preserve an optimal study and resting environment. Loud music, unruly gatherings, or disturbance to neighbors are strictly prohibited.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">4. Furnishings & Damage Responsibility</h4>
            <p className="text-stone-600">
              Beds, mattresses, cupboards, and electrical fittings provided in rooms remain the property of the hostel. Any deliberate damage or negligence may result in repair or replacement charges charged to the responsible resident.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">5. Visitor & Guest Policies</h4>
            <p className="text-stone-600">
              All external visitors must produce official photo identification at the security reception desk. Unauthorized overnight stays by non-registered guests are strictly prohibited for hostel security.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">6. Official Grievances & Confidentiality</h4>
            <p className="text-stone-600">
              Complaints should be submitted through the official complaint tracking system. The privacy and identity of complainants choosing confidential filing will remain protected against unauthorized staff access.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">7. Emergency Situations</h4>
            <p className="text-stone-600">
              Immediate life-safety hazards or medical emergencies must be reported without delay to public emergency rescue (1122), police (15), and the on-duty warden. Final accommodation agreements are governed under Pakistani law and local district ordinances in Peshawar.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
              Privacy Policy & Data Security
            </h3>
            <p className="text-xs text-stone-500">
              Paradise Boys Hostel Peshawar — Data Handling & Resident Protection
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 max-h-[65vh] overflow-y-auto pr-2 leading-relaxed border-t border-stone-200 pt-4">
          <div>
            <h4 className="font-bold text-stone-900 mb-1">1. Information We Collect</h4>
            <p className="text-stone-600">
              When you submit a room reservation, visit request, or contact message, we collect essential operational details: Full Name, Father/Guardian Name, Phone Number, Email, CNIC/ID, student or workplace affiliation, and emergency contacts.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">2. Strict Confidential Complaint Handling</h4>
            <p className="text-stone-600">
              When residents submit grievances with the &quot;Submit Confidentially&quot; flag enabled, the complainant&apos;s personal identification details are strictly locked. Standard hostel staff and wardens are barred from viewing this data. Only authorized senior administration can inspect credentials during verified safety investigations, and every access event is permanently audited in security logs.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">3. Non-Disclosure & Public Protection</h4>
            <p className="text-stone-600">
              We never sell, publicly display, or rent resident or complainant personal data. Complaint tracking is accessible via unique alphanumeric IDs and PIN codes without publishing names, phone numbers, or private notes.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-1">4. Data Retention & Verification</h4>
            <p className="text-stone-600">
              Resident records and CNIC verification files are preserved securely during the tenancy period for legal compliance and police guest registration rules under Khyber Pakhtunkhwa hostel regulations.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider"
          >
            Close Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};
