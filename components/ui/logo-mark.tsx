"use client";

import React from "react";

interface LogoMarkProps {
  size?: number;
  color?: string;
  showWordmark?: boolean;
  wordmarkColor?: string;
  className?: string;
}

export function LogoMark({
  size = 30,
  color = "currentColor",
  showWordmark = false,
  wordmarkColor = "currentColor",
  className = "",
}: LogoMarkProps) {
  const iconWidth = size;
  const iconHeight = size;

  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="Speisely"
    >
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="0.75"
          y="0.75"
          width="30.5"
          height="30.5"
          rx="15.25"
          stroke={color}
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />

        {/* Fork */}
        <rect x="10.2" y="10" width="1.1" height="10.5" rx="0.55" fill={color} />
        <rect x="8.55" y="7.6" width="0.85" height="4.6" rx="0.42" fill={color} />
        <rect x="10.2" y="7.6" width="0.85" height="4.6" rx="0.42" fill={color} />
        <rect x="11.85" y="7.6" width="0.85" height="4.6" rx="0.42" fill={color} />

        {/* Knife */}
        <rect x="19.55" y="10" width="1.15" height="10.5" rx="0.55" fill={color} />
        <path
          d="M20.15 7.6C21.25 9.15 21.35 11.35 20.75 13.2L19.55 13.2L19.55 7.6H20.15Z"
          fill={color}
        />

        {/* Elegant center divider / table line */}
        <line
          x1="14.9"
          y1="8.3"
          x2="14.9"
          y2="22.2"
          stroke={color}
          strokeOpacity="0.18"
          strokeWidth="0.9"
        />
      </svg>

      {showWordmark && (
        <span
          style={{
            color: wordmarkColor,
            fontSize: size * 0.72,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
          className="tracking-tight"
        >
          Speisely
        </span>
      )}
    </span>
  );
}

export function LogoLockup({
  size = 28,
  dark = false,
  className = "",
}: {
  size?: number;
  dark?: boolean;
  className?: string;
}) {
  const c = dark ? "#eadfca" : "#173222";

  return (
    <LogoMark
      size={size}
      color={c}
      wordmarkColor={c}
      showWordmark
      className={className}
    />
  );
}

export default LogoMark;
