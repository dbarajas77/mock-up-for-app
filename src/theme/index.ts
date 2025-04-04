import colors from './colors';
import breakpoints, { mediaQuery } from './breakpoints';

export const theme = {
  colors,
  breakpoints,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    round: 9999,
  },
};

export { breakpoints, mediaQuery };
export default theme;
