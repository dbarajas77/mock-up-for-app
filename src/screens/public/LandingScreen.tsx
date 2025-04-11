import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
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
import { StatusBar } from 'expo-status-bar';
import * as images from '../../assets/images';

// Define colors object that was missing
const COLORS = {
  primary: '#10B981',
  primaryDark: '#059669',
  textDark: '#111827',
  textLight: '#6B7280',
  white: '#FFFFFF',
  background: '#F9FAFB',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedText = ({ text, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // ease-out-expo
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.heroTitle,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
};

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const LandingScreen = () => {
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
      backgroundColor: '#ffffff',
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          <Text style={styles.logoText}>SiteSnap</Text>
          
          {width > 768 && (
            <View style={styles.navLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
                <Text style={[styles.navLink, styles.activeNavLink]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Features')}>
                <Text style={styles.navLink}>Features</Text>
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
            <TouchableOpacity 
              onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
            >
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
        <View style={[styles.heroSection, { paddingTop: 100 + insets.top }]}>
          <Text style={styles.heroTitle}>
            Transform Your{'\n'}
            Project Management{'\n'}
            <Text style={{ color: '#10B981' }}>Effortlessly</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Streamline your workflow, enhance collaboration, and deliver projects faster
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Features')}
            >
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add other sections here when needed */}
      </AnimatedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
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
    color: '#10B981',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  navLink: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  activeNavLink: {
    color: '#10B981',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  loginButton: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  secondaryButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
});

const problemSolutionData = [
  {
    icon: 'folder-open',
    title: 'Scattered Project Information?',
    problem: 'Projects spread across emails, shared drives, and paper notes cause confusion and delays.',
    solution: 'Centralize all project data in one intuitive platform, accessible to all team members in real-time.',
  },
  {
    icon: 'file-alt',
    title: 'Time-consuming Report Generation?',
    problem: 'Manual report creation takes hours away from critical project work and introduces errors.',
    solution: 'Automate report creation with customizable templates that pull directly from your project data.',
  },
  {
    icon: 'camera',
    title: 'Difficulty Tracking Photo Documentation?',
    problem: 'Photos disconnected from context lose their value for verification and compliance purposes.',
    solution: 'Link photos directly to tasks and locations with automatic tagging and organization features.',
  },
];

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

const stepsData = [
  {
    title: 'Create Project',
    description: 'Set up your project with all relevant details, locations, and team members in minutes.',
    image: require('../../assets/images/dashboard-preview.png'),
  },
  {
    title: 'Add Tasks & Photos',
    description: 'Document your work with photos and organize them by task, location, or custom categories.',
    image: require('../../assets/images/dashboard-preview.png'),
  },
  {
    title: 'Generate Report',
    description: 'Create professional reports with a few clicks using your project data and documentation.',
    image: require('../../assets/images/dashboard-preview.png'),
  },
  {
    title: 'Share & Collaborate',
    description: 'Instantly share reports with stakeholders and collaborate with your team in real-time.',
    image: require('../../assets/images/dashboard-preview.png'),
  },
];

const testimonialsData = [
  {
    text: "SiteSnap has transformed how we manage our construction projects. Report generation that used to take hours now takes minutes.",
    name: "Sarah Johnson",
    role: "Project Manager, BuildCorp Inc.",
    image: require('../../assets/images/dashboard-preview.png'),
  },
  {
    text: "The ability to link photos directly to tasks and locations has eliminated confusion and improved our compliance documentation.",
    name: "Michael Chen",
    role: "Operations Director, Elite Inspections",
    image: require('../../assets/images/dashboard-preview.png'),
  },
  {
    text: "Our team has seen a 40% reduction in documentation time. The automated reporting feature alone has paid for itself.",
    name: "Jessica Rivera",
    role: "Field Service Manager, TechMaintain Co.",
    image: require('../../assets/images/dashboard-preview.png'),
  },
];

const navigationLinks = [
  { title: 'Home', screen: 'Landing' },
  { title: 'Features', screen: 'Features' },
  { title: 'Pricing', screen: 'Pricing' },
  { title: 'Resources', screen: 'Resources' },
  { title: 'Support', screen: 'Support' },
];

const legalLinks = [
  'Privacy Policy',
  'Terms of Service',
  'Contact Us',
];

const socialLinks = [
  { icon: 'twitter', url: 'https://twitter.com/siteSnap' },
  { icon: 'linkedin', url: 'https://linkedin.com/company/siteSnap' },
  { icon: 'github', url: 'https://github.com/siteSnap' },
];

const companyLogos = Array(5).fill(require('../../assets/images/dashboard-preview.png'));

export default LandingScreen; 