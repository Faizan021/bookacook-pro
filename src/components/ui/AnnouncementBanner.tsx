import { AlertCircle } from "lucide-react";

interface AnnouncementBannerProps {
  text: string | null;
  bgColor?: string | null;
  isActive: boolean;
}

export function AnnouncementBanner({ text, bgColor, isActive }: AnnouncementBannerProps) {
  if (!isActive || !text) return null;

  const colorClass =
    bgColor === "destructive"
      ? "bg-destructive text-destructive-foreground"
      : bgColor === "secondary"
        ? "bg-secondary text-secondary-foreground"
        : "bg-primary text-primary-foreground";

  return (
    <div
      className={`w-full py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium ${colorClass} animate-in slide-in-from-top-2`}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="text-center">{text}</span>
    </div>
  );
}
