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
  size = 32,
  color = "currentColor",
  showWordmark = false,
  wordmarkColor = "currentColor",
  className = "",
}: LogoMarkProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="Speisely"
    >
      <svg
        width={size * 2}
        height={size}
        viewBox="0 0 64 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="8" y="17" width="1.2" height="10" rx="0.6" fill={color} />
        <rect x="7.6" y="13.5" width="2" height="3.5" rx="0.5" fill={color} />
        <rect x="6.5" y="5" width="0.9" height="9" rx="0.45" fill={color} />
        <rect x="8.05" y="5" width="0.9" height="9" rx="0.45" fill={color} />
        <rect x="9.6" y="5" width="0.9" height="9" rx="0.45" fill={color} />

        <ellipse
          cx="32"
          cy="18"
          rx="10.5"
          ry="6.5"
          stroke={color}
          strokeWidth="1.1"
          fill="none"
        />
        <ellipse
          cx="32"
          cy="18"
          rx="7.5"
          ry="4.6"
          stroke={color}
          strokeWidth="0.7"
          strokeOpacity="0.55"
          fill="none"
        />
        <path
          d="M25 17.5 C25 12.5 39 12.5 39 17.5"
          stroke={color}
          strokeWidth="0.85"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        <rect x="54.8" y="17" width="1.2" height="10" rx="0.6" fill={color} />
        <rect
          x="54.5"
          y="14.5"
          width="1.8"
          height="2.5"
          rx="0.4"
          fill={color}
        />
        <path
          d="M55.4 14.5 L56 5 L54.8 14.5 Z"
          fill={color}
          opacity="0.9"
        />
        <line
          x1="55.4"
          y1="14.5"
          x2="56"
          y2="5"
          stroke={color}
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <span
          style={{
            color: wordmarkColor,
            fontFamily: "var(--font-geist-sans, sans-serif)",
            fontSize: size * 0.6,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
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
  const c = dark ? "#e4d9c2" : "#2a4a2c";

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
