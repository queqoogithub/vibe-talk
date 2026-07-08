"use client";

import { useState, useEffect, useCallback } from "react";
import type { ErrorDashboard } from "@/lib/types";
import { getErrorDashboard, resetErrorDashboard } from "@/lib/db";

export function useErrorTracking() {
  const [dashboard, setDashboard] = useState<ErrorDashboard>({
    totalErrors: 0,
    totalConversations: 0,
    errorBreakdown: [],
    lastUpdated: Date.now(),
  });

  const refresh = useCallback(async () => {
    const data = await getErrorDashboard();
    setDashboard(data);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const reset = useCallback(async () => {
    await resetErrorDashboard();
    await refresh();
  }, [refresh]);

  return { dashboard, refresh, reset };
}
