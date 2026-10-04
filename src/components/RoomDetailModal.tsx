import React from 'react';
import { Room } from '../types';
import { X, Bed, ShieldCheck, Wifi, Sun, Sparkles, Check, Calendar, ArrowRight } from 'lucide-react';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onReserve: (room: Room) => void;
  onBookVisit: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  onReserve,
  onBookVisit,
}) => {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-amber-300 p-2 rounded-full bg-black/50 hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Room Header Photo */}
        <div className="relative h-60 w-full overflow-hidden bg-stone-900">
          <img
            src={room.image}
            alt={`Room ${room.roomNumber}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="text-xs font-black text-amber-400 uppercase tracking-widest">
                {room.floor} Wing
              </div>
              <h3 className="text-2xl font-black text-white font-serif">
                Room {room.roomNumber}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-300 uppercase block font-semibold">Monthly Rent</span>
              <span className="text-xl font-black text-amber-300">{room.priceDisplay}</span>
            </div>
          </div>
        </div>

        {/* Room Body */}
        <div className="p-6">
          
          {/* Status & Capacity */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-700">Occupancy:</span>
              <span className="bg-amber-100 text-[#7a0b1f] font-black px-2.5 py-0.5 rounded-full">
                {room.capacity === 1 ? '1 Seater (Private)' : `${room.capacity} Seater`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-stone-800">
                {room.availableBeds > 0 ? `${room.availableBeds} Bed(s) Available` : 'Fully Booked'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="my-4">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Room Overview
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Guaranteed Bedding Note */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 flex items-center gap-2 mb-4 font-semibold">
            <Sparkles className="w-4 h-4 text-[#800d1e] flex-shrink-0" />
            <span>Beds and comfortable quality mattresses are provided in this room.</span>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 mb-6 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Beds & Mattress Included</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>High-Speed Fiber Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Solar & UPS Power Backup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Attached Clean Bathroom</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Individual Study Desk & Chair</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personal Lockable Cupboard</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              disabled={room.status === 'FULL' || room.status === 'MAINTENANCE'}
              onClick={() => {
                onClose();
                onReserve(room);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                room.status === 'FULL' || room.status === 'MAINTENANCE'
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#800d1e] hover:bg-[#991b1b] text-white shadow-md'
              }`}
            >
              <Bed className="w-4 h-4 text-amber-300" />
              <span>Reserve Room {room.roomNumber}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onBookVisit();
              }}
              className="flex-1 bg-amber-100 hover:bg-amber-200 text-[#7a0b1f] border border-amber-300 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#7a0b1f]" />
              <span>Schedule Visit</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
