type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className = "h-9 w-9" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Plate */}
      <circle
        cx="32"
        cy="33"
        r="13.5"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <circle
        cx="32"
        cy="33"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
        opacity="0.5"
      />

      {/* Spoon */}
      <ellipse
        cx="18"
        cy="24"
        rx="2.8"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M18 28v16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Knife */}
      <path
        d="M46 20c2.8 4.6 2.8 9.6 0 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M46 34v10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Small premium top arc */}
      <path
        d="M22 18c3.2-2.6 6.4-3.8 10-3.8s6.8 1.2 10 3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
