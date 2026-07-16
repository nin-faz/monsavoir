export type EntryType = "word" | "question";

export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
}

export interface Entry {
  id: string;
  userId: string;
  type: EntryType;
  title: string;
  content: string;
  examples?: string[];
  imageUrl?: string;
  tags: string[];
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const TAG_COLORS = [
  { name: "violet", bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  { name: "blue", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  { name: "green", bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  { name: "orange", bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  { name: "pink", bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-500" },
  { name: "yellow", bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  { name: "red", bg: "bg-red-100", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  { name: "gray", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" },
];
