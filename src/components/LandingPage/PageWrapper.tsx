import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface PageWrapperProps {
  children: ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * PageWrapper ensures section backgrounds extend the full width of the screen
 * while keeping content constrained to a max-width for readability.
 */
const PageWrapper = ({
  children,
  backgroundColor = '#FFFFFF',
  style,
  contentStyle
}: PageWrapperProps) => {
  return (
    <View style={[styles.wrapper, { backgroundColor }, style]}>
      <View style={[styles.contentContainer, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100vw',  // Use viewport width for full-width background
    alignItems: 'center',
    paddingHorizontal: 0,
    position: 'relative',
    left: 0,
    right: 0,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 1200,
    paddingHorizontal: 20,
  }
});

export default PageWrapper; 