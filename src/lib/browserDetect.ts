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
 * Returns true if the browser was successfully launched.
 */
export function openInExternalBrowser(): boolean {
  if (typeof window === "undefined") return false;

  const url = window.location.href;
  const { isIOS, isAndroid } = detectInAppBrowser();

  if (isAndroid) {
    // Android: try opening in Chrome via intent
    const intentUrl = `intent://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}#Intent;scheme=https;package=com.android.chrome;end`;
    try {
      window.location.href = intentUrl;
      return true;
    } catch {
      // Fallback: copy URL
      copyToClipboard(url);
      return false;
    }
  }

  if (isIOS) {
    // iOS: try googlechrome:// scheme
    try {
      const chromeUrl = url.replace(/^https?:\/\//, "googlechrome://");
      window.location.href = chromeUrl;
      return true;
    } catch {
      // Fallback: show share sheet
      if (navigator.share) {
        navigator.share({ url });
        return true;
      }
      copyToClipboard(url);
      return false;
    }
  }

  copyToClipboard(url);
  return false;
}

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}
