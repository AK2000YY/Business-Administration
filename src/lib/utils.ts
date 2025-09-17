import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import supabase from "./supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserId(setUserId: (id: string) => void) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const userId = session.user.id;
    setUserId(userId);
  }
}
