import React, { useState } from 'react';
import { Room, FloorType, RoomOccupancy } from '../types';
import { Bed, ShieldCheck, Wifi, Sparkles, Check, ArrowRight, Eye, Calendar } from 'lucide-react';
import { FloorPlanView } from './FloorPlanView';

interface RoomsSectionProps {
  rooms: Room[];
  onOpenBooking: (roomType?: string, roomNumber?: string) => void;
  onOpenVisit: () => void;
  onViewRoomDetails: (room: Room) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  onOpenBooking,
  onOpenVisit,
  onViewRoomDetails,
}) => {
  const [floorFilter, setFloorFilter] = useState<'ALL' | FloorType>('ALL');
  const [capacityFilter, setCapacityFilter] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'floorplan'>('cards');

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    if (floorFilter !== 'ALL' && r.floor !== floorFilter) return false;
    if (capacityFilter !== 'ALL' && r.capacity !== capacityFilter) return false;
    return true;
  });

  const basementCount = rooms.filter((r) => r.floor === 'Basement').length;
  const upperCount = rooms.filter((r) => r.floor === 'Upper Floor').length;

  return (
    <section id="rooms-section" className="py-14 md:py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#800d1e]/10 text-[#800d1e] font-extrabold text-xs uppercase px-3 py-1.5 rounded-full mb-3 tracking-wider">
            <Bed className="w-3.5 h-3.5" />
            <span>Official Accommodations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight font-serif">
            Premium Hostel Accommodations
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base md:text-lg font-medium">
            Comfortable Rooms Designed for Students & Working Professionals
          </p>

          {/* Guaranteed Bedding & Official Room Count Notice */}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 bg-amber-50 border border-amber-300/80 rounded-xl px-4 py-2.5 text-xs text-amber-950 font-semibold shadow-sm">
            <span className="flex items-center gap-1.5 text-[#800d1e] font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Beds and mattresses are available in all rooms.
            </span>
            <span className="hidden sm:inline text-amber-300">•</span>
            <span>
              Total: <strong>28 Rooms</strong> (Basement: {basementCount} Rooms | Upper Floor: {upperCount} Rooms)
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Floor Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-xs font-bold text-stone-500 uppercase mr-1">Floor:</span>
            <button
              onClick={() => setFloorFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                floorFilter === 'ALL'
                  ? 'bg-[#800d1e] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Floors ({rooms.length})
            </button>
            <button
              onClick={() => setFloorFilter('Basement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                floorFilter === 'Basement'
                  ? 'bg-[#800d1e] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Basement ({basementCount})
            </button>
            <button
              onClick={() => setFloorFilter('Upper Floor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                floorFilter === 'Upper Floor'
                  ? 'bg-[#800d1e] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Upper Floor ({upperCount})
            </button>
          </div>

          {/* Occupancy Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-xs font-bold text-stone-500 uppercase mr-1">Occupancy:</span>
            {(['ALL', 1, 2, 3, 4] as const).map((cap) => (
              <button
                key={cap}
                onClick={() => setCapacityFilter(cap)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  capacityFilter === cap
                    ? 'bg-amber-400 text-[#7a0b1f] shadow-sm font-black'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cap === 'ALL' ? 'All' : `${cap} Seater`}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full lg:w-auto justify-end">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('floorplan')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                viewMode === 'floorplan'
                  ? 'bg-[#800d1e] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Floor Matrix
            </button>
          </div>
        </div>

        {/* View mode toggle */}
        {viewMode === 'floorplan' ? (
          <FloorPlanView
            rooms={rooms}
            onSelectRoom={onViewRoomDetails}
            onReserveRoom={(room) => onOpenBooking(room.capacity === 1 ? '1 Seater' : `${room.capacity} Seater`, room.roomNumber)}
          />
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRooms.map((room) => {
              const isAvailable = room.status === 'AVAILABLE';
              const isAlmostFull = room.status === 'ALMOST_FULL';
              const isFull = room.status === 'FULL';
              const isMaintenance = room.status === 'MAINTENANCE';

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200 flex flex-col group"
                >
                  {/* Image & Badges */}
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-stone-100">
                    <img
                      src={room.image}
                      alt={`Paradise Hostel Room ${room.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Room Number & Floor Tag */}
                    <div className="absolute top-3 left-3 bg-[#800d1e] text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md tracking-wider flex items-center gap-1.5">
                      <span>Room {room.roomNumber}</span>
                      <span className="text-amber-300 text-[10px]">({room.floor})</span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {isAvailable && (
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          Available
                        </span>
                      )}
                      {isAlmostFull && (
                        <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          Almost Full ({room.availableBeds} left)
                        </span>
                      )}
                      {isFull && (
                        <span className="bg-rose-700 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          Full
                        </span>
                      )}
                      {isMaintenance && (
                        <span className="bg-stone-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          Maintenance
                        </span>
                      )}
                    </div>

                    {/* Capacity pill */}
                    <div className="absolute bottom-3 left-3 bg-stone-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-amber-400" />
                      <span>{room.capacity === 1 ? '1 Seater (Private)' : `${room.capacity} Seater (Shared)`}</span>
                    </div>

                    {/* Bed Count */}
                    <div className="absolute bottom-3 right-3 text-white text-xs font-semibold drop-shadow-md">
                      {room.availableBeds > 0 ? `${room.availableBeds} Bed(s) Available` : 'Fully Occupied'}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price Section */}
                      <div className="flex items-baseline justify-between mb-3 border-b border-stone-100 pb-3">
                        <div>
                          <div className="text-xs text-stone-500 font-semibold uppercase">
                            Monthly Rent
                          </div>
                          <div className="text-xl sm:text-2xl font-black text-[#800d1e]">
                            {room.priceDisplay}
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          Furnished
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                        {room.description}
                      </p>

                      {/* Confirmed Amenities List */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Bed & Mattress</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>High-Speed Wi-Fi</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Solar Backup</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Attached / Clean Bath</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Study Desk & Chair</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Regular Cleaning</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {/* Reserve Seat */}
                        <button
                          disabled={isFull || isMaintenance}
                          onClick={() =>
                            onOpenBooking(
                              room.capacity === 1 ? '1 Seater' : `${room.capacity} Seater`,
                              room.roomNumber
                            )
                          }
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                            isFull || isMaintenance
                              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-[#800d1e] hover:bg-[#991b1b] text-white shadow hover:shadow-md'
                          }`}
                        >
                          <Bed className="w-3.5 h-3.5" />
                          <span>Reserve Seat</span>
                        </button>

                        {/* Book a visit */}
                        <button
                          onClick={onOpenVisit}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-100 hover:bg-amber-200 text-[#7a0b1f] border border-amber-300 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Visit</span>
                        </button>
                      </div>

                      {/* Inspect full details */}
                      <button
                        onClick={() => onViewRoomDetails(room)}
                        className="w-full text-center text-[11px] font-bold text-stone-500 hover:text-[#800d1e] py-1 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Room Specs & Policies</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
