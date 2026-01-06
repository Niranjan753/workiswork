export function guessLogoFromWebsite(website?: string | null) {
  if (!website) return null;
  try {
    const url = new URL(website);
    return `https://logo.clearbit.com/${url.hostname}`;
  } catch {
    return null;
  }
}


