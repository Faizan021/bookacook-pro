type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className = "h-8 w-8" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse
        cx="32"
        cy="33"
        rx="16"
        ry="11.5"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <ellipse
        cx="32"
        cy="33"
        rx="11"
        ry="7.2"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.7"
      />
      <path
        d="M14 19v14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M18 19v14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M22 19v14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M18 33v12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M46 19v26"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M50 19c0 5-1.4 8.4-4 11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
