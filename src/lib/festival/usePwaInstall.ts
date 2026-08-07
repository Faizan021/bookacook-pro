import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  useEffect(() => {
    // Detect standalone mode (Android Chrome PWA / iOS Safari standalone)
    const isStandaloneDisplay = window.matchMedia("(display-mode: standalone)").matches;
    const isIosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandaloneDisplay || isIosStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
        }
      } catch (err) {
        console.error("PWA install error:", err);
      } finally {
        setDeferredPrompt(null);
      }
    } else {
      // Fallback: show instructions modal for iOS Safari / Unsupported browsers
      setShowHelpModal(true);
    }
  };

  return {
    isInstalled,
    canPrompt: !!deferredPrompt,
    promptInstall,
    showHelpModal,
    closeHelpModal: () => setShowHelpModal(false),
  };
}
