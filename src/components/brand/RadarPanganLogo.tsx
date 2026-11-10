'use client';

import React from 'react';

interface RadarPanganLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Logo Resmi Radar Pangan (Sistem Pemantauan Harga Pangan Nasional)
 * Identik dengan logo pada Landing Page Publik.
 */
export const RadarPanganLogo: React.FC<RadarPanganLogoProps> = ({
  className = '',
  size = 32,
  color = '#67151D',
}) => {
  const height = Math.round((size * 38) / 32);
  return (
    <svg
      viewBox="0 0 32 38"
      width={size}
      height={height}
      aria-hidden="true"
      className={className}
      style={{ color, flexShrink: 0 }}
    >
      <path
        d="M16 2 20 8 16 13 12 8Z M7 11 12 16 9 22 4 17Z M25 11 28 17 23 22 20 16Z M12 18 16 13 20 18 19 26 16 30 13 26Z M4 23 11 26 13 32 7 30Z M28 23 21 26 19 32 25 30Z"
        fill="currentColor"
      />
      <path
        d="M16 30v6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default RadarPanganLogo;
