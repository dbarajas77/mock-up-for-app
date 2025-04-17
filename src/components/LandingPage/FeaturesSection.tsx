import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Image from 'react-native/Libraries/Image/Image';

// Application guide colors
const appColors = {
  background: '#F8F9FB',     // Light gray-white for main background
  cardBg: '#FFFFFF',         // White for card backgrounds
  iconBg: '#4DA1B0',         // Teal-blue for icon backgrounds (legacy)
  textDark: '#222733',       // Dark text for titles
  textLight: '#6B7280',      // Gray for regular text
  primary: '#4AE3A7',        // Mint green for CTA
  header: '#3A8C98',         // Deeper teal for header areas
  border: '#E5E7EB',         // Light gray for borders
  // Add different blue variants
  blueVariants: {
    project: '#3B82F6',      // Bright blue
    report: '#1E40AF',       // Deep blue
    photo: '#4F46E5',        // Indigo blue
    task: '#2563EB',         // Royal blue
  },
  white: '#FFFFFF',
};

const featuresData = [
  {
    icon: 'dashboard',
    title: 'Project Management Hub',
    description: 'Manage all your projects in one central location with intuitive navigation and powerful organization tools.',
  },
  {
    icon: 'description',
    title: 'Automated Reporting',
    description: 'Transform project data into professional reports with just a few clicks using customizable templates.',
  },
  {
    icon: 'photo-library',
    title: 'Photo & Document Linking',
    description: 'Capture photos in the field and instantly link them to specific tasks, locations, or issues.',
  },
  {
    icon: 'check-circle',
    title: 'Task Tracking',
    description: 'Create, assign, and monitor tasks with powerful tracking features to keep your team aligned.',
  },
];

// Custom animated icons
const AnimatedProjectIcon = ({ animationProgress, color }) => {
  // Dashboard with multiple cards animation
  const card1Scale = animationProgress.interpolate({
    inputRange: [0, 0.3, 0.5, 1],
    outputRange: [0, 0.7, 0.9, 1]
  });

  const card2Scale = animationProgress.interpolate({
    inputRange: [0, 0.4, 0.6, 1],
    outputRange: [0, 0.7, 0.9, 1]
  });

  const card3Scale = animationProgress.interpolate({
    inputRange: [0, 0.5, 0.7, 1],
    outputRange: [0, 0.7, 0.9, 1]
  });

  const card4Scale = animationProgress.interpolate({
    inputRange: [0, 0.6, 0.8, 1],
    outputRange: [0, 0.7, 0.9, 1]
  });

  return (
    <View style={{ width: 56, height: 56, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background */}
      <View 
        style={{ 
          width: 50, 
          height: 50, 
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 8,
          position: 'absolute'
        }} 
      />
      
      {/* Dashboard cards */}
      <View style={{ 
        width: 50,
        height: 50,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignContent: 'space-between',
        padding: 4
      }}>
        <Animated.View style={{ 
          width: 20, 
          height: 20, 
          backgroundColor: 'white',
          borderRadius: 4,
          transform: [{ scale: card1Scale }]
        }} />
        <Animated.View style={{ 
          width: 20, 
          height: 20, 
          backgroundColor: 'white',
          borderRadius: 4,
          transform: [{ scale: card2Scale }]
        }} />
        <Animated.View style={{ 
          width: 20, 
          height: 20, 
          backgroundColor: 'white',
          borderRadius: 4,
          transform: [{ scale: card3Scale }]
        }} />
        <Animated.View style={{ 
          width: 20, 
          height: 20, 
          backgroundColor: 'white',
          borderRadius: 4,
          transform: [{ scale: card4Scale }]
        }} />
      </View>
    </View>
  );
};

const AnimatedReportIcon = ({ animationProgress, color }) => {
  // Paper sliding up animation
  const paperSlide = animationProgress.interpolate({
    inputRange: [0, 0.3, 0.5, 1],
    outputRange: [40, 15, 0, 0]
  });
  
  // Pie chart animation
  const pieRotation = animationProgress.interpolate({
    inputRange: [0, 0.5, 0.8, 1],
    outputRange: ['0deg', '120deg', '270deg', '360deg']
  });
  
  const pieOpacity = animationProgress.interpolate({
    inputRange: [0, 0.5, 0.6, 1],
    outputRange: [0, 0, 1, 1]
  });
  
  // Lines on document animation
  const line1Width = animationProgress.interpolate({
    inputRange: [0, 0.6, 0.7, 1],
    outputRange: [0, 0, 18, 18]
  });
  
  const line2Width = animationProgress.interpolate({
    inputRange: [0, 0.7, 0.8, 1],
    outputRange: [0, 0, 26, 26]
  });
  
  const line3Width = animationProgress.interpolate({
    inputRange: [0, 0.8, 0.9, 1],
    outputRange: [0, 0, 22, 22]
  });

  return (
    <View style={{ width: 56, height: 56, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      {/* Document paper */}
      <Animated.View 
        style={{ 
          width: 44,
          height: 50,
          backgroundColor: color,
          borderRadius: 6,
          transform: [{ translateY: paperSlide }],
          alignItems: 'center',
          paddingTop: 26,
          position: 'absolute'
        }}
      >
        {/* Text lines */}
        <Animated.View style={{ height: 3, width: line1Width, backgroundColor: 'white', marginBottom: 4, borderRadius: 1 }} />
        <Animated.View style={{ height: 3, width: line2Width, backgroundColor: 'white', marginBottom: 4, borderRadius: 1 }} />
        <Animated.View style={{ height: 3, width: line3Width, backgroundColor: 'white', borderRadius: 1 }} />
      </Animated.View>
      
      {/* Pie chart */}
      <Animated.View 
        style={{
          position: 'absolute',
          top: 8,
          width: 22,
          height: 22,
          borderRadius: 11,
          opacity: pieOpacity,
          transform: [{ rotate: pieRotation }],
          overflow: 'hidden'
        }}
      >
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'white' }} />
        <View style={{ 
          position: 'absolute', 
          width: 11, 
          height: 22, 
          backgroundColor: color, 
          right: 0 
        }} />
        <View style={{ 
          position: 'absolute', 
          width: 11, 
          height: 11, 
          backgroundColor: color, 
          left: 0,
          bottom: 0
        }} />
      </Animated.View>
    </View>
  );
};

const AnimatedPhotoIcon = ({ animationProgress, color }) => {
  // Camera body
  const cameraBodyScale = animationProgress.interpolate({
    inputRange: [0, 0.3, 0.5, 1],
    outputRange: [0, 0.7, 1, 1]
  });
  
  // Flash animation - fixed to have matching array lengths
  const flashOpacity = animationProgress.interpolate({
    inputRange: [0, 0.6, 0.65, 0.7, 1],
    outputRange: [0, 0, 1, 0, 0]
  });
  
  // Photo slide out
  const photoSlide = animationProgress.interpolate({
    inputRange: [0, 0.7, 0.9, 1],
    outputRange: [0, 0, 20, 20]
  });
  
  const photoOpacity = animationProgress.interpolate({
    inputRange: [0, 0.7, 0.8, 1],
    outputRange: [0, 0, 1, 1]
  });

  return (
    <View style={{ width: 56, height: 56, justifyContent: 'center', alignItems: 'center' }}>
      {/* Camera body */}
      <Animated.View 
        style={{ 
          width: 40, 
          height: 28, 
          backgroundColor: color,
          borderRadius: 4,
          transform: [{ scale: cameraBodyScale }],
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.5)'
        }}
      >
        {/* Lens */}
        <View style={{ 
          width: 16, 
          height: 16, 
          borderRadius: 8, 
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)'
        }} />
        
        {/* Flash */}
        <Animated.View style={{ 
          position: 'absolute', 
          top: -14,
          width: 40, 
          height: 40,
          borderRadius: 20, 
          backgroundColor: 'rgba(255,255,255,0.9)',
          opacity: flashOpacity
        }} />
      </Animated.View>
      
      {/* Photo coming out */}
      <Animated.View style={{ 
        position: 'absolute',
        bottom: 6,
        width: 32, 
        height: 24, 
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: color,
        transform: [{ translateY: photoSlide }],
        opacity: photoOpacity,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Simple image representation */}
        <View style={{ width: 24, height: 16, backgroundColor: color, opacity: 0.3, borderRadius: 2 }} />
      </Animated.View>
    </View>
  );
};

const AnimatedCheckIcon = ({ animationProgress, color }) => {
  // Task list with multiple items being checked off
  const listOpacity = animationProgress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1]
  });
  
  const check1Scale = animationProgress.interpolate({
    inputRange: [0, 0.4, 0.5, 1],
    outputRange: [0, 0, 1, 1]
  });
  
  const check2Scale = animationProgress.interpolate({
    inputRange: [0, 0.6, 0.7, 1],
    outputRange: [0, 0, 1, 1]
  });
  
  const check3Scale = animationProgress.interpolate({
    inputRange: [0, 0.8, 0.9, 1],
    outputRange: [0, 0, 1, 1]
  });

  return (
    <View style={{ width: 56, height: 56, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View 
        style={{ 
          width: 48, 
          height: 48, 
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 8,
          opacity: listOpacity,
          justifyContent: 'space-around',
          paddingVertical: 8,
          alignItems: 'center'
        }}
      >
        {/* Task items */}
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
          <View style={{ 
            width: 14, 
            height: 14, 
            borderRadius: 2, 
            borderWidth: 2, 
            borderColor: 'white',
            marginRight: 4,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Animated.View 
              style={{
                width: 8,
                height: 8,
                backgroundColor: 'white',
                borderRadius: 1,
                transform: [{ scale: check1Scale }]
              }}
            />
          </View>
          <View style={{ width: 20, height: 2, backgroundColor: 'white' }} />
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
          <View style={{ 
            width: 14, 
            height: 14, 
            borderRadius: 2, 
            borderWidth: 2, 
            borderColor: 'white',
            marginRight: 4,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Animated.View 
              style={{
                width: 8,
                height: 8,
                backgroundColor: 'white',
                borderRadius: 1,
                transform: [{ scale: check2Scale }]
              }}
            />
          </View>
          <View style={{ width: 16, height: 2, backgroundColor: 'white' }} />
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
          <View style={{ 
            width: 14, 
            height: 14, 
            borderRadius: 2, 
            borderWidth: 2, 
            borderColor: 'white',
            marginRight: 4,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Animated.View 
              style={{
                width: 8,
                height: 8,
                backgroundColor: 'white',
                borderRadius: 1,
                transform: [{ scale: check3Scale }]
              }}
            />
          </View>
          <View style={{ width: 24, height: 2, backgroundColor: 'white' }} />
        </View>
      </Animated.View>
  </View>
);
};

// Animated feature item component
const FeatureItem = ({ icon, title, description, index, isVisible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const iconAnimProgress = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isVisible) {
      // Determine exact animation order based on specific icons
      let animationOrder;
      switch(icon) {
        case 'dashboard': // Project Management Hub
          animationOrder = 0;
          break;
        case 'description': // Automated Reporting
          animationOrder = 1;
          break;
        case 'photo-library': // Photo & Document Linking
          animationOrder = 2;
          break;
        case 'check-circle': // Task Tracking
          animationOrder = 3;
          break;
        default:
          animationOrder = index;
      }
      
      // Use a consistent 250ms between features for exact timing
      const delay = animationOrder * 250;
      
      // Reset animation values
      iconAnimProgress.setValue(0);
      
      // Single animation with a fixed timeline
      Animated.sequence([
        // 1. First animate the card appearance
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            delay,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            delay,
            easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 500,
            delay,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
        ]),
        
        // 2. Then animate the icon - with a fixed delay after card animation
        Animated.timing(iconAnimProgress, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: false,
        })
      ]).start();
    } else {
      // Reset animations when not visible
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
      translateYAnim.setValue(20);
      iconAnimProgress.setValue(0);
    }
  }, [isVisible, index, icon, fadeAnim, scaleAnim, translateYAnim, iconAnimProgress]);

  // Render the appropriate animated icon based on the feature type
  const renderAnimatedIcon = () => {
    // Choose color based on the feature type
    let iconColor = '#FFFFFF';
    
    switch (icon) {
      case 'dashboard':
        iconColor = appColors.blueVariants.project;
        return <AnimatedProjectIcon animationProgress={iconAnimProgress} color={iconColor} />;
      case 'description':
        iconColor = appColors.blueVariants.report;
        return <AnimatedReportIcon animationProgress={iconAnimProgress} color={iconColor} />;
      case 'photo-library':
        iconColor = appColors.blueVariants.photo;
        return <AnimatedPhotoIcon animationProgress={iconAnimProgress} color={iconColor} />;
      case 'check-circle':
        iconColor = appColors.blueVariants.task;
        return <AnimatedCheckIcon animationProgress={iconAnimProgress} color={iconColor} />;
      default:
        return <MaterialIcons name={icon} size={32} color={iconColor} />;
    }
  };

  // Add more granular screen size breakpoints
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isSmallTablet = width >= 576 && width < 768;
  const isMobile = width < 576;
  const isExtraSmallScreen = width < 360;
  
  return (
    <Animated.View
      style={[
        styles.featureItem,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim }
          ],
        }
      ]}
    >
      <View style={[
        styles.featureItemContent,
        (isTablet || isSmallTablet) && styles.featureItemContentTablet,
        isMobile && styles.featureItemContentMobile,
        isExtraSmallScreen && styles.featureItemContentExtraSmall
      ]}>
        <View style={[
          styles.iconContainer,
          isTablet && styles.iconContainerTablet,
          isSmallTablet && styles.iconContainerSmallTablet,
          isMobile && styles.iconContainerMobile,
          isExtraSmallScreen && styles.iconContainerExtraSmall,
          { 
            backgroundColor: icon === 'dashboard' ? appColors.blueVariants.project :
                             icon === 'description' ? appColors.blueVariants.report :
                             icon === 'photo-library' ? appColors.blueVariants.photo :
                             icon === 'check-circle' ? appColors.blueVariants.task :
                             appColors.iconBg 
          }
        ]}>
          {renderAnimatedIcon()}
        </View>
        
        <View style={[
          styles.textContainer,
          (isTablet || isSmallTablet) && styles.textContainerTablet,
          isMobile && styles.textContainerMobile,
          isExtraSmallScreen && styles.textContainerExtraSmall
        ]}>
          <Text style={[
            styles.featureTitle,
            (isTablet || isSmallTablet) && styles.featureTitleTablet,
            isMobile && styles.featureTitleMobile,
            isExtraSmallScreen && styles.featureTitleExtraSmall
          ]}>{title}</Text>
          <Text style={[
            styles.featureDescription,
            (isTablet || isSmallTablet) && styles.featureDescriptionTablet,
            isMobile && styles.featureDescriptionMobile,
            isExtraSmallScreen && styles.featureDescriptionExtraSmall
          ]}>{description}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const FeaturesSection = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isSmallTablet = width >= 600 && width < 768;
  const isMobile = width < 600;
  const isExtraSmallScreen = width < 360;
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  // Animation values
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const subtitleAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const buttonScaleAnimation = useRef(new Animated.Value(1)).current;

  // Memoize the animated style objects to prevent recreation on each render
  const logoAnimStyle = useMemo(() => ({
    opacity: titleAnimation,
    transform: [
      {
        scale: titleAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1]
        })
      }
    ]
  }), [titleAnimation]);

  const taglineAnimStyle = useMemo(() => ({
    opacity: subtitleAnimation,
    transform: [
      {
        translateY: subtitleAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })
      }
    ]
  }), [subtitleAnimation]);

  const headlineAnimStyle = useMemo(() => ({
    opacity: titleAnimation,
    transform: [
      {
        translateY: titleAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0]
        })
      }
    ]
  }), [titleAnimation]);

  const subtitleAnimStyle = useMemo(() => ({
    opacity: subtitleAnimation,
    transform: [
      {
        translateY: subtitleAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0]
        })
      }
    ]
  }), [subtitleAnimation]);

  const buttonsAnimStyle = useMemo(() => ({
    opacity: buttonAnimation,
    transform: [
      {
        translateY: buttonAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0]
        })
      },
      {
        rotateY: buttonAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['-180deg', '0deg']
        })
      }
    ]
  }), [buttonAnimation]);

  // Trigger animations function
  const startAnimations = () => {
    // Reset animation values
    titleAnimation.setValue(0);
    subtitleAnimation.setValue(0);
    buttonAnimation.setValue(0);

    // Start the staggered animation sequence
    Animated.sequence([
      // Title animation with spring effect
      Animated.spring(titleAnimation, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      // Subtitle animation
      Animated.timing(subtitleAnimation, {
        toValue: 1,
        duration: 800,
        delay: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Button animation with bounce
      Animated.spring(buttonAnimation, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Initial animation on mount
  useEffect(() => {
    // Start animations immediately on mount
    startAnimations();

    // Setup Intersection Observer only for web
    if (Platform.OS === 'web') {
      let wasIntersecting = false; // Track previous state

      const observer = new IntersectionObserver(
        (entries) => {
          const isIntersecting = entries[0].isIntersecting;
          setIsVisible(isIntersecting); // Still need to update state for FeatureItem
          
          // Only restart animations if it becomes visible *after* being hidden
          if (isIntersecting && !wasIntersecting) {
            startAnimations();
          }
          wasIntersecting = isIntersecting; // Update previous state
        },
        { 
          threshold: 0.2, // Trigger when 20% is visible
          rootMargin: '0px 0px -100px 0px' // Adjust trigger margin
        }
      );

      const currentRef = sectionRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      // Cleanup observer on unmount
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }
    // No specific cleanup needed for non-web platforms
  }, []); // Empty dependency array ensures this runs only once on mount

  // Button hover/press animation
  const handlePressIn = () => {
    Animated.spring(buttonScaleAnimation, {
      toValue: 0.95,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScaleAnimation, {
      toValue: 1,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleStartFreeTrial = () => {
    navigation.navigate('Auth', { screen: 'SignUp' });
  };

  return (
    <View 
      style={styles.outerContainer}
      ref={sectionRef}
    >
      {/* Section divider */}
      <View style={styles.sectionDivider} />
      
      <View style={[
        styles.container,
        isTablet && styles.containerTablet,
        isSmallTablet && styles.containerSmallTablet,
        isMobile && styles.containerMobile,
        isExtraSmallScreen && styles.containerExtraSmall
      ]}>
        <View style={[
          styles.headerContainer,
          (isTablet || isSmallTablet) && styles.headerContainerTablet,
          isMobile && styles.headerContainerMobile,
          isExtraSmallScreen && styles.headerContainerExtraSmall
        ]}>
          <Animated.Text 
            style={[
              styles.sectionTitle,
              (isTablet || isSmallTablet) && styles.sectionTitleTablet,
              isMobile && styles.sectionTitleMobile,
              isExtraSmallScreen && styles.sectionTitleExtraSmall,
              {
                opacity: titleAnimation,
                transform: [
                  { 
                    translateY: titleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    })
                  },
                  {
                    scale: titleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    })
                  }
                ]
              }
            ]}
          >
            Key Features
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.sectionSubtitle,
              (isTablet || isSmallTablet) && styles.sectionSubtitleTablet,
              isMobile && styles.sectionSubtitleMobile,
              isExtraSmallScreen && styles.sectionSubtitleExtraSmall,
              {
                opacity: subtitleAnimation,
                transform: [
                  { 
                    translateY: subtitleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    })
                  }
                ]
              }
            ]}
          >
            Everything you need to manage projects efficiently
          </Animated.Text>

          <Animated.View
            style={[
              {
                opacity: buttonAnimation,
                transform: [
                  { 
                    translateY: buttonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    })
                  },
                  { scale: buttonScaleAnimation }
                ]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.bookDemoButton}
              onPress={handleStartFreeTrial}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.bookDemoButtonText}>Start Free Trial</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        <View style={[
          styles.gridContainer, 
          isDesktop && styles.gridContainerDesktop,
          isTablet && styles.gridContainerTablet,
          isSmallTablet && styles.gridContainerSmallTablet,
          isMobile && styles.gridContainerMobile
        ]}>
          {featuresData.map((feature, index) => (
            <FeatureItem 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.exploreButton,
            (isMobile || isExtraSmallScreen) && styles.exploreButtonMobile
          ]}
          onPress={() => navigation.navigate('Features')}
        >
          <Text style={[
            styles.exploreButtonText,
            (isMobile || isExtraSmallScreen) && styles.exploreButtonTextMobile
          ]}>Explore All Features</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
      
      {/* Bottom section divider */}
      <View style={styles.bottomSectionDivider} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: appColors.background,
  },
  sectionDivider: {
    width: '100%',
    height: 6,
    backgroundColor: appColors.header,
    opacity: 0.4,
  },
  bottomSectionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: appColors.border,
  },
  container: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  containerTablet: {
    paddingVertical: 60,
    paddingHorizontal: 16,
  },
  containerSmallTablet: {
    paddingVertical: 50,
    paddingHorizontal: 8, // Reduced padding for ~597px screens
    maxWidth: '100%',
  },
  containerMobile: {
    paddingVertical: 40,
    paddingHorizontal: 4,
  },
  containerExtraSmall: {
    paddingHorizontal: 2, // Minimal padding for extra small screens
  },
  headerContainer: {
    marginBottom: 48,
    maxWidth: 800,
    width: '100%',
    alignItems: 'center',
  },
  headerContainerTablet: {
    marginBottom: 40,
    maxWidth: '100%',
    paddingHorizontal: 16,
  },
  headerContainerMobile: {
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  headerContainerExtraSmall: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: appColors.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitleTablet: {
    fontSize: 32,
    marginBottom: 14,
  },
  sectionTitleMobile: {
    fontSize: 28,
    marginBottom: 12,
  },
  sectionTitleExtraSmall: {
    fontSize: 24,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: appColors.textLight,
    textAlign: 'center',
    maxWidth: 600,
  },
  sectionSubtitleTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionSubtitleMobile: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionSubtitleExtraSmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  gridContainer: {
    width: '100%',
  },
  gridContainerDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  gridContainerTablet: {
    flexDirection: 'column', // Stack cards vertically on tablet
    gap: 20,
    alignItems: 'center',
    width: '100%',
  },
  gridContainerSmallTablet: {
    flexDirection: 'column',
    gap: 18,
    alignItems: 'center',
    width: '100%',
    maxWidth: 550, // Constrain width at this breakpoint
  },
  gridContainerMobile: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  featureItem: {
    padding: 24,
    borderRadius: 12,
    // Set base width only for non-web platforms here
    width: Platform.OS !== 'web' ? '100%' : undefined,
    backgroundColor: appColors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    ...Platform.select({
      web: {
        // Define default web width here (for desktop)
        width: 'calc(50% - 12px)', 
        transition: 'transform 0.5s ease, box-shadow 0.5s ease, scale 0.5s ease',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        // Media queries will override the default web width above
        '@media (max-width: 1023px)': { // Tablet
          width: 'calc(100% - 32px)', 
          maxWidth: 650, 
          marginHorizontal: 16,
        },
        '@media (max-width: 767px)': { // Small Tablet
          width: 'calc(100% - 16px)',
          marginHorizontal: 8,
          padding: 20,
        },
        '@media (max-width: 576px)': { // Mobile - FIXED width
          width: '300px', 
          marginHorizontal: 'auto', 
          padding: 20,
        },
        '@media (max-width: 360px)': { // Extra Small - FIXED width
          width: '300px', 
          marginHorizontal: 'auto', 
          padding: 16,
        },
        ':hover': {
          transform: 'translateY(-10px)',
          scale: 1.02,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.06)',
        }
      },
    }),
  },
  featureItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureItemContentTablet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureItemContentMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureItemContentExtraSmall: {
    paddingVertical: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  textContainerTablet: {
    flex: 1,
    marginLeft: 16,
  },
  textContainerMobile: {
    marginLeft: 0,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  textContainerExtraSmall: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: appColors.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerTablet: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  iconContainerSmallTablet: {
    width: 76,
    height: 76,
    marginRight: 14,
  },
  iconContainerMobile: {
    marginRight: 0,
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 16,
  },
  iconContainerExtraSmall: {
    width: 70, // Slightly smaller on very small screens
    height: 70,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: appColors.textDark,
    marginBottom: 12,
  },
  featureTitleTablet: {
    fontSize: 20,
    textAlign: 'left',
  },
  featureTitleMobile: {
    textAlign: 'center',
    fontSize: 20,
  },
  featureTitleExtraSmall: {
    fontSize: 18,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: appColors.textLight,
    lineHeight: 24,
    ...(Platform.OS === 'web' ? { 
      '@media (max-width: 768px)': {
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 22,
      }
    } : { 
      textAlign: 'center' 
    })
  },
  featureDescriptionTablet: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'left',
  },
  featureDescriptionMobile: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  featureDescriptionExtraSmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  exploreButton: {
    marginTop: 48,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: appColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreButtonTablet: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  exploreButtonMobile: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  exploreButtonTextTablet: {
    fontSize: 14,
  },
  exploreButtonTextMobile: {
    fontSize: 14,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  bookDemoButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      }
    }),
  },
  bookDemoButtonText: {
    color: appColors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FeaturesSection; 