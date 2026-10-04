import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const categories = [
    'ALL',
    'ROOMS',
    'STUDY AREA',
    'COMMON AREA',
    'DINING',
    'BUILDING',
    'HOSTEL ENVIRONMENT',
  ];

  const filteredItems =
    selectedCategory === 'ALL'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleNext = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery-section" className="py-16 md:py-24 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-stone-800 px-3.5 py-1 rounded-full border border-stone-700">
            Hostel Visual Tour
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-serif mt-3">
            Paradise Boys Hostel Gallery
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base">
            Take a visual tour through our furnished bedrooms, study lounges, dining mess, and Peshawar premises.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-[#7a0b1f] shadow-lg font-black'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveImageIndex(idx)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer bg-stone-800 border border-stone-700/60 shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Category pill */}
              <div className="absolute top-3 left-3 bg-[#7a0b1f]/90 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider border border-amber-400/40">
                {item.category}
              </div>

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-amber-300" />
              </div>

              {/* Title & Caption */}
              <div className="absolute bottom-3 inset-x-3">
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5 font-normal">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && filteredItems[activeImageIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-3 rounded-full bg-stone-800/80 hover:bg-stone-700 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-3 rounded-full bg-stone-800/80 hover:bg-stone-700 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="relative max-h-[75vh] w-auto overflow-hidden rounded-2xl border border-stone-800 shadow-2xl">
              <img
                src={filteredItems[activeImageIndex].imageUrl}
                alt={filteredItems[activeImageIndex].title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="mt-4 text-center max-w-xl">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                {filteredItems[activeImageIndex].category}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                {filteredItems[activeImageIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                {filteredItems[activeImageIndex].caption}
              </p>
              <div className="text-[11px] text-stone-500 mt-2">
                Image {activeImageIndex + 1} of {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
