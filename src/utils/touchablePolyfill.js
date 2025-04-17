/**
 * Touchable Polyfill
 * 
 * This file provides a polyfill for the hasTouchableProperty issue
 * in react-native-web when used with certain configurations.
 */

export const hasTouchableProperty = (Component) => {
  // Simple implementation that always returns true to bypass the check
  return true;
};

// Export other potential touchable helpers that might be needed
export const getTouchableProperties = (props) => {
  const {
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    ...otherProps
  } = props;
  
  return {
    touchableProps: {
      onPress,
      onPressIn,
      onPressOut,
      onLongPress,
    },
    otherProps,
  };
};

// Apply this polyfill if needed
export const applyTouchablePolyfill = () => {
  // If the global object exists and we're in a web environment
  if (typeof window !== 'undefined' && window.__WEBPACK_IMPORTED_MODULE_1__hasTouchableProperty === undefined) {
    window.__WEBPACK_IMPORTED_MODULE_1__hasTouchableProperty = hasTouchableProperty;
  }
};

// Auto-apply the polyfill when this module is imported
applyTouchablePolyfill();

export default {
  hasTouchableProperty,
  getTouchableProperties,
  applyTouchablePolyfill,
}; 