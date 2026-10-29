import type { NextConfig } from 'next';
const staticExport = process.env.STATIC_EXPORT === 'true';
const config: NextConfig = {
  devIndicators: false,
  ...(staticExport ? { output: 'export', trailingSlash: true } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  images: { unoptimized: staticExport },
};
export default config;
