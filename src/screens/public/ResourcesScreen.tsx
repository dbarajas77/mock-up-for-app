import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  TextInput,
  FlatList,
  StyleSheet as CoreStyleSheet,
  Animated as CoreAnimated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/LandingPage/Header';

const COLORS = {
  primary: '#10B981',
  primaryDark: '#059669',
  textDark: '#111827',
  textLight: '#6B7280',
  white: '#FFFFFF',
  background: '#F9FAFB',
  border: '#E5E7EB',
  backgroundAlt: '#F1F3F5',
  text: '#1A1A1A',
  success: '#28A745',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// SearchBar Component
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    onSearch(text);
  }, [onSearch]);

  return (
    <View style={styles.searchContainer}>
      <MaterialIcons name="search" size={24} color={COLORS.textLight} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search resources..."
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor={COLORS.textLight}
      />
    </View>
  );
};

// DocumentationCard Component
const DocumentationCard = ({ title, description, icon, onPress }) => {
  const scale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.docCard, cardStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.docCardContent}
      >
        <MaterialIcons name={icon} size={32} color={COLORS.primary} />
        <Text style={styles.docCardTitle}>{title}</Text>
        <Text style={styles.docCardDescription}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// TutorialCard Component
const TutorialCard = ({ title, duration, difficulty, thumbnail, onPress }) => {
  return (
    <TouchableOpacity style={styles.tutorialCard} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnail}>
          <MaterialIcons name="play-circle-filled" size={48} color={COLORS.white} />
        </View>
        <View style={styles.duration}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>
      <Text style={styles.tutorialTitle}>{title}</Text>
      <View style={[styles.difficultyBadge, styles[`difficulty${difficulty}`]]}>
        <Text style={styles.difficultyText}>{difficulty}</Text>
      </View>
    </TouchableOpacity>
  );
};

// <<< START COPIED ShimmerEffect CODE >>>
const shimmerStyles = CoreStyleSheet.create({
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

const ShimmerEffect = () => {
  const [raindrops, setRaindrops] = useState([]);
  const screenHeight = useWindowDimensions().height;

  const createRaindrops = () => {
    const drops = [];
    const numDrops = 30;
    for (let i = 0; i < numDrops; i++) {
      drops.push({
        id: i,
        horizontalOffset: Math.random() * 100,
        height: Math.random() * 50 + 40,
        width: Math.random() * 2 + 2,
        position: new CoreAnimated.Value(- (Math.random() * screenHeight * 0.5 + 50)),
        splash: new CoreAnimated.Value(0),
        splashOpacity: new CoreAnimated.Value(0),
        delay: Math.random() * 5000,
        duration: Math.random() * 1500 + 1000,
        landingPoint: screenHeight * (Math.random() * 0.3 + 0.6),
      });
    }
    setRaindrops(drops);
    return drops;
  };

  React.useEffect(() => {
    const drops = createRaindrops();

    const startRainAnimation = (drop) => {
      const animateRaindrop = () => {
        drop.position.setValue(-drop.height);
        drop.splash.setValue(0);
        drop.splashOpacity.setValue(0);

        CoreAnimated.sequence([
          CoreAnimated.delay(drop.delay),
          CoreAnimated.timing(drop.position, {
            toValue: drop.landingPoint,
            duration: drop.duration,
            useNativeDriver: true,
          }),
          CoreAnimated.parallel([
            CoreAnimated.timing(drop.splash, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            CoreAnimated.timing(drop.splashOpacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          CoreAnimated.timing(drop.splashOpacity, {
            toValue: 0,
            duration: 300,
            delay: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
          drop.delay = Math.random() * 3000 + 1000;
          drop.duration = Math.random() * 1500 + 1000;
          animateRaindrop();
        });
      };
      animateRaindrop();
    };

    drops.forEach(drop => startRainAnimation(drop));

    return () => {
      raindrops.forEach(drop => {
        if (drop.position) drop.position.stopAnimation();
        if (drop.splash) drop.splash.stopAnimation();
        if (drop.splashOpacity) drop.splashOpacity.stopAnimation();
      });
    };
  }, []);

  return (
    <View style={shimmerStyles.shimmerContainer} pointerEvents="none">
      {raindrops.map((drop) => (
        <React.Fragment key={drop.id}>
          <CoreAnimated.View
            style={[
              shimmerStyles.raindropShimmer,
              {
                left: `${drop.horizontalOffset}%`,
                height: drop.height,
                width: drop.width,
                transform: [{ translateY: drop.position }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={shimmerStyles.raindropGradient}
            />
          </CoreAnimated.View>

          <CoreAnimated.View
            style={[
              shimmerStyles.raindropSplash,
              {
                left: `${drop.horizontalOffset}%`,
                top: drop.landingPoint,
                opacity: drop.splashOpacity,
                transform: [
                  {
                    scale: drop.splash.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 2.5],
                    }),
                  },
                ],
              },
            ]}
          >
             <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
              style={shimmerStyles.splashGradient}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
          </CoreAnimated.View>
        </React.Fragment>
      ))}
    </View>
  );
};
// <<< END COPIED ShimmerEffect CODE >>>

const ResourcesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const documentationSections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics and set up your first project',
      icon: 'school',
    },
    {
      title: 'User Guides',
      description: 'Detailed guides for all features',
      icon: 'book',
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      icon: 'code',
    },
    {
      title: 'Best Practices',
      description: 'Tips and tricks for optimal usage',
      icon: 'lightbulb',
    },
  ];

  const tutorials = [
    {
      title: 'Quick Start Tutorial',
      duration: '5:30',
      difficulty: 'Beginner',
      thumbnail: 'tutorial1.jpg',
    },
    {
      title: 'Advanced Project Setup',
      duration: '12:45',
      difficulty: 'Intermediate',
      thumbnail: 'tutorial2.jpg',
    },
    {
      title: 'Custom Reporting',
      duration: '8:15',
      difficulty: 'Advanced',
      thumbnail: 'tutorial3.jpg',
    },
  ];

  return (
    <View style={styles.container}>
      <Header />

      <AnimatedScrollView
        style={styles.scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, '#E0F2F1']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={CoreStyleSheet.absoluteFill}
          />
          <ShimmerEffect />

          <View style={{ zIndex: 1, alignItems: 'center' }}>
            <Text style={styles.headline}>Resources & Documentation</Text>
            <Text style={styles.subheadline}>Everything you need to succeed with SiteSnap</Text>
            <SearchBar onSearch={(query) => console.log('Search:', query)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documentation</Text>
          <View style={styles.documentationGrid}>
            {documentationSections.map((doc, index) => (
              <DocumentationCard
                key={index}
                title={doc.title}
                description={doc.description}
                icon={doc.icon}
                onPress={() => console.log('Navigate to:', doc.title)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Tutorials</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tutorialsScroll}
          >
            {tutorials.map((tutorial, index) => (
              <TutorialCard
                key={index}
                {...tutorial}
                onPress={() => console.log('Play tutorial:', tutorial.title)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer Resources</Text>
          <View style={styles.developerGrid}>
            <TouchableOpacity style={styles.developerCard}>
              <MaterialIcons name="api" size={32} color={COLORS.primary} />
              <Text style={styles.developerCardTitle}>API Reference</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.developerCard}>
              <MaterialIcons name="code" size={32} color={COLORS.primary} />
              <Text style={styles.developerCardTitle}>SDK Documentation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.developerCard}>
              <MaterialIcons name="integration-instructions" size={32} color={COLORS.primary} />
              <Text style={styles.developerCardTitle}>Integration Guides</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community</Text>
          <View style={styles.communityGrid}>
            <TouchableOpacity style={styles.communityCard}>
              <FontAwesome5 name="github" size={32} color={COLORS.primary} />
              <Text style={styles.communityCardTitle}>GitHub</Text>
              <Text style={styles.communityCardDescription}>
                Contribute to our open-source projects
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.communityCard}>
              <FontAwesome5 name="discord" size={32} color={COLORS.primary} />
              <Text style={styles.communityCardTitle}>Discord</Text>
              <Text style={styles.communityCardDescription}>
                Join our community chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.communityCard}>
              <FontAwesome5 name="stack-overflow" size={32} color={COLORS.primary} />
              <Text style={styles.communityCardTitle}>Stack Overflow</Text>
              <Text style={styles.communityCardDescription}>
                Get answers from the community
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Navigation</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
                <Text style={styles.footerLink}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Features')}>
                <Text style={styles.footerLink}>Features</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Pricing')}>
                <Text style={styles.footerLink}>Pricing</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Social</Text>
              <View style={styles.socialLinks}>
                {['twitter', 'linkedin', 'github'].map((platform, index) => (
                  <TouchableOpacity key={index} style={styles.socialIcon}>
                    <FontAwesome5 name={platform} size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </AnimatedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 80,
  },
  headline: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subheadline: {
    fontSize: 18,
    color: '#E0F2F1',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600,
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 600,
    marginTop: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  section: {
    padding: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 24,
  },
  documentationGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  docCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: Platform.OS === 'web' ? '45%' : '100%',
    maxWidth: 400,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  docCardContent: {
    alignItems: 'flex-start',
  },
  docCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  docCardDescription: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  tutorialsScroll: {
    marginHorizontal: -40,
    paddingHorizontal: 40,
  },
  tutorialCard: {
    width: 300,
    marginRight: 24,
  },
  thumbnailContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  thumbnail: {
    width: '100%',
    height: 169,
    backgroundColor: COLORS.backgroundAlt,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: COLORS.white,
    fontSize: 12,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyBeginner: {
    backgroundColor: COLORS.success,
  },
  difficultyIntermediate: {
    backgroundColor: '#F59E0B',
  },
  difficultyAdvanced: {
    backgroundColor: '#EF4444',
  },
  difficultyText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  developerGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 24,
    justifyContent: 'center',
  },
  developerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: Platform.OS === 'web' ? '30%' : '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  developerCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 16,
    textAlign: 'center',
  },
  communityGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 24,
    justifyContent: 'center',
  },
  communityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: Platform.OS === 'web' ? '30%' : '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  communityCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  communityCardDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: COLORS.background,
    padding: 40,
  },
  footerContent: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: 40,
  },
  footerSection: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 24,
  },
  footerLink: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
});

export default ResourcesScreen; 