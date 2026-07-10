function CustomCrossedCutlery({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <g transform="translate(4,4)">
        <g transform="rotate(45, 12, 12) translate(5, 0)">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
        </g>
        <g transform="rotate(-45, 12, 12) translate(-7.5, 0)">
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </g>
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
  const dims = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-2xl";
  const textColor = variant === "light" ? "text-[oklch(0.97_0.02_92)]" : "text-forest";
  const iconBg = variant === "light" ? "bg-[oklch(0.97_0.02_92)]/15" : "bg-forest";
  const iconColor =
    variant === "light" ? "text-[oklch(0.97_0.02_92)]" : "text-[oklch(0.97_0.02_92)]";
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${dims} grid place-items-center rounded-full ${iconBg} ${iconColor} shrink-0`}
      >
        <CustomCrossedCutlery className="h-6 w-6" strokeWidth={2} />
      </div>
      <span className={`font-display ${text} font-bold tracking-tight ${textColor}`}>Speisely</span>
    </div>
  );
}
