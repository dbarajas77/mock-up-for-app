import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  useWindowDimensions,
  ScrollView,
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
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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

// Billing Toggle Component
const BillingToggle = ({ isAnnual, setIsAnnual }) => {
  const toggleAnimation = useSharedValue(isAnnual ? 28 : 0);

  const onToggle = () => {
    const newValue = !isAnnual;
    toggleAnimation.value = withSpring(newValue ? 28 : 0);
    setIsAnnual(newValue);
  };

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleAnimation.value }],
  }));

  return (
    <View style={styles.billingToggleContainer}>
      <Text style={[styles.billingOption, !isAnnual && styles.billingOptionActive]}>Monthly</Text>
      <TouchableOpacity 
        style={styles.toggleTrack} 
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.toggleThumb, toggleStyle]} />
      </TouchableOpacity>
      <Text style={[styles.billingOption, isAnnual && styles.billingOptionActive]}>
        Annual
        <Text style={styles.savingsText}> (Save 20%)</Text>
      </Text>
    </View>
  );
};

// Pricing Card Component
const PricingCard = ({ plan, isAnnual, navigation }) => {
  const scale = useSharedValue(1);
  
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.98);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const price = isAnnual ? plan.price.annual : plan.price.monthly;

  return (
    <Animated.View 
      style={[
        styles.pricingCard,
        plan.recommended && styles.recommendedCard,
        cardStyle,
      ]}
    >
      {plan.recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Most Popular</Text>
        </View>
      )}
      <Text style={styles.planName}>{plan.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.currency}>$</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>/{isAnnual ? 'year' : 'month'}</Text>
      </View>
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.selectPlanButton,
          plan.recommended && styles.recommendedButton,
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}
      >
        <Text style={[
          styles.selectPlanButtonText,
          plan.recommended && styles.recommendedButtonText,
        ]}>
          {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const heightAnimation = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : contentHeight.value;
    heightAnimation.value = withSpring(toValue, {
      damping: 15,
      stiffness: 120,
    });
    setIsExpanded(!isExpanded);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightAnimation.value,
    opacity: interpolate(
      heightAnimation.value,
      [0, contentHeight.value],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqHeader} onPress={toggleExpand}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <MaterialIcons 
          name={isExpanded ? 'remove' : 'add'} 
          size={24} 
          color={COLORS.primary} 
        />
      </TouchableOpacity>
      <Animated.View style={[styles.faqContent, animatedStyle]}>
        <Text style={styles.faqAnswer}>{answer}</Text>
      </Animated.View>
    </View>
  );
};

const PricingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const [isAnnual, setIsAnnual] = useState(false);

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

  const pricingPlans = [
    {
      name: 'Basic',
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        'Basic project management',
        'Simple reporting',
        '1GB storage',
        '3 projects',
        '2 users',
      ],
      recommended: false,
    },
    {
      name: 'Pro',
      price: {
        monthly: 29,
        annual: 279,
      },
      features: [
        'Advanced reporting',
        'Photo annotations',
        '10GB storage',
        'Unlimited projects',
        '10 users',
        'Priority support',
      ],
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: {
        monthly: 99,
        annual: 949,
      },
      features: [
        'Custom reporting',
        'Advanced annotations',
        'Unlimited storage',
        'Unlimited projects',
        'Unlimited users',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
      ],
      recommended: false,
    },
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.',
    },
    {
      question: 'What happens when I upgrade or downgrade?',
      answer: "When you upgrade, you'll immediately get access to all new features. When you downgrade, you'll keep your current features until the end of your billing period.",
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for annual plans. Monthly plans can be cancelled anytime but are not refunded.',
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
                <Text style={[styles.navLink, styles.activeNavLink]}>Pricing</Text>
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
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { paddingTop: 100 + insets.top }]}>
          <Text style={styles.headline}>Simple Pricing for Teams of All Sizes</Text>
          <Text style={styles.subheadline}>No hidden fees. Cancel anytime.</Text>
          <BillingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingGrid}>
          {pricingPlans.map((plan, index) => (
            <PricingCard 
              key={index} 
              plan={plan} 
              isAnnual={isAnnual}
              navigation={navigation}
            />
          ))}
        </View>

        {/* Trust Badges */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>Trusted by Leading Companies</Text>
          <View style={styles.trustBadges}>
            <MaterialIcons name="verified-user" size={32} color={COLORS.primary} />
            <MaterialIcons name="security" size={32} color={COLORS.primary} />
            <MaterialIcons name="privacy-tip" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.trustText}>
            SOC2 Compliant • GDPR Ready • 99.9% Uptime
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}
            >
              <Text style={styles.ctaButtonText}>Start Your Free Trial</Text>
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
  },
  billingToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  billingOption: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  billingOptionActive: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
  savingsText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  toggleTrack: {
    width: 56,
    height: 28,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  pricingGrid: {
    padding: 20,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pricingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 32,
    width: Platform.OS === 'web' ? '30%' : '100%',
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
  recommendedCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  currency: {
    fontSize: 24,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  price: {
    fontSize: 48,
    color: COLORS.textDark,
    fontWeight: '800',
  },
  period: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
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
  selectPlanButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  recommendedButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  selectPlanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  recommendedButtonText: {
    color: COLORS.white,
  },
  trustSection: {
    padding: 40,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 24,
  },
  trustBadges: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  trustText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  faqSection: {
    padding: 40,
  },
  faqTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 40,
    textAlign: 'center',
  },
  faqList: {
    gap: 16,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    flex: 1,
  },
  faqContent: {
    overflow: 'hidden',
  },
  faqAnswer: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 12,
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
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  pricingSection: {
    padding: 24,
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  billingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundAlt,
    borderRadius: 24,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  pricingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  pricingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pricingCardHighlighted: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  tierDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  currency: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  period: {
    fontSize: 16,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  featureList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.textDark,
    marginLeft: 12,
  },
  selectButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  trustSection: {
    padding: 24,
    backgroundColor: COLORS.white,
  },
  trustTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 24,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  trustItem: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 200,
  },
  trustIcon: {
    marginBottom: 12,
  },
  trustItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  trustItemDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  faqSection: {
    padding: 24,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 24,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
  },
  faqAnswer: {
    padding: 16,
    backgroundColor: COLORS.backgroundAlt,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  faqAnswerText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  ctaSection: {
    padding: 24,
    backgroundColor: COLORS.primary,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  ctaButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  ctaButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PricingScreen; 