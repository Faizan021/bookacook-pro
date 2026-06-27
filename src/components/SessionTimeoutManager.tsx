import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { SESSION_CONFIG } from "@/lib/auth/session.config";

// In-memory fallback if localStorage is blocked
let memoryLastActivity = Date.now();

function getLastActivity(): number {
  try {
    const stored = localStorage.getItem(SESSION_CONFIG.STORAGE_KEY);
    if (stored) {
      return parseInt(stored, 10);
    }
  } catch (e) {
    // Ignore error if storage is blocked
  }
  return memoryLastActivity;
}

function setLastActivity(time: number) {
  memoryLastActivity = time;
  try {
    localStorage.setItem(SESSION_CONFIG.STORAGE_KEY, time.toString());
  } catch (e) {
    // Ignore error if storage is blocked
  }
}

export function SessionTimeoutManager({ children }: { children: React.ReactNode }) {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const isLoggingOut = useRef(false);

  const updateActivity = useCallback(() => {
    if (showWarning || isLoggingOut.current) return;
    setLastActivity(Date.now());
  }, [showWarning]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    
    try {
      localStorage.removeItem(SESSION_CONFIG.STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
    
    await supabase.auth.signOut();
    navigate({
      to: "/auth",
      search: (prev: any) => ({ ...prev, message: "You were signed out due to inactivity." }),
    });
  }, [navigate]);

  const staySignedIn = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  // Listen for user activity
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    
    // Throttle activity updates to at most once per second
    let timeout: any;
    const handleActivity = () => {
      if (timeout) return;
      timeout = setTimeout(() => {
        updateActivity();
        timeout = null;
      }, 1000);
    };

    // Initialize
    setLastActivity(Date.now());

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  // Cross-tab sync via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SESSION_CONFIG.STORAGE_KEY && e.newValue) {
        const newTime = parseInt(e.newValue, 10);
        memoryLastActivity = newTime;
        
        // If another tab updated activity, we might need to close the warning
        if (Date.now() - newTime < SESSION_CONFIG.WARNING_THRESHOLD_MS) {
          setShowWarning(false);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Timer check loop
  useEffect(() => {
    const checkIdleStatus = () => {
      if (isLoggingOut.current) return;
      
      const now = Date.now();
      const lastActive = getLastActivity();
      const idleTime = now - lastActive;

      if (idleTime >= SESSION_CONFIG.LOGOUT_THRESHOLD_MS) {
        handleLogout();
      } else if (idleTime >= SESSION_CONFIG.WARNING_THRESHOLD_MS) {
        setShowWarning(true);
        setTimeLeft(Math.max(0, Math.ceil((SESSION_CONFIG.LOGOUT_THRESHOLD_MS - idleTime) / 1000)));
      } else {
        setShowWarning(false);
      }
    };

    // Check more frequently when warning is showing
    const interval = setInterval(checkIdleStatus, showWarning ? 1000 : 5000);
    return () => clearInterval(interval);
  }, [showWarning, handleLogout]);

  // Format time left
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;
  const timeString = `${minutesLeft}:${secondsLeft.toString().padStart(2, "0")}`;

  return (
    <>
      {children}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
            <AlertDialogDescription>
              You've been inactive for a while. For your security, you will be automatically signed out in {timeString}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogout}>Log out now</AlertDialogCancel>
            <AlertDialogAction onClick={staySignedIn}>Stay signed in</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
