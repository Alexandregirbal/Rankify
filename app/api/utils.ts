/**
 * Allows to always have a valid url
 */
export const buildFullUrl = (url: string) => {
  if (url.startsWith("http")) return url;
  return `https://${url}`;
};
