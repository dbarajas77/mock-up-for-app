import { useState, useEffect } from 'react';

// Breakpoints from project memory
const breakpoints = {
  mobileSm: 320,    // Small mobile
  mobile: 480,      // Typical mobile
  tabletSm: 640,    // Small tablets
  tablet: 768,      // Typical tablets
  laptop: 1024,     // Laptops and small desktops
  desktop: 1280,    // Desktop computers
  desktopLg: 1440,  // Larger desktop screens
  desktopXl: 1920   // Extra large screens
};

export type Breakpoint = 'mobileSm' | 'mobile' | 'tabletSm' | 'tablet' | 'laptop' | 'desktop' | 'desktopLg' | 'desktopXl';

/**
 * Custom hook to detect current breakpoint and provide helper methods
 */
export const useBreakpoint = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Get current breakpoint
  const getCurrentBreakpoint = (): Breakpoint => {
    if (windowWidth < breakpoints.mobileSm) return 'mobileSm';
    if (windowWidth < breakpoints.mobile) return 'mobileSm';
    if (windowWidth < breakpoints.tabletSm) return 'mobile';
    if (windowWidth < breakpoints.tablet) return 'tabletSm';
    if (windowWidth < breakpoints.laptop) return 'tablet';
    if (windowWidth < breakpoints.desktop) return 'laptop';
    if (windowWidth < breakpoints.desktopLg) return 'desktop';
    if (windowWidth < breakpoints.desktopXl) return 'desktopLg';
    return 'desktopXl';
  };
  
  // Helper methods
  const isMobile = windowWidth <= breakpoints.mobile;
  const isTablet = windowWidth > breakpoints.mobile && windowWidth <= breakpoints.tablet;
  const isDesktop = windowWidth > breakpoints.tablet;
  
  // Check if current width is below a specific breakpoint
  const isBelow = (breakpoint: Breakpoint): boolean => {
    return windowWidth < breakpoints[breakpoint];
  };
  
  // Check if current width is above a specific breakpoint
  const isAbove = (breakpoint: Breakpoint): boolean => {
    return windowWidth >= breakpoints[breakpoint];
  };
  
  return {
    windowWidth,
    currentBreakpoint: getCurrentBreakpoint(),
    breakpoints,
    isMobile,
    isTablet,
    isDesktop,
    isBelow,
    isAbove
  };
};

export default useBreakpoint;
