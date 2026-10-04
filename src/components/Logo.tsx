import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'maroon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'maroon',
  size = 'md',
  showTagline = true,
}) => {
  const isDark = variant === 'dark';
  const isLight = variant === 'light';

  const titleColor = isLight ? 'text-white' : 'text-[#7a0b1f]';
  const subColor = isLight ? 'text-amber-300' : 'text-stone-900';
  const taglineColor = isLight ? 'text-stone-300' : 'text-stone-600';
  const iconColor = isLight ? '#fbbf24' : '#7a0b1f';
  const roofColor = isLight ? '#ffffff' : '#7a0b1f';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-18 h-18',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl md:text-3xl',
    xl: 'text-3xl md:text-4xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Custom Original Vector Emblem inspired by the reference: House + Bed + Palm Tree */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gable Roof */}
          <path
            d="M8 44L50 8L92 44"
            stroke={roofColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Roof Chimney Accent */}
          <path d="M22 28V16H30V35" stroke={roofColor} strokeWidth="4" strokeLinejoin="round" />

          {/* Palm Tree on Right */}
          <path
            d="M74 48C74 38 80 26 88 20M74 48C72 34 64 24 58 22M74 48C78 36 86 34 94 36M74 48C70 40 62 38 56 42"
            stroke="#15803d"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M74 48V78" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />

          {/* House Structure Frame */}
          <rect
            x="18"
            y="42"
            width="50"
            height="44"
            rx="4"
            stroke={iconColor}
            strokeWidth="5"
            fill={isLight ? '#7a0b1f' : '#ffffff'}
          />

          {/* Window in House Attic */}
          <rect x="38" y="22" width="10" height="10" rx="1.5" fill="#f59e0b" />
          <path d="M43 22V32M38 27H48" stroke="#7a0b1f" strokeWidth="1.5" />

          {/* Comfortable Bed Inside */}
          {/* Headboard */}
          <path d="M24 72V58" stroke={iconColor} strokeWidth="4" strokeLinecap="round" />
          {/* Footboard */}
          <path d="M62 72V64" stroke={iconColor} strokeWidth="4" strokeLinecap="round" />
          {/* Mattress Base */}
          <path d="M24 67H62" stroke={iconColor} strokeWidth="5" strokeLinecap="round" />
          {/* Pillow */}
          <rect x="27" y="60" width="8" height="6" rx="2" fill="#f59e0b" />
          {/* Cozy Blanket Fold */}
          <rect x="36" y="63" width="24" height="4" rx="1" fill="#dc2626" />
          {/* Bed legs */}
          <path d="M26 72V76M60 72V76" stroke={iconColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight font-serif ${titleSizes[size]} ${titleColor}`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Paradise Hostel
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="h-[1.5px] w-4 bg-[#7a0b1f]/60" />
          <span
            className={`text-[10px] md:text-xs font-black uppercase tracking-[0.25em] ${subColor}`}
          >
            PESHAWAR
          </span>
          <span className="h-[1.5px] w-4 bg-[#7a0b1f]/60" />
        </div>
        {showTagline && (
          <p className={`text-[10px] mt-1 font-medium tracking-tight ${taglineColor}`}>
            Safe Stay • Comfortable Life • Bright Future
          </p>
        )}
      </div>
    </div>
  );
};
