/** Public files need the Pages subdirectory; Next prefixes its own bundles. */
export function publicAsset(path: `/${string}`): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}
