import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  Platform,
  useWindowDimensions,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
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
  background: '#F9FAFB',
  backgroundAlt: '#FFFFFF',
  tagBackground: '#E6F7F2',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Category Tag component
const CategoryTag = ({ text }) => (
  <View style={styles.categoryTag}>
    <Text style={styles.categoryTagText}>{text}</Text>
  </View>
);

// Feature section component with image and content side by side (or stacked on mobile)
const FeatureSection = (props) => {
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

  return (
    <View style={[styles.featureSection, { backgroundColor }]}>
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
              <View style={styles.featureBullets}>
                {bullets.map((bullet, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <MaterialIcons name="check-circle" size={20} color={COLORS.primary} style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
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
              <View style={styles.featureBullets}>
                {bullets.map((bullet, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <MaterialIcons name="check-circle" size={20} color={COLORS.primary} style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
              {componentPath && (
                <Text style={styles.componentPath}>{componentPath}</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

// Feature category header with category tag
const FeatureCategoryHeader = ({ title, tagText, description }) => (
  <View style={styles.categoryHeader}>
    <CategoryTag text={tagText} />
    <Text style={styles.categoryHeaderTitle}>{title}</Text>
    <Text style={styles.categoryHeaderDescription}>{description}</Text>
  </View>
);

// Simple integration icon component
const IntegrationIcon = ({ icon, name }) => {
  return (
    <View style={styles.integrationIcon}>
      <FontAwesome5 name={icon} size={64} color={COLORS.primary} />
      <Text style={styles.integrationName}>{name}</Text>
    </View>
  );
};

const FeaturesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  // Estimate header height: ~80px + safeArea top inset
  const headerHeight = 80 + insets.top;
  
  // Mock images - use placeholder for now
  const placeholderImage = require('../../assets/images/dashboard-preview.png');
  
  return (
    <View style={styles.container}>
      {/* 1. Header */}
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        {/* 2. Introduction Section */}
        <View style={styles.introSection}>
          <Text style={styles.headline}>
            Transform Your Project Management with Powerful Tools
          </Text>
          
          <Text style={styles.overviewText}>
            Streamline project management, automate reporting, and enhance team collaboration 
            with our comprehensive suite of tools designed for construction teams, field service operators, and inspection agencies.
          </Text>

          <View style={styles.introButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Features')}
            >
              <Text style={styles.primaryButtonText}>Explore Features</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {}}
            >
              <Text style={styles.secondaryButtonText}>Book a Demo</Text>
            </TouchableOpacity>
          </View>
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
          componentPath="src/screens/projects/ProjectDashboard"
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
          componentPath="src/screens/tasks/TaskManager"
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
          componentPath="src/screens/media/PhotoGrid"
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
          componentPath="src/screens/documents/DocumentList"
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
          componentPath="src/screens/reports/ReportBuilder"
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
          componentPath="src/screens/analytics/AnalyticsDashboard"
        />
        
        {/* Team Collaboration Category */}
        <FeatureCategoryHeader 
          tagText="Collaboration"
          title="Team Collaboration"
          description="Enhance team coordination and communication with tools designed for seamless collaboration."
        />
        
        {/* 3.4.1 User Management */}
        <FeatureSection 
          title="Seamless User Management"
          description="Manage your team with ease. Assign roles, set permissions, and organize users into project-specific teams to maintain efficient workflows."
          bullets={[
            "Assign roles and permissions easily",
            "Organize users into project teams",
            "Control access to sensitive project data"
          ]}
          image={placeholderImage}
          imageOnRight={true}
          backgroundColor={COLORS.backgroundAlt}
          componentPath="src/screens/team/TeamManagement"
        />
        
        {/* 3.4.2 Communication Tools */}
        <FeatureSection 
          title="Integrated Communication Tools"
          description="Keep your team connected with built-in communication tools. Chat in real-time, receive notifications, and share files directly within the platform."
          bullets={[
            "Real-time chat for project discussions",
            "In-app notification system for updates",
            "Share files directly within conversations"
          ]}
          image={placeholderImage}
          imageOnRight={false}
          backgroundColor={COLORS.background}
          componentPath="src/screens/communication/ChatSystem"
        />
        
        {/* 4. Integration Section */}
        <View style={styles.integrationSection}>
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
        </View>
        
        {/* 5. Call-to-Action Section */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Ready to Streamline Your Projects?</Text>
          <Text style={styles.ctaDescription}>
            Join thousands of construction and field service teams who are already saving time and improving project outcomes with SiteSnap.
          </Text>
          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.ctaPrimaryButton} onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}>
              <Text style={styles.ctaPrimaryButtonText}>Start Free Trial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaSecondaryButton} onPress={() => navigation.navigate('Pricing')}>
              <Text style={styles.ctaSecondaryButtonText}>View Pricing</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 6. Footer */}
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
  // Introduction Section
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
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    // Shadow styles
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  // Integration Section
  integrationSection: {
    width: '100%',
    paddingVertical: 64,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
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
  // CTA Section
  ctaContainer: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: Platform.OS === 'web' ? 36 : 28,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: 700,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  ctaPrimaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  ctaPrimaryButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  ctaSecondaryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FeaturesScreen; 