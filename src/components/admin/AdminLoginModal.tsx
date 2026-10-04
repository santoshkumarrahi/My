import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { AdminUser } from '../../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const user = await api.login(email.trim(), password.trim());
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#7a0b1f] text-white flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
              Staff & Admin Portal
            </h3>
            <p className="text-xs text-stone-500">
              Paradise Boys Hostel Management System
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="my-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 my-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Admin / Staff Email
            </label>
            <input
              type="email"
              required
              placeholder="e.g. superadmin@paradisehostel.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7a0b1f]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7a0b1f]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7a0b1f] hover:bg-[#991b1b] text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials Helper */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            Quick-Fill Role Credentials:
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('superadmin@paradisehostel.pk', 'Admin@2026')}
              className="w-full text-left p-2 rounded-lg bg-white border border-stone-200 hover:border-amber-400 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#7a0b1f] block text-[11px]">Super Admin (Full Access & Audits)</span>
                <span className="text-[10px] text-stone-500">superadmin@paradisehostel.pk</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">Fill &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('admin@paradisehostel.pk', 'Hostel@2026')}
              className="w-full text-left p-2 rounded-lg bg-white border border-stone-200 hover:border-amber-400 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-stone-800 block text-[11px]">Hostel Admin (Rooms, Bookings, Visits)</span>
                <span className="text-[10px] text-stone-500">admin@paradisehostel.pk</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">Fill &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('staff@paradisehostel.pk', 'Staff@2026')}
              className="w-full text-left p-2 rounded-lg bg-white border border-stone-200 hover:border-amber-400 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-stone-800 block text-[11px]">Duty Staff (Confidential Identity Protected)</span>
                <span className="text-[10px] text-stone-500">staff@paradisehostel.pk</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">Fill &rarr;</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
