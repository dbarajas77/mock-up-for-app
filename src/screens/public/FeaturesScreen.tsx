import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Platform,
  useWindowDimensions,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const COLORS = {
  primary: '#10B981',
  primaryDark: '#059669',
  textDark: '#111827',
  textLight: '#6B7280',
  white: '#FFFFFF',
  background: '#F9FAFB',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// Feature Category Component
const FeatureCategory = ({ title, description, features, icon }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(0.98);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.featureCategory, animatedStyle]}>
      <FontAwesome5 name={icon} size={32} color={COLORS.primary} />
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categoryDescription}>{description}</Text>
      <View style={styles.featuresList}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const FeaturesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 100],
        [1, 0.9],
        Extrapolate.CLAMP
      ),
      backgroundColor: COLORS.white,
    };
  });

  const featureCategories = [
    {
      title: 'Project & Task Management',
      description: 'Comprehensive tools for managing projects and tasks efficiently',
      icon: 'tasks',
      features: [
        'Project status cards with real-time updates',
        'Task progress tracking with visual indicators',
        'Advanced date management and scheduling',
        'Drag-and-drop task organization',
        'Real-time comments and collaboration'
      ]
    },
    {
      title: 'Document & Photo Management',
      description: 'Seamless organization of project documentation and media',
      icon: 'images',
      features: [
        'Multi-platform photo upload support',
        'Intelligent photo organization',
        'Document version control',
        'Advanced search and filtering',
        'Secure file sharing'
      ]
    },
    {
      title: 'Reporting & Analytics',
      description: 'Generate insights and reports with powerful analytics tools',
      icon: 'chart-bar',
      features: [
        'Custom report templates',
        'Interactive data visualization',
        'Export in multiple formats',
        'Real-time analytics dashboard',
        'Automated report generation'
      ]
    },
    {
      title: 'Team Collaboration',
      description: 'Foster teamwork with integrated collaboration features',
      icon: 'users',
      features: [
        'Role-based access control',
        'Team organization tools',
        'Real-time chat system',
        'Notification management',
        'File sharing and collaboration'
      ]
    }
  ];

  const integrations = [
    { name: 'Google Drive', icon: 'google-drive' },
    { name: 'Dropbox', icon: 'dropbox' },
    { name: 'Slack', icon: 'slack' },
    { name: 'Google Calendar', icon: 'calendar' }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
            <Text style={styles.logoText}>SiteSnap</Text>
          </TouchableOpacity>
          
          {width > 768 && (
            <View style={styles.navLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
                <Text style={styles.navLink}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Features')}>
                <Text style={[styles.navLink, styles.activeNavLink]}>Features</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Pricing')}>
                <Text style={styles.navLink}>Pricing</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Resources')}>
                <Text style={styles.navLink}>Resources</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Support')}>
                <Text style={styles.navLink}>Support</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.authButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'Login' })}>
              <Text style={styles.loginButton}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.signupButton}
              onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <AnimatedScrollView
        style={styles.scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Introduction Section */}
        <View style={[styles.introSection, { paddingTop: 100 + insets.top }]}>
          <Animated.Text style={styles.headline}>
            Transform Your Project Management{'\n'}
            with <Text style={{ color: COLORS.primary }}>Powerful Tools</Text>
          </Animated.Text>
          <Text style={styles.overview}>
            Streamline project management, automate reporting, and enhance team collaboration 
            with our comprehensive suite of tools
          </Text>
        </View>

        {/* Feature Categories */}
        <View style={styles.featuresGrid}>
          {featureCategories.map((category, index) => (
            <FeatureCategory key={index} {...category} />
          ))}
        </View>

        {/* Integration Section */}
        <View style={styles.integrationSection}>
          <Text style={styles.sectionTitle}>Seamless Integrations</Text>
          <Text style={styles.sectionDescription}>
            Connect with your favorite tools and services
          </Text>
          <View style={styles.integrationsGrid}>
            {integrations.map((integration, index) => (
              <View key={index} style={styles.integrationItem}>
                <FontAwesome5 name={integration.icon} size={32} color={COLORS.primary} />
                <Text style={styles.integrationName}>{integration.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Call-to-Action Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaTitle}>Ready to Streamline Your Projects?</Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}
            >
              <Text style={styles.ctaButtonText}>Start Free Trial</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Footer */}
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
    backgroundColor: COLORS.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  navLink: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  activeNavLink: {
    color: COLORS.primary,
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  loginButton: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signupButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  introSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 60,
  },
  headline: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 24,
  },
  overview: {
    fontSize: 18,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 28,
  },
  featuresGrid: {
    padding: 20,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  featureCategory: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: Platform.OS === 'web' ? '45%' : '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  integrationSection: {
    padding: 40,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 40,
    textAlign: 'center',
  },
  integrationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  integrationItem: {
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    width: 120,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  integrationName: {
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  ctaSection: {
    padding: 40,
  },
  ctaGradient: {
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 32,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
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

export default FeaturesScreen; 