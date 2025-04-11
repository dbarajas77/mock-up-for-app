import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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
  border: '#E5E7EB',
  backgroundAlt: '#F1F3F5',
  text: '#1A1A1A',
  success: '#28A745',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// ContactForm Component
const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = () => {
    console.log('Form submitted:', form);
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        placeholderTextColor={COLORS.textLight}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
        placeholderTextColor={COLORS.textLight}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={form.subject}
        onChangeText={(text) => setForm({ ...form, subject: text })}
        placeholderTextColor={COLORS.textLight}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Your Message"
        value={form.message}
        onChangeText={(text) => setForm({ ...form, message: text })}
        multiline
        numberOfLines={4}
        placeholderTextColor={COLORS.textLight}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

// SupportCard Component
const SupportCard = ({ icon, title, description, buttonText, onPress }) => {
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
    <Animated.View style={[styles.supportCard, cardStyle]}>
      <MaterialIcons name={icon} size={40} color={COLORS.primary} />
      <Text style={styles.supportCardTitle}>{title}</Text>
      <Text style={styles.supportCardDescription}>{description}</Text>
      <TouchableOpacity
        style={styles.supportCardButton}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.supportCardButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// FAQ Component
const FAQItem = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useSharedValue(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    height.value = withSpring(isExpanded ? 0 : 1);
  };

  const contentStyle = useAnimatedStyle(() => ({
    opacity: height.value,
    height: interpolate(
      height.value,
      [0, 1],
      [0, 120],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqQuestion} onPress={toggleExpand}>
        <Text style={styles.faqQuestionText}>{question}</Text>
        <MaterialIcons
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={COLORS.textDark}
        />
      </TouchableOpacity>
      <Animated.View style={[styles.faqAnswer, contentStyle]}>
        <Text style={styles.faqAnswerText}>{answer}</Text>
      </Animated.View>
    </View>
  );
};

const SupportScreen = () => {
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

  const supportOptions = [
    {
      icon: 'chat',
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      buttonText: 'Start Chat',
    },
    {
      icon: 'email',
      title: 'Email Support',
      description: 'Send us a message and we\'ll respond within 24 hours',
      buttonText: 'Send Email',
    },
    {
      icon: 'phone',
      title: 'Phone Support',
      description: 'Talk to our support team directly',
      buttonText: 'Call Now',
    },
  ];

  const faqs = [
    {
      question: 'How do I get started with SiteSnap?',
      answer: 'Sign up for a free account, create your first project, and follow our quick start guide to begin documenting your work.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and offer enterprise billing options for larger organizations.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your service will continue until the end of your billing period.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your data. All files are stored securely in the cloud.',
    },
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
                <Text style={styles.navLink}>Features</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Pricing')}>
                <Text style={styles.navLink}>Pricing</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Resources')}>
                <Text style={styles.navLink}>Resources</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Support')}>
                <Text style={[styles.navLink, styles.activeNavLink]}>Support</Text>
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
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { paddingTop: 100 + insets.top }]}>
          <Text style={styles.headline}>How Can We Help You?</Text>
          <Text style={styles.subheadline}>
            Get the support you need, when you need it
          </Text>
        </View>

        {/* Support Options */}
        <View style={styles.section}>
          <View style={styles.supportGrid}>
            {supportOptions.map((option, index) => (
              <SupportCard
                key={index}
                {...option}
                onPress={() => console.log('Support option:', option.title)}
              />
            ))}
          </View>
        </View>

        {/* Contact Form Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Us a Message</Text>
          <ContactForm />
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </View>
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
          <Text style={styles.copyright}>
            © 2024 SiteSnap. All rights reserved.
          </Text>
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
  heroSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  headline: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  subheadline: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 40,
    textAlign: 'center',
  },
  section: {
    padding: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 24,
    textAlign: 'center',
  },
  supportGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  supportCard: {
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
  supportCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  supportCardDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  supportCardButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  supportCardButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 600,
    marginHorizontal: 'auto',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.textDark,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  faqContainer: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    backgroundColor: COLORS.backgroundAlt,
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  faqAnswerText: {
    fontSize: 16,
    color: COLORS.textLight,
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
  copyright: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default SupportScreen; 