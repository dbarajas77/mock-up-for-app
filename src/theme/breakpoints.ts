/**
 * Responsive breakpoints for the application
 * These should be used consistently across all components
 */

export const breakpoints = {
  mobileSm: '320px',  /* Small mobile */
  mobile: '480px',    /* Typical mobile */
  tabletSm: '640px',  /* Small tablets */
  tablet: '768px',    /* Typical tablets */
  laptop: '1024px',   /* Laptops and small desktops */
  desktop: '1280px',  /* Desktop computers */
  desktopLg: '1440px', /* Larger desktop screens */
  desktopXl: '1920px', /* Extra large screens */
};

/**
 * Media query helper for responsive styling
 * Usage example:
 * 
 * import { mediaQuery } from '../theme/breakpoints';
 * 
 * const Container = styled.View`
 *   width: 100%;
 *   
 *   ${mediaQuery.tablet`
 *     width: 80%;
 *   `}
 *   
 *   ${mediaQuery.desktop`
 *     width: 60%;
 *   `}
 * `;
 */
export const mediaQuery = {
  mobileSm: (styles: TemplateStringsArray) => 
    `@media (min-width: ${breakpoints.mobileSm}) { ${styles.join('')} }`,
  mobile: (styles: TemplateStringsArray) => 
    `@media (min-width: ${breakpoints.mobile}) { ${styles.join('')} }`,
  tabletSm: (styles: TemplateStringsArray) => 
    `@media (min-width: ${breakpoints.tabletSm}) { ${styles.join('')} }`,
  tablet: (styles: TemplateStringsArray) => 
    `@media (min-width: ${breakpoints.tablet}) { ${styles.join('')} }`,
  laptop: (styles: TemplateStringsArray) => 
    `@media (min-width: ${breakpoints.laptop}) { ${styles.join('')} }`,
  desktop: (styles: TemplateStringsArray) => 
    `@media (min-width: ${breakpoints.desktop}) { ${styles.join('')} }`,
  desktopLg: (styles: TemplateStringsArray) => 
    `@media (min-width: ${breakpoints.desktopLg}) { ${styles.join('')} }`,
  desktopXl: (styles: TemplateStringsArray) => 
    `@media (min-width: ${breakpoints.desktopXl}) { ${styles.join('')} }`,
};

export default breakpoints;
