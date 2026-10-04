import React, { useState } from 'react';
import { Room, FloorType, RoomStatus } from '../types';
import { CheckCircle2, ShieldAlert, Sparkles, Bed, Info } from 'lucide-react';

interface FloorPlanProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onReserveRoom: (room: Room) => void;
}

export const FloorPlanView: React.FC<FloorPlanProps> = ({
  rooms,
  onSelectRoom,
  onReserveRoom,
}) => {
  const [activeFloor, setActiveFloor] = useState<FloorType | 'ALL'>('ALL');

  const basementRooms = rooms.filter((r) => r.floor === 'Basement');
  const upperRooms = rooms.filter((r) => r.floor === 'Upper Floor');

  const filtered =
    activeFloor === 'ALL'
      ? rooms
      : activeFloor === 'Basement'
      ? basementRooms
      : upperRooms;

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800',
          dot: 'bg-emerald-500',
          text: 'AVAILABLE',
        };
      case 'ALMOST_FULL':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-800',
          dot: 'bg-amber-500',
          text: 'ALMOST FULL',
        };
      case 'FULL':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-800',
          dot: 'bg-rose-500',
          text: 'FULL',
        };
      case 'MAINTENANCE':
        return {
          bg: 'bg-stone-500/10 border-stone-500/30 text-stone-800',
          dot: 'bg-stone-400',
          text: 'MAINTENANCE',
        };
    }
  };

  return (
    <div className="bg-stone-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-stone-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Floor Layout</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-white">
            Floor & Room Availability Structure
          </h3>
          <p className="text-stone-400 text-xs md:text-sm mt-1">
            Real-time status of all <strong>28 Rooms</strong> (13 Basement + 15 Upper Floor).
            Managed directly by hostel administration.
          </p>
        </div>

        {/* Floor Filter Tabs */}
        <div className="flex items-center gap-2 bg-stone-800 p-1.5 rounded-xl border border-stone-700/80">
          <button
            onClick={() => setActiveFloor('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeFloor === 'ALL'
                ? 'bg-[#7a0b1f] text-white shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            All 28 Rooms
          </button>
          <button
            onClick={() => setActiveFloor('Basement')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeFloor === 'Basement'
                ? 'bg-[#7a0b1f] text-white shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Basement (13 Rooms)
          </button>
          <button
            onClick={() => setActiveFloor('Upper Floor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeFloor === 'Upper Floor'
                ? 'bg-[#7a0b1f] text-white shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Upper Floor (15 Rooms)
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 py-4 text-xs text-stone-400 border-b border-stone-800/80">
        <span className="font-semibold text-stone-300">Status Guide:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-stone-200">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-stone-200">Almost Full (1-2 beds left)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-stone-200">Full</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-500" />
          <span className="text-stone-200">Maintenance</span>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-6">
        {filtered.map((room) => {
          const badge = getStatusBadge(room.status);
          const isSelectable = room.status !== 'FULL' && room.status !== 'MAINTENANCE';

          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                room.status === 'FULL'
                  ? 'bg-stone-900/60 border-stone-800 opacity-70 hover:opacity-100'
                  : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700/80 hover:border-amber-400/80 shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-white group-hover:text-amber-300">
                  {room.roomNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black border ${badge.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  {badge.text}
                </span>
              </div>

              {/* Details */}
              <div className="my-2.5">
                <div className="text-[11px] text-stone-300 font-semibold">
                  {room.capacity === 1 ? '1 Seater' : `${room.capacity} Seater`}
                </div>
                <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                  <Bed className="w-3 h-3 text-amber-400" />
                  <span>
                    {room.availableBeds > 0
                      ? `${room.availableBeds} of ${room.capacity} bed(s) open`
                      : 'No beds open'}
                  </span>
                </div>
                <div className="text-[10px] text-amber-300/90 font-bold mt-1 truncate">
                  {room.priceDisplay}
                </div>
              </div>

              {/* Footer action */}
              <div className="pt-2 border-t border-stone-700/50 flex items-center justify-between text-[10px]">
                <span className="text-stone-400">{room.floor === 'Basement' ? 'Basement' : 'Upper'}</span>
                {isSelectable ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReserveRoom(room);
                    }}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Reserve &rarr;
                  </button>
                ) : (
                  <span className="text-stone-500 font-medium">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Beds and clean mattresses are provided for all rooms. Click any room card to view full amenities.
          </span>
        </div>
        <span className="text-stone-500">Live system status</span>
      </div>
    </div>
  );
};
