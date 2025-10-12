// Get the base path from Vite config
const getBasePath = () => {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : base + '/';
};

export const LOGO_CONFIG = {
  // Main logo image (public folder path)
  image: `${getBasePath()}safemint-logo.png`,

  // Alternative fallback (same path for consistency)
  fallback: `${getBasePath()}safemint-logo.png`,

  // Logo dimensions for different use cases
  sizes: {
    navbar: {
      width: 100,
      height: 100,
    },
    sidebar: {
      width: 40,
      height: 40,
    },
    large: {
      width: 80,
      height: 80,
    },
    favicon: {
      width: 32,
      height: 32,
    }
  },

  // Alt text
  alt: 'USDStack Logo',

  // Common styles
  styles: {
    borderRadius: '8px',
    objectFit: 'contain' as const,
  }
};

export default LOGO_CONFIG;
