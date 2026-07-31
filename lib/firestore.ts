import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Entry, Tag } from "@/types";

export function subscribeToEntries(
  userId: string,
  callback: (entries: Entry[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, "entries"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date(),
      })) as Entry[];
      callback(entries);
    },
    (error) => onError?.(error)
  );
}

export function subscribeToTags(
  userId: string,
  callback: (tags: Tag[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, "tags"),
    where("userId", "==", userId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tags = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
      })) as Tag[];
      callback(tags);
    },
    (error) => onError?.(error)
  );
}

export async function createEntry(
  userId: string,
  data: Omit<Entry, "id" | "userId" | "createdAt" | "updatedAt">
) {
  return addDoc(collection(db, "entries"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEntry(
  id: string,
  data: Partial<Omit<Entry, "id" | "userId" | "createdAt">>
) {
  return updateDoc(doc(db, "entries", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEntry(id: string) {
  return deleteDoc(doc(db, "entries", id));
}

export async function createTag(
  userId: string,
  data: Omit<Tag, "id" | "userId" | "createdAt">
) {
  return addDoc(collection(db, "tags"), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });
}

export async function deleteTag(id: string) {
  return deleteDoc(doc(db, "tags", id));
}

export async function updateTag(id: string, data: { name?: string; color?: string }) {
  return updateDoc(doc(db, "tags", id), data);
}
