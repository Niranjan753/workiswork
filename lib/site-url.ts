/**
 * Get the site URL for metadata and Open Graph tags
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://workiswork.xyz";
  }
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
}

/**
 * Get the Open Graph image URL
 */
export function getOgImageUrl(): string {
  return `${getSiteUrl()}/metaheader.png`;
}

