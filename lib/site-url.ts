/**
 * Get the site URL for metadata and Open Graph tags
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://workiswork.vercel.app")
  );
}

/**
 * Get the Open Graph image URL
 */
export function getOgImageUrl(): string {
  return `${getSiteUrl()}/metaheader.png`;
}

