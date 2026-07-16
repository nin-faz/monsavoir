"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { subscribeToEntries, subscribeToTags } from "@/lib/firestore";
import { Entry, Tag } from "@/types";

export function useEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setTags([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let entriesLoaded = false;
    let tagsLoaded = false;

    const checkDone = () => {
      if (entriesLoaded && tagsLoaded) setLoading(false);
    };

    const unsubEntries = subscribeToEntries(user.uid, (data) => {
      setEntries(data);
      entriesLoaded = true;
      checkDone();
    });

    const unsubTags = subscribeToTags(user.uid, (data) => {
      setTags(data);
      tagsLoaded = true;
      checkDone();
    });

    return () => {
      unsubEntries();
      unsubTags();
    };
  }, [user]);

  return { entries, tags, loading };
}
