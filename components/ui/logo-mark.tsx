type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className = "h-10 w-10" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Fork */}
      <rect x="8" y="17" width="1.2" height="10" rx="0.6" fill="currentColor" />
      <rect x="7.6" y="13.5" width="2" height="3.5" rx="0.5" fill="currentColor" />
      <rect x="6.5" y="5" width="0.9" height="9" rx="0.45" fill="currentColor" />
      <rect x="8.05" y="5" width="0.9" height="9" rx="0.45" fill="currentColor" />
      <rect x="9.6" y="5" width="0.9" height="9" rx="0.45" fill="currentColor" />

      {/* Plate */}
      <ellipse
        cx="32"
        cy="18"
        rx="10.5"
        ry="6.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <ellipse
        cx="32"
        cy="18"
        rx="7.5"
        ry="4.6"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <path
        d="M25 17.5C25 12.5 39 12.5 39 17.5"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Knife */}
      <rect x="54.8" y="17" width="1.2" height="10" rx="0.6" fill="currentColor" />
      <rect x="54.5" y="14.5" width="1.8" height="2.5" rx="0.4" fill="currentColor" />
      <path d="M55.4 14.5L56 5L54.8 14.5Z" fill="currentColor" opacity="0.9" />
      <line
        x1="55.4"
        y1="14.5"
        x2="56"
        y2="5"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
