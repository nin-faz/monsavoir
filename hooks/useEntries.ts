"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { subscribeToEntries, subscribeToTags } from "@/lib/firestore";
import { Entry, Tag } from "@/types";

export function useEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => setRetryCount((n) => n + 1), []);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setTags([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    let entriesLoaded = false;
    let tagsLoaded = false;

    const checkDone = () => {
      if (entriesLoaded && tagsLoaded) setLoading(false);
    };

    const handleError = () => {
      setError("Impossible de charger ton cabinet. Vérifie ta connexion et réessaie.");
      setLoading(false);
    };

    const unsubEntries = subscribeToEntries(
      user.uid,
      (data) => {
        setEntries(data);
        entriesLoaded = true;
        checkDone();
      },
      handleError
    );

    const unsubTags = subscribeToTags(
      user.uid,
      (data) => {
        setTags(data);
        tagsLoaded = true;
        checkDone();
      },
      handleError
    );

    return () => {
      unsubEntries();
      unsubTags();
    };
  }, [user, retryCount]);

  return { entries, tags, loading, error, retry };
}
