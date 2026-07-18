"use client";

/**
 * Detect if the current browser is an in-app WebView
 * (LINE, Facebook, Messenger, Instagram, etc.)
 */
export function detectInAppBrowser(): {
  isInApp: boolean;
  name: string | null;
  isIOS: boolean;
  isAndroid: boolean;
} {
  if (typeof window === "undefined") {
    return { isInApp: false, name: null, isIOS: false, isAndroid: false };
  }

  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);

  // LINE
  if (/Line/i.test(ua)) {
    return { isInApp: true, name: "LINE", isIOS, isAndroid };
  }

  // Facebook
  if (/FBAN|FBAV/i.test(ua)) {
    return { isInApp: true, name: "Facebook", isIOS, isAndroid };
  }

  // Messenger
  if (/Messenger/i.test(ua) || /FB_IAB\/MESSENGER/i.test(ua)) {
    return { isInApp: true, name: "Messenger", isIOS, isAndroid };
  }

  // Instagram
  if (/Instagram/i.test(ua)) {
    return { isInApp: true, name: "Instagram", isIOS, isAndroid };
  }

  // Twitter / X
  if (/Twitter/i.test(ua)) {
    return { isInApp: true, name: "X (Twitter)", isIOS, isAndroid };
  }

  // TikTok
  if (/TikTok/i.test(ua) || /musical_ly/i.test(ua)) {
    return { isInApp: true, name: "TikTok", isIOS, isAndroid };
  }

  // Generic WebView check (catch-all)
  if (/wv|WebView/i.test(ua) || /\(iPhone;.*CPU.*AppleWebKit/i.test(ua)) {
    // Only flag as in-app if we're on mobile and NOT in Safari/Chrome/Firefox
    if (
      (isIOS || isAndroid) &&
      !/Safari/i.test(ua) &&
      !/Chrome/i.test(ua) &&
      !/Firefox/i.test(ua)
    ) {
      return { isInApp: true, name: "WebView", isIOS, isAndroid };
    }
  }

  return { isInApp: false, name: null, isIOS, isAndroid };
}

/**
 * Attempt to open the current URL in the external browser.
 * Returns the method used so the UI can show appropriate feedback.
 */
export function openInExternalBrowser(): {
  launched: boolean;
  method: "intent" | "clipboard";
} {
  if (typeof window === "undefined")
    return { launched: false, method: "clipboard" };

  const url = window.location.href;
  const { isAndroid } = detectInAppBrowser();

  if (isAndroid) {
    // Android: intent:// without package restriction → user picks browser
    const intentUrl = `intent://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}#Intent;scheme=https;end`;
    try {
      window.location.href = intentUrl;
      return { launched: true, method: "intent" };
    } catch {
      // fallback
    }
  }

  // iOS / desktop / fallback: copy URL to clipboard
  copyToClipboard(url);
  return { launched: false, method: "clipboard" };
}

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}
