// Utility to ensure the data is always an array
export function ensureArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data == null) return [];
  // If the backend returns an object with a 'data' property, try to use it
  if (typeof data === "object" && "data" in (data as any) && Array.isArray((data as any).data)) {
    return (data as any).data;
  }
  return [];
}
