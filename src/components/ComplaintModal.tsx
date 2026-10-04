import React, { useState } from 'react';
import { ComplaintCategory, ComplaintPriority, HostelSettings } from '../types';
import {
  X,
  AlertTriangle,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Phone,
  EyeOff,
  Info,
} from 'lucide-react';
import { api } from '../services/api';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: HostelSettings;
  onOpenTracker: (complaintId?: string) => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOpenTracker,
}) => {
  const [category, setCategory] = useState<ComplaintCategory>('Room');
  const [priority, setPriority] = useState<ComplaintPriority>('NORMAL');
  const [roomNumber, setRoomNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isConfidential, setIsConfidential] = useState(true); // Default to confidential for privacy protection!
  const [complainantName, setComplainantName] = useState('');
  const [complainantPhone, setComplainantPhone] = useState('');
  const [complainantEmail, setComplainantEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState<{
    complaintId: string;
    trackingPin: string;
    isConfidential: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const categories: ComplaintCategory[] = [
    'Security',
    'Room',
    'Cleanliness',
    'Electricity',
    'Wi-Fi',
    'Staff',
    'Management',
    'Harassment',
    'Safety',
    'Other',
  ];

  const isSafetyConcern =
    category === 'Safety' || category === 'Harassment' || category === 'Security';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!description.trim()) {
      setErrorMsg('Please enter details of the complaint or issue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await api.submitComplaint({
        category,
        priority: isSafetyConcern ? 'CRITICAL' : priority,
        description,
        roomNumber: roomNumber || undefined,
        isConfidential,
        complainantName: complainantName || undefined,
        complainantPhone: complainantPhone || undefined,
        complainantEmail: complainantEmail || undefined,
      });

      setSubmittedData({
        complaintId: resp.complaintId,
        trackingPin: resp.trackingPin,
        isConfidential,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRef = () => {
    if (submittedData?.complaintId) {
      navigator.clipboard.writeText(
        `ID: ${submittedData.complaintId} | PIN: ${submittedData.trackingPin}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedData ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="bg-amber-100 text-[#7a0b1f] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              {submittedData.isConfidential ? 'CONFIDENTIAL COMPLAINT FILED' : 'COMPLAINT REGISTERED'}
            </span>

            <h3 className="text-2xl font-black text-stone-900 font-serif mt-2">
              Complaint Logged Securely
            </h3>

            <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              {submittedData.isConfidential
                ? 'Your personal identity is strictly shielded from general hostel staff. Save your Complaint ID & PIN below to check status updates privately.'
                : 'Your complaint has been submitted to management. You can track progress with the ID below.'}
            </p>

            {/* Credentials Card */}
            <div className="my-6 bg-stone-900 text-white rounded-2xl p-4 border border-stone-800 max-w-sm mx-auto flex items-center justify-between text-left">
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Complaint Tracking Credentials
                </div>
                <div className="text-lg font-black tracking-wide text-white mt-0.5">
                  {submittedData.complaintId}
                </div>
                <div className="text-xs text-stone-300">
                  Secret PIN: <span className="font-mono text-amber-300 font-bold">{submittedData.trackingPin}</span>
                </div>
              </div>
              <button
                onClick={copyRef}
                className="p-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg shadow"
                title="Copy Credentials"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenTracker(submittedData.complaintId);
                }}
                className="flex-1 bg-[#800d1e] hover:bg-[#991b1b] text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider"
              >
                Track This Complaint Now
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#800d1e] text-white flex items-center justify-center font-bold">
                <Lock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
                  Submit a Complaint / Report Issue
                </h3>
                <p className="text-xs text-stone-500">
                  Confidential & Protected Grievance Reporting System
                </p>
              </div>
            </div>

            {/* Emergency Notice Banner */}
            <div className="bg-rose-50 border-l-4 border-rose-600 p-3 rounded-r-xl my-4 text-xs text-rose-950 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Emergency Notice:</strong> For immediate physical danger, medical crisis, or severe safety threats, please immediately dial{' '}
                <strong className="underline">Rescue 1122</strong> or{' '}
                <strong className="underline">Police 15</strong>.
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Complaint Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c} {c === 'Safety' || c === 'Harassment' ? '(Urgent Priority)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority & Room Number */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical / Urgent Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Room Number (If Applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B-04 or U-10"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Description of the Issue *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what occurred, location within hostel, time, or equipment affected..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                />
              </div>

              {/* CRITICAL PRIVACY TOGGLE */}
              <div className="bg-amber-50/70 border border-amber-300/80 rounded-2xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#800d1e] rounded focus:ring-[#800d1e]"
                  />
                  <div>
                    <span className="text-xs font-black text-[#800d1e] flex items-center gap-1.5 uppercase tracking-wide">
                      <EyeOff className="w-3.5 h-3.5 text-[#800d1e]" />
                      Submit Confidentially / Protect My Identity
                    </span>
                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                      <strong>Privacy Rule:</strong> When checked, your name, phone, and contact details will NEVER be disclosed to hostel wardens, staff members, or implicated persons. Only high-level administration can review it under logged audit rules.
                    </p>
                  </div>
                </label>

                {/* Optional contact info */}
                <div className="mt-4 pt-3 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Your Name ({isConfidential ? 'Protected' : 'Optional'})
                    </label>
                    <input
                      type="text"
                      placeholder="Optional or Anonymous"
                      value={complainantName}
                      onChange={(e) => setComplainantName(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Your Phone / Contact ({isConfidential ? 'Protected' : 'Optional'})
                    </label>
                    <input
                      type="tel"
                      placeholder="0300-XXXXXXX"
                      value={complainantPhone}
                      onChange={(e) => setComplainantPhone(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-black py-3.5 px-6 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>
                    {isSubmitting ? 'Registering...' : 'Submit Protected Complaint'}
                  </span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
