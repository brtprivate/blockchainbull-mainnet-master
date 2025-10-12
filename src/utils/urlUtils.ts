/**
 * Extracts the referrer address from URL parameters
 * @returns The referrer address or empty string if not found
 */
export const getReferrerFromUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('referrer') || '';
};
