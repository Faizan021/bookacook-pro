type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className = "h-10 w-10" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="32"
        cy="32"
        r="13"
        stroke="currentColor"
        strokeWidth="2.6"
      />
      <circle
        cx="32"
        cy="32"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.7"
        opacity="0.45"
      />
      <ellipse
        cx="19"
        cy="24"
        rx="2.6"
        ry="3.8"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <path
        d="M19 28v14"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M45 21c2.3 4.2 2.3 8.6 0 12.8"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M45 33.8V42"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
