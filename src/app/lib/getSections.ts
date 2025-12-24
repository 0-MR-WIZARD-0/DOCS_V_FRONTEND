import { Section } from "@/types/section";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function getSections(): Promise<Section[]> {
  try {
    const res = await fetch(`${API_URL}/sections`, {
      method: 'GET',
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch sections");
      return [];
    }

    const data = await res.json();

    return Array.isArray(data)
      ? data.sort((a, b) => a.order - b.order)
      : [];
  } catch (e) {
    console.error("getSections error:", e);
    return [];
  }
}   