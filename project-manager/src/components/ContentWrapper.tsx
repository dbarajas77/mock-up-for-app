import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, LayoutChangeEvent } from 'react-native';

type ContentWrapperProps = {
  children: React.ReactNode;
};

/**
 * ContentWrapper component that provides consistent styling for content
 */
const ContentWrapper = ({ children }: ContentWrapperProps) => {
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
    >
      <View 
        style={styles.container}
        onLayout={handleContainerLayout}
      >
        {children}
      </View>
    </ScrollView>
  );
};

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
