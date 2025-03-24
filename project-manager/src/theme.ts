/**
 * Global theme definition for the app
 */
export const theme = {
  colors: {
    primary: {
      main: '#001532',
      dark: '#000c1d',
      light: '#002b69',
      lightest: '#e6f0ff',
    },
    secondary: {
      main: '#4a6ee0',
      dark: '#3257d3',
      light: '#6384e7',
      lightest: '#edf1fc',
    },
    success: {
      main: '#2e7d32',
      dark: '#1b5e20',
      light: '#4caf50',
      lightest: '#e8f5e9',
    },
    warning: {
      main: '#ff9800',
      dark: '#ef6c00',
      light: '#ffb74d',
      lightest: '#fff3e0',
    },
    error: {
      main: '#d32f2f',
      dark: '#b71c1c',
      light: '#ef5350',
      lightest: '#ffebee',
    },
    neutral: {
      main: '#e5e7eb',
      dark: '#9ca3af',
      light: '#f3f4f6',
      lightest: '#f9fafb',
      darkest: '#111827',
    },
    // Additional color properties for UI components
    background: '#ffffff',
    surface: '#ffffff',
    border: '#e5e7eb',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    circle: 9999,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  breakpoints: {
    mobileSm: 320,
    mobile: 480,
    tabletSm: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
    desktopLg: 1440,
    desktopXl: 1920,
  },
  shadows: {
    sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0px 10px 15px rgba(0, 0, 0, 0.1)',
  },
};
