function CustomCrossedCutlery({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Spoon rotated 42 deg around center (50, 50) */}
      <g transform="rotate(42 50 50)">
        <ellipse cx="50" cy="22" rx="11" ry="16" />
        <rect x="46" y="34" width="8" height="42" rx="4" />
      </g>

      {/* Fork rotated -42 deg around center (50, 50) */}
      <g transform="rotate(-42 50 50)">
        <rect x="40.5" y="8" width="4.5" height="18" rx="2.25" />
        <rect x="47.75" y="8" width="4.5" height="18" rx="2.25" />
        <rect x="55" y="8" width="4.5" height="18" rx="2.25" />
        <path d="M 39 23 C 39 29, 45 32, 46 34 L 54 34 C 55 32, 61 29, 61 23 Z" />
        <rect x="46" y="33" width="8" height="43" rx="4" />
      </g>
    </svg>
  );
}

export function SpeiselyLogo({
  size = "md",
  variant = "dark",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}) {
  const dims = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const textColor = variant === "light" ? "text-[#F6F4EB]" : "text-forest";
  const iconBg = variant === "light" ? "bg-white/15" : "bg-forest";
  const iconColor = variant === "light" ? "text-[#F6F4EB]" : "text-[#F6F4EB]";

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${dims} grid place-items-center rounded-full ${iconBg} ${iconColor} shrink-0 shadow-sm`}
      >
        <CustomCrossedCutlery className={iconSize} />
      </div>
      <span className={`font-sans font-extrabold tracking-tight ${text} ${textColor}`}>
        Speisely
      </span>
    </div>
  );
}
