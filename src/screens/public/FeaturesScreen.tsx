import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
  ImageBackground,
  Animated,
  ImageSourcePropType,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useInView } from 'react-intersection-observer';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/LandingPage/Header';
import Footer from '../../components/LandingPage/Footer';
import FinalCTASection from '../../components/LandingPage/FinalCTASection';

// Constants for styling
const COLORS = {
  primary: '#00BA88',
  primaryDark: '#059669',
  textDark: '#111827',
  textLight: '#6B7280',
  textGray: '#333333',
  white: '#FFFFFF',
  background: '#F3F4F6', // Lighter gray background color (changed from #EAEDF0)
  backgroundAlt: '#FFFFFF',
  tagBackground: '#E6F7F2',
  heroBackground: '#F0FDF9',
};

type ScreenName = keyof RootStackParamList;

// Category Tag Component with type annotation
const CategoryTag = ({ text }: { text: string }) => (
  <View style={styles.categoryTag}>
    <Text style={styles.categoryTagText}>{text}</Text>
  </View>
);

// Consistent shadow style to use throughout the features page
const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  android: {
    elevation: 10,
  },
  web: {
    boxShadow: '6px 8px 15px rgba(0, 0, 0, 0.1)',
  }
});

// Define props type for FeatureSection
interface FeatureSectionProps {
  categoryTitle?: string;
  title: string;
  description?: string;
  bullets?: string[];
  image: ImageSourcePropType;
  imageOnRight?: boolean;
  backgroundColor?: string;
  componentPath?: string;
}

// Feature section component with image and content side by side (or stacked on mobile)
const FeatureSection = (props: FeatureSectionProps) => {
  const { 
    categoryTitle, 
    title, 
    description,
    bullets, 
    image, 
    imageOnRight = true,
    backgroundColor = COLORS.backgroundAlt,
    componentPath
  } = props;
  
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Using react-intersection-observer to detect when component is visible
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  React.useEffect(() => {
    if (inView) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [inView]);

  return (
    <Animated.View 
      ref={ref}
      style={[
        styles.featureSection, 
        { backgroundColor },
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0]
        })}] },
        CARD_SHADOW
      ]}
    >
      <View style={styles.featureSectionInner}>
        {/* For desktop layout */}
        {isDesktop ? (
          <View style={imageOnRight ? styles.rowLayout : styles.rowReverseLayout}>
            <View style={styles.featureContent}>
              {categoryTitle && (
                <Text style={styles.featureCategoryTitle}>{categoryTitle}</Text>
              )}
              <Text style={styles.featureTitle}>{title}</Text>
              {description && (
                <Text style={styles.featureDescription}>{description}</Text>
              )}
              {bullets && bullets.length > 0 && (
                <View style={styles.featureBullets}>
                  {bullets.map((bullet: string, index: number) => (
                    <View key={index} style={styles.bulletItem}>
                      <MaterialIcons name="check-circle" size={20} color={COLORS.primary} style={styles.bulletIcon} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              )}
              {componentPath && (
                <Text style={styles.componentPath}>{componentPath}</Text>
              )}
            </View>
            <View style={styles.featureImageContainerDesktop}>
              <Image 
                source={image} 
                style={styles.featureImage} 
                resizeMode="contain"
              />
            </View>
          </View>
        ) : (
          // For mobile layout
          <View>
            <View style={styles.featureImageContainer}>
              <Image 
                source={image} 
                style={styles.featureImage} 
                resizeMode="contain"
              />
            </View>
            <View style={styles.featureContent}>
              {categoryTitle && (
                <Text style={styles.featureCategoryTitle}>{categoryTitle}</Text>
              )}
              <Text style={styles.featureTitle}>{title}</Text>
              {description && (
                <Text style={styles.featureDescription}>{description}</Text>
              )}
              {bullets && bullets.length > 0 && (
                <View style={styles.featureBullets}>
                  {bullets.map((bullet: string, index: number) => (
                    <View key={index} style={styles.bulletItem}>
                      <MaterialIcons name="check-circle" size={20} color={COLORS.primary} style={styles.bulletIcon} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              )}
              {componentPath && (
                <Text style={styles.componentPath}>{componentPath}</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// Define props type for FeatureCategoryHeader
interface FeatureCategoryHeaderProps {
  title: string;
  tagText: string;
  description: string;
}

// Feature category header with category tag
const FeatureCategoryHeader = ({ title, tagText, description }: FeatureCategoryHeaderProps) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Using react-intersection-observer to detect when component is visible
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  React.useEffect(() => {
    if (inView) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [inView]);

  return (
    <Animated.View 
      ref={ref}
      style={[
        styles.categoryHeader,
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0]
        })}] }
      ]}
    >
      <CategoryTag text={tagText} />
      <Text style={styles.categoryHeaderTitle}>{title}</Text>
      <Text style={styles.categoryHeaderDescription}>{description}</Text>
    </Animated.View>
  );
};

// Define props type for IntegrationIcon
interface IntegrationIconProps {
  icon: React.ComponentProps<typeof FontAwesome5>['name']; // Infer type from FontAwesome5
  name: string;
}

// Integration icon component
const IntegrationIcon = ({ icon, name }: IntegrationIconProps) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Using react-intersection-observer to detect when component is visible
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  React.useEffect(() => {
    if (inView) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [inView]);

  return (
    <Animated.View 
      ref={ref}
      style={[
        styles.integrationIcon,
        { opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1]
        })}] }
      ]}
    >
      <FontAwesome5 name={icon} size={64} color={COLORS.primary} />
      <Text style={styles.integrationName}>{name}</Text>
    </Animated.View>
  );
};

// Define props type for HeroFeatureCard
interface HeroFeatureCardProps {
  icon: React.ComponentProps<typeof MaterialIcons>['name']; // Infer type from MaterialIcons
  title: string;
  description: string;
}

// Hero feature card component
const HeroFeatureCard = ({ icon, title, description }: HeroFeatureCardProps) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Using react-intersection-observer to detect when component is visible
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  React.useEffect(() => {
    if (inView) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [inView]);

  return (
    <Animated.View 
      ref={ref}
      style={[
        styles.heroFeatureCard,
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0]
        })}] }
      ]}
    >
      <View style={styles.heroFeatureIconContainer}>
        <MaterialIcons name={icon} size={32} color={COLORS.primary} />
      </View>
      <Text style={styles.heroFeatureTitle}>{title}</Text>
      <Text style={styles.heroFeatureDescription}>{description}</Text>
    </Animated.View>
  );
};

// Shimmer Effect Component
const ShimmerEffect = () => {
  // Create evenly distributed positions with slight randomness
  const createRaindrops = () => {
    const drops = [];
    const count = 24;
    
    // Create evenly spaced segments across the full width (0-100%)
    for (let i = 0; i < count; i++) {
      // Calculate base position (0-100%)
      const basePosition = (i / count) * 100;
      // Add small randomness within the segment (±2%)
      const randomOffset = Math.random() * 4 - 2;
      
      drops.push({
        position: React.useRef(new Animated.Value(-200)).current,
        horizontalOffset: Math.max(0, Math.min(100, basePosition + randomOffset)), // Keep between 0-100%
        height: Math.random() * 70 + 40, // 40-110px drop height
        width: Math.random() * 2 + 2, // 2-4px width
        speed: Math.random() * 4000 + 3000, // 3-7 seconds duration
        splash: React.useRef(new Animated.Value(0)).current,
        splashOpacity: React.useRef(new Animated.Value(0)).current,
        // Random point where the raindrop will stop/"hit ground"
        landingPoint: Math.random() * 500 + 200 // 200-700px from top
      });
    }
    
    return drops;
  };
  
  // More raindrops for heavier rain, evenly distributed
  const raindrops = createRaindrops();
  
  React.useEffect(() => {
    const startRainAnimation = () => {
      raindrops.forEach(drop => {
        // Create raindrop falling animation
        const animateRaindrop = () => {
          // Reset splash animations
          drop.splash.setValue(0);
          drop.splashOpacity.setValue(0);
          
          // Animate raindrop falling
          Animated.timing(drop.position, {
            toValue: drop.landingPoint,
            duration: drop.speed,
            useNativeDriver: true,
          }).start(() => {
            // Create splash effect when drop lands
            Animated.parallel([
              // Expand splash
              Animated.timing(drop.splash, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
              }),
              // Fade out splash
              Animated.sequence([
                Animated.timing(drop.splashOpacity, {
                  toValue: 0.7,
                  duration: 100,
                  useNativeDriver: true,
                }),
                Animated.timing(drop.splashOpacity, {
                  toValue: 0,
                  duration: 600,
                  useNativeDriver: true,
                })
              ])
            ]).start(() => {
              // Reset raindrop to top with slight randomness
              drop.position.setValue(-200 - Math.random() * 300);
              // Slightly vary landing position for next iteration
              drop.landingPoint = Math.random() * 500 + 200;
              // Restart animation
              setTimeout(animateRaindrop, Math.random() * 500);
            });
          });
        };
        
        // Start with random delay for each drop
        setTimeout(animateRaindrop, Math.random() * 3000);
      });
    };
    
    startRainAnimation();
    
    return () => {
      // Clean up animations
      raindrops.forEach(drop => {
        drop.position.stopAnimation();
        drop.splash.stopAnimation();
        drop.splashOpacity.stopAnimation();
      });
    };
  }, []);

  return (
    <View style={styles.shimmerContainer}>
      {raindrops.map((drop, index) => (
        <React.Fragment key={index}>
          {/* Raindrop */}
          <Animated.View 
            style={[
              styles.raindropShimmer,
              { 
                left: `${drop.horizontalOffset}%`,
                height: drop.height,
                width: drop.width,
                transform: [{ translateY: drop.position }] 
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.raindropGradient}
            />
          </Animated.View>
          
          {/* Splash effect */}
          <Animated.View
            style={[
              styles.raindropSplash,
              {
                left: `${drop.horizontalOffset}%`,
                top: drop.landingPoint,
                opacity: drop.splashOpacity,
                transform: [
                  { scale: drop.splash.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 2.5]
                  })},
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
              style={styles.splashGradient}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        </React.Fragment>
      ))}
    </View>
  );
};

const FeaturesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const headerHeight = 80 + insets.top;
  
  const placeholderImage = require('../../assets/images/dashboard-preview.png');
  const logoImage = require('../../assets/images/logo.png');

  // --- Animation values for Hero Section ---
  const logoAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const headlineAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  // -----------------------------------------

  // --- Effect to trigger Hero animations on mount ---
  useEffect(() => {
    Animated.stagger(150, [
      // Logo animation (fade in + slight scale)
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Tagline animation (fade in + slide up)
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Headline animation (fade in + slide up)
      Animated.timing(headlineAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Subtitle animation (fade in + slide up)
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Buttons animation (spring in: flip, fade, slide) - Further slowed down
      Animated.spring(buttonsAnim, {
        toValue: 1,
        tension: 15, // Further reduced tension for even slower spring
        friction: 12, // Adjusted friction for smooth slow damping
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // Run once on mount
  // ---------------------------------------------

  const handleStartFreeTrial = () => {
    console.log('handleStartFreeTrial function called');
    console.log('Attempting navigation to Auth screen');
    try {
      navigation.navigate('Auth' as never);
      console.log('Navigation command executed');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header */}
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        {/* 2. Hero Section with Gradient Background */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, COLORS.background]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroBackground}
          >
            <View style={styles.heroContent}>
              <ShimmerEffect />
              {/* SiteSnap Logo - Animated */}
              <Animated.View 
                style={[
                  styles.logoContainer,
                  {
                    opacity: logoAnim,
                    transform: [
                      {
                        scale: logoAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1]
                        })
                      }
                    ]
                  }
                ]}
              >
                <Image 
                  source={logoImage}
                  style={styles.featureLogo}
                  resizeMode="contain"
                />
              </Animated.View>
              
              {/* Tagline - Animated */}
              <Animated.Text 
                style={[
                  styles.heroTagline, 
                  styles.heroTextColor,
                  {
                    opacity: taglineAnim,
                    transform: [
                      {
                        translateY: taglineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0] // Slide up from 20px below
                        })
                      }
                    ]
                  }
                ]}
              >
                Everything you need to succeed
              </Animated.Text>
              
              {/* Headline - Animated */}
              <Animated.Text 
                style={[
                  styles.heroHeadline, 
                  styles.heroTextColor,
                  {
                    opacity: headlineAnim,
                    transform: [
                      {
                        translateY: headlineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0] // Slide up from 30px below
                        })
                      }
                    ]
                  }
                ]}
              >
                Powerful features to streamline your project workflows
              </Animated.Text>
              
              {/* Subtitle - Animated */}
              <Animated.Text 
                style={[
                  styles.heroSubtitle, 
                  styles.heroTextColor,
                  {
                    opacity: subtitleAnim,
                    transform: [
                      {
                        translateY: subtitleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0] // Slide up from 30px below
                        })
                      }
                    ]
                  }
                ]}
              >
                SiteSnap combines powerful project management tools with intuitive photo 
                and document handling to keep your team organized and your projects on track.
              </Animated.Text>

              {/* Buttons - Animated */}
              <Animated.View 
                style={[
                  styles.heroButtons,
                  {
                    opacity: buttonsAnim,
                    transform: [
                      {
                        translateY: buttonsAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0]
                        })
                      },
                      {
                        rotateY: buttonsAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['-180deg', '0deg']
                        })
                      }
                    ]
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => {
                    console.log('Start Free Trial button clicked');
                    handleStartFreeTrial();
                  }}
                >
                  <Text style={styles.primaryButtonText}>Start Free Trial</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => { 
                    console.log('Book a Demo button clicked');
                    /* Add demo booking logic here */ 
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Book a Demo</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Project & Task Management Category Header */}
        <FeatureCategoryHeader 
          tagText="Core Features"
          title="Project & Task Management"
          description="Get complete visibility and control over your projects with powerful tools designed for construction and field service teams."
        />
        
        {/* 3.1.1 Dashboard Overview */}
        <FeatureSection 
          title="Dashboard Overview"
          description="Get a comprehensive view of all your projects in one place. Track progress, monitor deadlines, and stay on top of your team's performance with intuitive visualizations."
          bullets={[
            "Real-time project status cards",
            "Visual task progress bars",
            "Upcoming deadlines and milestones"
          ]}
          image={placeholderImage}
          imageOnRight={true}
          backgroundColor={COLORS.backgroundAlt}
        />
        
        {/* 3.1.2 Task Tracking */}
        <FeatureSection 
          title="Advanced Task Tracking"
          description="Our intuitive task management system helps you organize work, assign responsibilities, and track progress effortlessly with drag-and-drop simplicity."
          bullets={[
            "Intuitive drag-and-drop interface (Kanban/List)",
            "Instant status updates and assignments",
            "Integrated comment system for task discussions"
          ]}
          image={placeholderImage}
          imageOnRight={false}
          backgroundColor={COLORS.background}
        />
        
        {/* Document & Photo Management Category */}
        <FeatureCategoryHeader 
          tagText="Media Tools"
          title="Document & Photo Management"
          description="Capture, organize, and manage your project documentation with powerful tools designed for field efficiency."
        />
        
        {/* 3.2.1 Photo Upload & Organization */}
        <FeatureSection 
          title="Effortless Photo Upload & Organization"
          description="Capture, upload, and organize site photos with ease. Link images directly to projects and tasks, add annotations, and maintain a comprehensive visual record of your work."
          bullets={[
            "Upload photos directly from mobile or web",
            "Responsive grid view for easy browsing",
            "Powerful search and filtering options"
          ]}
          image={placeholderImage}
          imageOnRight={true}
          backgroundColor={COLORS.backgroundAlt}
        />
        
        {/* 3.2.2 Document Management */}
        <FeatureSection 
          title="Secure Document Management"
          description="Store, organize, and access all your project documents in one secure location. Fast file browsing and version tracking for quick and reliable document management."
          bullets={[
            "Upload various document types (PDF, DOCX, etc.)",
            "In-app document preview",
            "Track document versions and history"
          ]}
          image={placeholderImage}
          imageOnRight={false}
          backgroundColor={COLORS.background}
        />
        
        {/* Reporting & Analytics Category */}
        <FeatureCategoryHeader 
          tagText="Insights"
          title="Reporting & Analytics"
          description="Transform your project data into actionable insights with powerful reporting and analysis tools."
        />
        
        {/* 3.3.1 Report Generation */}
        <FeatureSection 
          title="Automated Report Generation"
          description="Transform your project data into professional reports with just a few clicks. Choose from customizable templates or create your own to match your exact requirements."
          bullets={[
            "Create professional PDF reports from templates",
            "Include charts and data visualizations",
            "Easy export and sharing options"
          ]}
          image={placeholderImage}
          imageOnRight={true}
          backgroundColor={COLORS.backgroundAlt}
        />
        
        {/* 3.3.2 Data Analysis */}
        <FeatureSection 
          title="Insightful Data Analysis"
          description="Gain valuable insights from your project data with interactive charts and visualizations. Identify trends, track performance metrics, and make informed decisions."
          bullets={[
            "Interactive charts for project trends",
            "Customizable date range and data filters",
            "Export raw data for further analysis"
          ]}
          image={placeholderImage}
          imageOnRight={false}
          backgroundColor={COLORS.background}
        />

        {/* Integration Section */}
        <Animated.View 
          ref={useInView({
            threshold: 0.1,
            triggerOnce: true,
            onChange: (inView) => {
              if (inView) {
                Animated.timing(new Animated.Value(0), {
                  toValue: 1,
                  duration: 1200,
                  delay: 200,
                  useNativeDriver: true,
                }).start();
              }
            }
          }).ref}
          style={styles.integrationSection}
        >
          <CategoryTag text="Integrations" />
          <Text style={styles.integrationTitle}>Connect Your Favorite Tools</Text>
          <Text style={styles.integrationDescription}>
            SiteSnap integrates seamlessly with the tools you already use, creating a centralized workflow for your team.
          </Text>
          
          <View style={styles.integrationGrid}>
            <IntegrationIcon icon="google-drive" name="Google Drive" />
            <IntegrationIcon icon="dropbox" name="Dropbox" />
            <IntegrationIcon icon="slack" name="Slack" />
            <IntegrationIcon icon="calendar" name="Google Calendar" />
            <IntegrationIcon icon="github" name="GitHub" />
            <IntegrationIcon icon="trello" name="Trello" />
          </View>
        </Animated.View>

        {/* Final CTA Section */}
        <FinalCTASection />

        {/* Footer */}
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  // Hero Section
  heroSection: {
    width: '100%',
  },
  heroBackground: {
    width: '100%',
  },
  heroOverlay: {
    width: '100%',
  },
  overlayGradient: {
    width: '100%',
  },
  heroContent: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  featureLogo: {
    width: 250,
    height: 120,
    resizeMode: 'contain',
  },
  heroTagline: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroHeadline: {
    fontSize: Platform.OS === 'web' ? 42 : 32,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
    maxWidth: 800,
    marginBottom: 20,
    lineHeight: Platform.OS === 'web' ? 52 : 42,
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 28,
    marginBottom: 40,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 60,
  },
  heroFeatureCards: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 20,
    maxWidth: 1000,
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  heroFeatureCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 24,
    width: Platform.OS === 'web' ? 300 : '100%',
    ...CARD_SHADOW,
    marginBottom: 20,
  },
  heroFeatureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.tagBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroFeatureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  heroFeatureDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  heroTextColor: {
    color: COLORS.white, // White text for better contrast on green overlay
  },
  // Introduction Section styles (retained but not used in new design)
  introSection: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  headline: {
    fontSize: Platform.OS === 'web' ? 36 : 28,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    maxWidth: 800,
    marginBottom: 16,
  },
  overviewText: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 26,
    marginBottom: 32,
  },
  introButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#047857', // More distinct darker green
          transform: 'translateY(-2px)',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)', // Slightly stronger shadow
        },
      },
      default: { 
        elevation: 2,
      }
    }),
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: COLORS.white, 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    borderWidth: 2, 
    borderColor: COLORS.primary, 
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#D1FAE5', // More distinct light green background
          transform: 'translateY(-2px)',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)', // Slightly stronger shadow
        },
      },
      default: { 
        elevation: 1,
      }
    }),
  },
  secondaryButtonText: {
    color: COLORS.primary, 
    fontWeight: '600',
    fontSize: 16,
  },
  // Category Tag
  categoryTag: {
    backgroundColor: COLORS.tagBackground,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryTagText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  // Category Header
  categoryHeader: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  categoryHeaderTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  categoryHeaderDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 24,
  },
  // Feature Sections
  featureSection: {
    width: '100%',
    paddingVertical: 64,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  featureSectionInner: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowReverseLayout: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    paddingHorizontal: 10,
    maxWidth: 540,
  },
  featureCategoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  featureDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureBullets: {
    marginTop: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 2,
    color: COLORS.primary,
  },
  bulletText: {
    fontSize: 16,
    color: COLORS.textGray,
    flex: 1,
  },
  componentPath: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 16,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  featureImageContainer: {
    width: '100%',
    marginBottom: 24,
  },
  featureImageContainerDesktop: {
    width: '45%',
    marginBottom: 0,
  },
  featureImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#E5E7EB', // Light background for placeholder images
    ...CARD_SHADOW
  },
  // Integration Section
  integrationSection: {
    width: '100%',
    paddingVertical: 64,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 'auto',
    maxWidth: '95%',
    marginBottom: 30,
    ...CARD_SHADOW
  },
  integrationTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  integrationDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: 700,
    marginBottom: 32,
    lineHeight: 24,
  },
  integrationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 1000,
    width: '100%',
  },
  integrationIcon: {
    alignItems: 'center',
    margin: 16,
    opacity: 0.7,
  },
  integrationName: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textLight,
  },
  // Shimmer Effect styles
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  raindropShimmer: {
    position: 'absolute',
    width: 4,
    height: 70,
    top: 0,
    bottom: 0,
  },
  raindropGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  raindropSplash: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 2,
  },
  splashGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

export default FeaturesScreen; 