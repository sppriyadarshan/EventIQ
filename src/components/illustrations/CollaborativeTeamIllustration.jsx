import React from 'react';

/**
 * CollaborativeTeamIllustration Component
 * An editorial flat-vector SVG illustration depicting a diverse team of professionals/students
 * collaborating around a table with laptops, documents, and event analytics.
 * 
 * Styled specifically with EventIQ brand colors: Maroon (#6E1F2A), Ivory (#FFFDF8), 
 * Cream (#F7F1E8), Warm Gray (#756A68), Olive (#66745A), Ochre (#B68132), and skin tones.
 * 
 * Variants:
 * - 'default': Full color palette for light backgrounds (Homepage Hero)
 * - 'maroon-duotone': Translucent duotone palette for dark maroon backgrounds (Sign-In Panel)
 */
export const CollaborativeTeamIllustration = ({
  variant = 'default',
  className = '',
  alt = 'Illustration of a diverse group of students and professionals collaborating around a table with laptops and event planning documents.',
  ...props
}) => {
  const isDuotone = variant === 'maroon-duotone';

  // Palette assignment depending on variant
  const colors = isDuotone
    ? {
        // Duotone Maroon tints for dark background (#6E1F2A)
        bgGradientStart: 'rgba(232, 205, 208, 0.08)',
        bgGradientEnd: 'rgba(255, 253, 248, 0.02)',
        table: 'rgba(232, 205, 208, 0.12)',
        tableBorder: 'rgba(232, 205, 208, 0.25)',
        tableShadow: 'rgba(74, 20, 32, 0.3)',
        skin1: 'rgba(232, 205, 208, 0.75)',
        skin2: 'rgba(232, 205, 208, 0.65)',
        skin3: 'rgba(232, 205, 208, 0.85)',
        skin4: 'rgba(232, 205, 208, 0.7)',
        clothingMaroon: 'rgba(232, 205, 208, 0.35)',
        clothingLight: 'rgba(255, 253, 248, 0.5)',
        clothingOlive: 'rgba(232, 205, 208, 0.25)',
        clothingOchre: 'rgba(232, 205, 208, 0.3)',
        hairDark: 'rgba(232, 205, 208, 0.9)',
        hairBrown: 'rgba(232, 205, 208, 0.75)',
        laptopBody: 'rgba(255, 253, 248, 0.4)',
        laptopScreen: 'rgba(232, 205, 208, 0.2)',
        accentLine: 'rgba(255, 253, 248, 0.6)',
        badgeBg: 'rgba(232, 205, 208, 0.15)',
        badgeText: '#FFFDF8',
        badgeBorder: 'rgba(232, 205, 208, 0.3)',
        plantLeaf: 'rgba(232, 205, 208, 0.2)',
        plantPot: 'rgba(232, 205, 208, 0.3)',
        documentBg: 'rgba(255, 253, 248, 0.35)',
        coffeeCup: 'rgba(255, 253, 248, 0.5)',
      }
    : {
        // Full Brand Palette for light background
        bgGradientStart: '#F7F1E8',
        bgGradientEnd: '#FFFDF8',
        table: '#F2E8DC',
        tableBorder: '#E5D9CC',
        tableShadow: 'rgba(36, 25, 26, 0.06)',
        skin1: '#F5D6C6', // Light skin tone
        skin2: '#D49B7E', // Medium warm skin tone
        skin3: '#8D5545', // Deep skin tone
        skin4: '#FCE8D5', // Fair skin tone
        clothingMaroon: '#6E1F2A',
        clothingLight: '#FFFDF8',
        clothingOlive: '#66745A',
        clothingOchre: '#B68132',
        hairDark: '#24191A',
        hairBrown: '#4A1420',
        laptopBody: '#E5D9CC',
        laptopScreen: '#6E1F2A',
        accentLine: '#B68132',
        badgeBg: '#FFFDF8',
        badgeText: '#6E1F2A',
        badgeBorder: '#E5D9CC',
        plantLeaf: '#66745A',
        plantPot: '#B68132',
        documentBg: '#FFFDF8',
        coffeeCup: '#8E3A46',
      };

  return (
    <svg
      viewBox="0 0 800 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label={alt}
      {...props}
    >
      <defs>
        {/* Soft Backdrop Glow */}
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.bgGradientStart} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colors.bgGradientEnd} stopOpacity="0" />
        </radialGradient>

        {/* Laptop Screen Chart Gradient */}
        <linearGradient id="screenChartGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B68132" />
          <stop offset="100%" stopColor="#6E1F2A" />
        </linearGradient>

        {/* Floating Card Shadow */}
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#24191A" floodOpacity={isDuotone ? "0.15" : "0.08"} />
        </filter>
      </defs>

      {/* Background Subtle Backdrop Shapes */}
      <circle cx="400" cy="260" r="230" fill="url(#heroGlow)" />
      
      {/* Background Arch/Window Accent */}
      <path
        d="M240 400C240 230 310 120 400 120C490 120 560 230 560 400"
        fill={isDuotone ? "rgba(232,205,208,0.03)" : "rgba(110,31,42,0.03)"}
        stroke={isDuotone ? "rgba(232,205,208,0.08)" : "rgba(229,217,204,0.4)"}
        strokeWidth="2"
        strokeDasharray="6 6"
      />

      {/* Decorative Potted Plant (Left Side) */}
      <g id="plant">
        {/* Pot */}
        <path d="M90 380 L102 440 H138 L150 380 Z" fill={colors.plantPot} rx="4" />
        {/* Leaves */}
        <path d="M120 380 Q100 330 75 345 Q105 365 120 380 Z" fill={colors.plantLeaf} />
        <path d="M120 380 Q130 310 155 330 Q135 355 120 380 Z" fill={colors.plantLeaf} opacity="0.85" />
        <path d="M120 380 Q90 350 110 320 Q125 350 120 380 Z" fill={colors.plantLeaf} opacity="0.95" />
      </g>

      {/* Decorative Wall Frame / Board (Right Side) */}
      <g id="wall-board" filter="url(#softShadow)">
        <rect x="640" y="140" width="110" height="130" rx="12" fill={colors.badgeBg} stroke={colors.badgeBorder} strokeWidth="1.5" />
        <rect x="655" y="158" width="50" height="8" rx="4" fill={colors.clothingMaroon} opacity="0.7" />
        <rect x="655" y="174" width="80" height="6" rx="3" fill={colors.tableBorder} />
        <rect x="655" y="186" width="65" height="6" rx="3" fill={colors.tableBorder} />
        
        {/* Mini Pie / Progress Ring */}
        <circle cx="695" cy="225" r="18" stroke={colors.tableBorder} strokeWidth="5" fill="none" />
        <path d="M695 207 A18 18 0 0 1 713 225" stroke={colors.accentLine} strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>

      {/* MAIN MEETING TABLE */}
      <g id="table-group">
        {/* Table Shadow */}
        <ellipse cx="400" cy="425" rx="330" ry="45" fill={colors.tableShadow} />

        {/* Table Base / Legs */}
        <rect x="250" y="410" width="16" height="50" rx="4" fill={colors.tableBorder} />
        <rect x="534" y="410" width="16" height="50" rx="4" fill={colors.tableBorder} />
        <path d="M210 455 H590" stroke={colors.tableBorder} strokeWidth="6" strokeLinecap="round" />

        {/* Table Top Surface */}
        <ellipse cx="400" cy="405" rx="325" ry="40" fill={colors.table} stroke={colors.tableBorder} strokeWidth="3" />
        {/* Inner Table Bevel */}
        <ellipse cx="400" cy="403" rx="310" ry="34" fill="none" stroke={isDuotone ? "rgba(255,255,255,0.1)" : "#FFFDF8"} strokeWidth="2" opacity="0.6" />
      </g>

      {/* PEOPLE / TEAM MEMBERS */}

      {/* PERSON 1: Left - Woman with glasses & olive top working on laptop */}
      <g id="person-1">
        {/* Body / Torso */}
        <path d="M160 410 C160 340 180 300 215 300 C250 300 270 340 270 410 Z" fill={colors.clothingOlive} />
        {/* Neck */}
        <rect x="206" y="275" width="18" height="30" rx="9" fill={colors.skin1} />
        {/* Head */}
        <circle cx="215" cy="250" r="28" fill={colors.skin1} />
        {/* Hair - Stylish Bob */}
        <path d="M187 250 C185 210 245 210 243 250 C243 268 238 275 238 275 C238 275 230 250 215 250 C200 250 192 275 192 275 Z" fill={colors.hairDark} />
        {/* Glasses */}
        <circle cx="206" cy="250" r="7" stroke={colors.hairDark} strokeWidth="2" fill="none" />
        <circle cx="224" cy="250" r="7" stroke={colors.hairDark} strokeWidth="2" fill="none" />
        <line x1="213" y1="250" x2="217" y2="250" stroke={colors.hairDark} strokeWidth="2" />
        {/* Arm leaning towards laptop */}
        <path d="M180 340 Q220 365 240 395" stroke={colors.clothingOlive} strokeWidth="18" strokeLinecap="round" fill="none" />
        <circle cx="242" cy="396" r="8" fill={colors.skin1} />
      </g>

      {/* PERSON 2: Center-Left - Man with maroon sweater pointing to event schedule */}
      <g id="person-2">
        {/* Body */}
        <path d="M280 405 C280 325 305 285 345 285 C385 285 410 325 410 405 Z" fill={colors.clothingMaroon} />
        {/* Collar / Shirt Detail */}
        <path d="M333 285 L345 305 L357 285 Z" fill={colors.clothingLight} />
        {/* Neck */}
        <rect x="336" y="258" width="18" height="30" rx="9" fill={colors.skin2} />
        {/* Head */}
        <circle cx="345" cy="235" r="27" fill={colors.skin2} />
        {/* Hair - Short Crop */}
        <path d="M318 235 Q318 205 345 205 Q372 205 372 235 Q360 220 345 220 Q330 220 318 235 Z" fill={colors.hairBrown} />
        {/* Arm pointing forward */}
        <path d="M375 325 Q395 350 420 380" stroke={colors.clothingMaroon} strokeWidth="18" strokeLinecap="round" fill="none" />
        {/* Hand */}
        <circle cx="423" cy="382" r="8" fill={colors.skin2} />
      </g>

      {/* PERSON 3: Center-Right - Woman with cream top & hair bun, viewing main laptop */}
      <g id="person-3">
        {/* Body */}
        <path d="M420 405 C420 320 445 280 485 280 C525 280 550 320 550 405 Z" fill={colors.clothingLight} stroke={colors.tableBorder} strokeWidth="1" />
        {/* Neck */}
        <rect x="476" y="255" width="18" height="30" rx="9" fill={colors.skin3} />
        {/* Head */}
        <circle cx="485" cy="230" r="27" fill={colors.skin3} />
        {/* Hair Bun */}
        <circle cx="485" cy="194" r="14" fill={colors.hairDark} />
        <path d="M458 230 C458 202 512 202 512 230 C512 240 485 235 485 235 Z" fill={colors.hairDark} />
        {/* Arm reaching for coffee */}
        <path d="M440 325 Q465 355 490 385" stroke={colors.clothingLight} strokeWidth="18" strokeLinecap="round" fill="none" />
        <circle cx="493" cy="387" r="8" fill={colors.skin3} />
      </g>

      {/* PERSON 4: Right - Professional holding document/tablet */}
      <g id="person-4">
        {/* Body */}
        <path d="M540 410 C540 335 565 295 600 295 C635 295 660 335 660 410 Z" fill={colors.clothingOchre} />
        {/* Neck */}
        <rect x="591" y="270" width="18" height="30" rx="9" fill={colors.skin4} />
        {/* Head */}
        <circle cx="600" cy="245" r="27" fill={colors.skin4} />
        {/* Curly Hair outline */}
        <path d="M570 245 C565 205 635 205 630 245 C635 255 625 265 625 265 C625 265 600 240 570 245 Z" fill={colors.hairBrown} />
        {/* Arm holding sheet */}
        <path d="M565 340 Q545 365 530 390" stroke={colors.clothingOchre} strokeWidth="18" strokeLinecap="round" fill="none" />
        <circle cx="527" cy="392" r="8" fill={colors.skin4} />
      </g>

      {/* TABLE TOP ITEMS (Laptops, Charts, Documents, Coffee) */}

      {/* Laptop 1 (Left) */}
      <g id="laptop-left">
        {/* Screen Base */}
        <path d="M225 390 L265 390 L270 355 L220 355 Z" fill={colors.laptopBody} stroke={colors.tableBorder} strokeWidth="1" />
        <path d="M226 386 L264 386 L268 358 L222 358 Z" fill={colors.laptopScreen} />
        {/* Screen Code/Chart lines */}
        <line x1="230" y1="365" x2="250" y2="365" stroke={colors.accentLine} strokeWidth="2" strokeLinecap="round" />
        <line x1="230" y1="372" x2="260" y2="372" stroke={colors.clothingLight} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="230" y1="379" x2="245" y2="379" stroke={colors.clothingLight} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {/* Laptop Base/Keyboard */}
        <path d="M210 395 L280 395 L272 390 L218 390 Z" fill={colors.laptopBody} />
      </g>

      {/* EventIQ Central Dashboard Screen (Laptop 2 - Center) */}
      <g id="laptop-center" filter="url(#softShadow)">
        {/* Laptop Screen Standing Up */}
        <rect x="350" y="315" width="100" height="65" rx="6" fill={colors.badgeBg} stroke={colors.badgeBorder} strokeWidth="2" />
        {/* Display Screen */}
        <rect x="355" y="320" width="90" height="55" rx="4" fill={isDuotone ? "rgba(74,20,32,0.8)" : "#FFFDF8"} />
        
        {/* Mini UI Header */}
        <rect x="360" y="325" width="80" height="8" rx="2" fill={colors.clothingMaroon} opacity="0.85" />
        {/* Mini Bar Chart */}
        <rect x="362" y="355" width="8" height="15" rx="1.5" fill={colors.accentLine} />
        <rect x="374" y="345" width="8" height="25" rx="1.5" fill={colors.clothingMaroon} />
        <rect x="386" y="350" width="8" height="20" rx="1.5" fill={colors.clothingOlive} />
        <rect x="398" y="340" width="8" height="30" rx="1.5" fill={colors.clothingMaroon} />
        {/* Sparkline curve */}
        <path d="M412 360 Q422 340 432 348" stroke={colors.accentLine} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Base */}
        <path d="M335 390 L465 390 L455 382 L345 382 Z" fill={colors.laptopBody} stroke={colors.tableBorder} strokeWidth="1" />
      </g>

      {/* Document / Event Schedule Sheet (Center-Right) */}
      <g id="document-sheet">
        <rect x="495" y="380" width="45" height="28" rx="3" fill={colors.documentBg} stroke={colors.tableBorder} strokeWidth="1.5" transform="rotate(-8 517 394)" />
        <line x1="502" y1="386" x2="528" y2="382" stroke={colors.clothingMaroon} strokeWidth="2" strokeLinecap="round" />
        <line x1="504" y1="392" x2="532" y2="388" stroke={colors.tableBorder} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="505" y1="398" x2="525" y2="394" stroke={colors.tableBorder} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Coffee Mugs on Table */}
      <g id="coffee-mug-1">
        <rect x="295" y="380" width="14" height="18" rx="4" fill={colors.coffeeCup} />
        <path d="M295 384 C289 384 289 394 295 394" stroke={colors.coffeeCup} strokeWidth="2" fill="none" />
      </g>

      <g id="coffee-mug-2">
        <rect x="475" y="385" width="12" height="15" rx="3" fill={colors.plantPot} />
        <path d="M487 388 C491 388 491 396 487 396" stroke={colors.plantPot} strokeWidth="2" fill="none" />
      </g>

      {/* FLOATING BRAND BADGES & ANALYTICS WIDGETS ABOVE TABLE */}
      
      {/* Floating Badge 1: Live Telemetry */}
      <g id="float-badge-1" filter="url(#softShadow)" className="animate-pulse">
        <rect x="150" y="180" width="130" height="38" rx="19" fill={colors.badgeBg} stroke={colors.badgeBorder} strokeWidth="1.5" />
        <circle cx="170" cy="199" r="6" fill="#66745A" />
        <text x="184" y="203" fill={colors.badgeText} fontSize="12" fontWeight="700" fontFamily="Outfit, sans-serif">
          Live Sync 98%
        </text>
      </g>

      {/* Floating Badge 2: Smart Recommendation */}
      <g id="float-badge-2" filter="url(#softShadow)">
        <rect x="520" y="160" width="150" height="42" rx="12" fill={colors.badgeBg} stroke={colors.badgeBorder} strokeWidth="1.5" />
        <path d="M536 175 L540 185 L550 189 L540 193 L536 203 L532 193 L522 189 L532 185 Z" fill={colors.accentLine} />
        <text x="556" y="179" fill={colors.badgeText} fontSize="11" fontWeight="800" fontFamily="Outfit, sans-serif">
          AI Optimization
        </text>
        <text x="556" y="193" fill={colors.badgeText} fontSize="10" fontWeight="500" opacity="0.8" fontFamily="Outfit, sans-serif">
          Bottleneck Eliminated
        </text>
      </g>
    </svg>
  );
};

export default CollaborativeTeamIllustration;
