import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface ComplaintTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialComplaintId?: string;
}

export const ComplaintTrackerModal: React.FC<ComplaintTrackerModalProps> = ({
  isOpen,
  onClose,
  initialComplaintId = '',
}) => {
  const [complaintId, setComplaintId] = useState(initialComplaintId);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResult(null);

    if (!complaintId.trim()) {
      setErrorMsg('Please enter your Complaint ID (e.g. PBH-CMP-101)');
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.trackComplaint(complaintId.trim(), pin.trim() || undefined);
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Complaint not found. Please double-check your ID.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">New (Queued)</span>;
      case 'UNDER_REVIEW':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">Under Review</span>;
      case 'IN_PROGRESS':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">In Progress</span>;
      case 'RESOLVED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">Resolved</span>;
      case 'CLOSED':
        return <span className="bg-stone-200 text-stone-700 text-xs font-bold px-2.5 py-1 rounded-full">Closed</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 text-xs font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#7a0b1f] flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-stone-900 font-serif">
              Track Complaint Status
            </h3>
            <p className="text-xs text-stone-500">
              Check resolution progress anonymously & securely
            </p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="space-y-3 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Complaint ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PBH-CMP-101"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                PIN Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 9421"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
          >
            {isLoading ? 'Checking Record...' : 'Lookup Complaint'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 mb-4">
            {errorMsg}
          </div>
        )}

        {result && (
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Complaint ID</span>
                <div className="text-base font-black text-stone-900">{result.complaintId}</div>
              </div>
              <div>{getStatusBadge(result.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-stone-700">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Category</span>
                <span className="font-bold">{result.category}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Priority</span>
                <span className={`font-bold ${result.priority === 'CRITICAL' ? 'text-rose-600' : ''}`}>
                  {result.priority}
                </span>
              </div>
            </div>

            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Privacy Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                {result.isConfidential ? 'Protected Confidential Submission' : 'Standard Submission'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">
                Official Administration Resolution Notes
              </span>
              <p className="text-stone-800 font-medium leading-relaxed">
                {result.adminResolutionNotes || 'Issue received by duty warden and currently assigned for inspection.'}
              </p>
            </div>

            <div className="text-[10px] text-stone-400 text-right">
              Submitted: {new Date(result.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
