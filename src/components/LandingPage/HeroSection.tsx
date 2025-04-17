import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, useWindowDimensions, Animated as RNAnimated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { PageWrapper } from './index';
import OceanPulseBackground from './OceanPulseBackground';

// Aurora background component
const AuroraBackground = () => {
  // Animation values for the aurora effect
  const translateX1 = useRef(new RNAnimated.Value(0)).current;
  const translateX2 = useRef(new RNAnimated.Value(0)).current;
  const scale1 = useRef(new RNAnimated.Value(1)).current;
  const scale2 = useRef(new RNAnimated.Value(1)).current;
  
  useEffect(() => {
    // Create looping animations for the aurora effect
    RNAnimated.loop(
      RNAnimated.timing(translateX1, {
        toValue: 1,
        duration: 15000, // Faster
        useNativeDriver: true,
      })
    ).start();
    
    RNAnimated.loop(
      RNAnimated.timing(translateX2, {
        toValue: 1,
        duration: 20000, // Faster
        useNativeDriver: true,
      })
    ).start();
    
    // Add scale animations
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(scale1, {
          toValue: 1.2,
          duration: 10000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(scale1, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ])
    ).start();
    
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(scale2, {
          toValue: 1.3,
          duration: 12000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(scale2, {
          toValue: 0.9,
          duration: 12000,
          useNativeDriver: true,
        })
      ])
    ).start();
    
    return () => {
      // Cleanup animations
      translateX1.stopAnimation();
      translateX2.stopAnimation();
      scale1.stopAnimation();
      scale2.stopAnimation();
    };
  }, []);
  
  return (
    <View style={styles.auroraContainer}>
      <RNAnimated.View 
        style={[
          styles.aurora1,
          {
            transform: [
              {
                translateX: translateX1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -1000], // Increased range
                }),
              },
              {
                scale: scale1,
              },
            ],
          },
        ]}
      />
      <RNAnimated.View 
        style={[
          styles.aurora2,
          {
            transform: [
              {
                translateX: translateX2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -800], // Increased range
                }),
              },
              {
                scale: scale2,
              },
            ],
          },
        ]}
      />
    </View>
  );
};

// Scroll indicator arrow component with animation
const ScrollIndicator = () => {
  const translateY = useSharedValue(0);
  
  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(10, { duration: 1000 }),
      -1, // Infinite repetitions
      true // Reverse animation
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  
  return (
    <Animated.View style={[styles.scrollIndicator, animatedStyle]}>
      <MaterialIcons name="keyboard-arrow-down" size={32} color="#00BA88" />
    </Animated.View>
  );
};

// Animated CTA button with hover/press effect
const AnimatedCTAButton = ({ onPress, children }) => {
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        style={styles.ctaButton}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const HeroSection = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isWeb = Platform.OS === 'web';

  return (
    <PageWrapper
      backgroundColor={isWeb ? 'transparent' : "#f0f9f6"}
      style={styles.pageWrapper}
    >
      {/* Ocean Pulse Background (Web only) */}
      {isWeb && <OceanPulseBackground />}
      
      {/* Aurora Background (non-web platforms) */}
      {!isWeb && <AuroraBackground />}
      
      <View style={[styles.container, { paddingTop: 100 + insets.top }]}>
        <View style={isDesktop ? styles.rowContainer : styles.columnContainer}>
          {/* Left Side - Text Content */}
          <View style={[
            styles.contentContainer, 
            isDesktop ? { width: '50%', alignItems: 'flex-start' } : { width: '100%' }
          ]}>
            <Animated.Text 
              entering={FadeInDown.duration(800)} 
              style={[styles.headline, isDesktop ? styles.textLeft : styles.textCenter, isWeb && styles.webText]}
            >
              Transform Your Project Documentation With SiteSnap
            </Animated.Text>

            <Animated.Text 
              entering={FadeIn.duration(800).delay(300)} 
              style={[styles.subHeadline, isDesktop ? styles.textLeft : styles.textCenter, isWeb && styles.webText]}
            >
              Capture, organize, and manage project documentation in one place. Save time, reduce errors, and improve collaboration across your entire team.
            </Animated.Text>

            <Animated.View entering={FadeInUp.duration(800).delay(900)}> 
              <AnimatedCTAButton
                onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}
              >
                <Text style={styles.ctaText}>Start Your Free Trial</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </AnimatedCTAButton>
            </Animated.View>
            
            {/* Secondary CTA */}
            <Animated.View entering={FadeInUp.duration(800).delay(1000)}>
              <TouchableOpacity 
                style={styles.secondaryCTA}
                onPress={() => navigation.navigate('Features')}
              >
                <Text style={[styles.secondaryCTAText, isWeb && styles.webSecondaryText]}>See How It Works</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Right Side - Phone Image */}
          <Animated.View 
            entering={FadeIn.duration(800).delay(600)} 
            style={[
              styles.imageContainer, 
              isDesktop ? { width: '50%' } : { width: '100%', marginTop: 40 }
            ]}
          >
            <Image 
              source={require('../../assets/images/phone.svg')} 
              style={styles.phoneImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
        
        {/* Scroll indicator */}
        <ScrollIndicator />
      </View>
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    paddingBottom: 100, // Increased for scroll indicator
    width: '100%',
    position: 'relative',
    zIndex: 1, // Ensure content appears above the background
  },
  auroraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  aurora1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: '200%',
    height: '130%',
    borderRadius: 500,
    backgroundColor: 'rgba(0, 186, 136, 0.25)',
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
    opacity: 0.8,
    transform: [{ rotate: '-5deg' }],
  },
  aurora2: {
    position: 'absolute',
    top: '30%',
    left: -200,
    width: '200%',
    height: '100%',
    borderRadius: 500,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
    opacity: 0.7,
    transform: [{ rotate: '10deg' }],
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  contentContainer: {
    marginBottom: 20,
  },
  headline: {
    fontSize: Platform.OS === 'web' ? 48 : 36, // Larger headline
    fontWeight: '800',
    color: '#0B2C3D', // Darker for better contrast
    marginBottom: 24,
    lineHeight: Platform.OS === 'web' ? 58 : 46,
  },
  subHeadline: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#374151', // Darker for better contrast
    marginBottom: 32,
    lineHeight: Platform.OS === 'web' ? 28 : 24,
    maxWidth: 600,
  },
  webText: {
    color: '#FFFFFF', // White text for dark 3D background on web
    textShadow: '0 0 10px rgba(77, 255, 170, 0.5)'
  },
  webSecondaryText: {
    color: '#4dffaa', // Green text for the secondary CTA on web
    textShadow: '0 0 5px rgba(77, 255, 170, 0.5)'
  },
  textLeft: {
    textAlign: 'left',
  },
  textCenter: {
    textAlign: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneImage: {
    width: '100%',
    height: 520,
    maxWidth: 598,
  },
  ctaButton: {
    backgroundColor: '#00BA88',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#059669',
        },
      },
    }),
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  secondaryCTA: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryCTAText: {
    color: '#00BA88',
    fontWeight: '500',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HeroSection; 