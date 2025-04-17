import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  HeroSection,
  ProblemSolutionSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  PricingSection,
  FinalCTASection,
  Footer
} from '../../components/LandingPage';

const LandingScreen = () => {
  const insets = useSafeAreaInsets();
  // Estimate header height: ~80px + safeArea top inset
  const headerHeight = 80 + insets.top;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FinalCTASection />
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingTop: 80, // Adjusted for header
    flexGrow: 1,
    width: '100%',
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