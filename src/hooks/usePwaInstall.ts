"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * Shared install state for UI outside the auto modal
 * (e.g. the "ติดตั้งเลย" button in Settings).
 */
export interface PwaInstallContextValue {
  /** Browser captured a `beforeinstallprompt` and the app is not installed yet. */
  canInstall: boolean;
  /** The app is already installed and running in standalone mode. */
  isStandalone: boolean;
  /** Trigger the browser's native install dialog. */
  install: () => void;
}

export const PwaInstallContext = createContext<PwaInstallContextValue>({
  canInstall: false,
  isStandalone: false,
  install: () => {},
});

export function usePwaInstallContext() {
  return useContext(PwaInstallContext);
}

const DISMISSED_KEY = "pwa-install-dismissed";
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true = no modal

  /**
   * Chrome re-fires `beforeinstallprompt` while the site is installable but
   * not installed, every time the user interacts again (e.g. switching tabs).
   * The dismissal check below only runs once on mount, so we must also
   * remember in memory that the user dismissed it — otherwise the modal pops
   * back up on every tab switch.
   */
  const suppressedRef = useRef(false);

  useEffect(() => {
    // Already in standalone → no need to prompt
    const mq = window.matchMedia("(display-mode: standalone)");
    if (mq.matches) {
      suppressedRef.current = true;
      setIsStandalone(true);
      return;
    }
    setIsStandalone(false);

    // Already dismissed within 7 days
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_COOLDOWN_MS) {
        suppressedRef.current = true;
        return;
      }
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    const handler = (e: Event) => {
      e.preventDefault();
      // Keep the latest prompt so the install button stays functional
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (suppressedRef.current) return; // don't nag again this session

      // Delay slightly so page finishes rendering
      const timer = setTimeout(() => {
        if (!suppressedRef.current) setShowModal(true);
      }, 1200);
      timers.push(timer);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      timers.forEach(clearTimeout);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowModal(false);

    if (outcome === "accepted") {
      suppressedRef.current = true;
      localStorage.removeItem(DISMISSED_KEY);
    } else {
      // User cancelled the browser install dialog → stop asking for the rest
      // of this session, but allow asking again on a future visit.
      suppressedRef.current = true;
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    suppressedRef.current = true; // remember in memory, not just localStorage
    setShowModal(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  }, []);

  return {
    showModal: showModal && !isStandalone,
    canInstall: !!deferredPrompt && !isStandalone,
    isStandalone,
    install,
    dismiss,
  };
}
