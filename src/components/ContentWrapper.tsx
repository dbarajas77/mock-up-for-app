import React, { useEffect, memo } from 'react';
import { StyleSheet, View, ScrollView, LayoutChangeEvent } from 'react-native';

type ContentWrapperProps = {
  children: React.ReactNode;
  preserveState?: boolean;
};

/**
 * ContentWrapper component that provides consistent styling for content
 * Memoized to prevent unnecessary re-renders
 */
const ContentWrapper = memo(({ children, preserveState = true }: ContentWrapperProps) => {
  useEffect(() => {
    console.log('ContentWrapper: Component mounted');
    return () => {
      console.log('ContentWrapper: Component unmounted');
    };
  }, []);

  const handleScrollViewLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    console.log('ContentWrapper: ScrollView layout dimensions:', { width, height });
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    console.log('ContentWrapper: Container layout dimensions:', { width, height });
  };

  console.log('ContentWrapper: Rendering with children:', !!children);

  return (
    <ScrollView 
      style={styles.scrollView}
      onLayout={handleScrollViewLayout}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={!preserveState}
    >
      <View 
        style={styles.container}
        onLayout={handleContainerLayout}
      >
        {children}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
});

export default ContentWrapper;
