import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { forwardRef } from "react";

export const InputPassword = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { hasError?: boolean }
>(({ className, hasError, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        ref={ref}
        className={`${className} pr-10 ${hasError ? "border-red-500 focus-visible:ring-red-500/40" : "border-[#eadfce] focus-visible:ring-[#b28a3c]/40"}`}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/50 hover:text-forest transition-colors"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
InputPassword.displayName = "InputPassword";
