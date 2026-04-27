// Utility to generate a slug from a name string
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except space and hyphen
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Collapse multiple hyphens
}
