"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "pwa-install-dismissed";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true = no modal

  useEffect(() => {
    // Already in standalone → no need to prompt
    const mq = window.matchMedia("(display-mode: standalone)");
    if (mq.matches) {
      setIsStandalone(true);
      return;
    }
    setIsStandalone(false);

    // Already dismissed within 7 days
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < 7 * 24 * 60 * 60 * 1000) return; // within 7 days
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Delay slightly so page finishes rendering
      setTimeout(() => setShowModal(true), 1200);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowModal(false);
    if (outcome === "accepted") {
      localStorage.removeItem(DISMISSED_KEY);
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setShowModal(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  }, []);

  return {
    showModal: showModal && !isStandalone,
    install,
    dismiss,
  };
}
