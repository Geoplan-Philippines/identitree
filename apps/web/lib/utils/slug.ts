/**
 * Convert a free-form string into a URL/route-safe slug.
 *
 * Rules:
 * - lowercase
 * - spaces & whitespace → hyphens
 * - strip everything that isn't [a-z0-9-]
 * - collapse consecutive hyphens
 * - trim leading/trailing hyphens
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Append/increment a numeric suffix on a slug for conflict resolution.
 * "acme" → "acme-2", "acme-2" → "acme-3"
 */
export function bumpSlug(slug: string): string {
  const match = /^(.*)-(\d+)$/.exec(slug);
  if (match && match[1] && match[2]) {
    const next = Number.parseInt(match[2], 10) + 1;
    return `${match[1]}-${next}`;
  }
  return `${slug}-2`;
}
