import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  useWindowDimensions,
  ScrollView,
  Animated as CoreAnimated,
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
  interpolateColor,
} from 'react-native-reanimated';
import Header from '../../components/LandingPage/Header';
import Footer from '../../components/LandingPage/Footer';
import Svg, { Path } from 'react-native-svg';

const COLORS = {
  primary: '#00BA88',
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

const AnimatedScrollView = CoreAnimated.createAnimatedComponent(ScrollView);

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
        <CoreAnimated.View style={[styles.toggleThumb, toggleStyle]} />
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
  const savings = isAnnual && plan.price.monthly ? (plan.price.monthly * 12 - plan.price.annual).toFixed(0) : 0;

  const renderPrice = () => {
    if (plan.name === 'Enterprise') {
      return (
        <View style={styles.priceContainer}>
          <Text style={styles.enterprisePrice}>Contact Sales</Text>
        </View>
      );
    }
    return (
      <View style={styles.priceContainer}>
        <Text style={styles.currency}>$</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>/{isAnnual ? 'year' : 'month'}</Text>
        {isAnnual && savings > 0 && (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>Save ${savings}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <CoreAnimated.View 
      style={[
        styles.pricingCard,
        plan.recommended && styles.recommendedCard,
        cardStyle,
      ]}
      onStartShouldSetResponder={() => true}
      onResponderGrant={onPressIn}
      onResponderRelease={onPressOut}
    >
      {plan.recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Most Popular</Text>
        </View>
      )}
      <Text style={styles.planName}>{plan.name}</Text>
      {renderPrice()}
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
        onPress={() => console.log('Selected plan:', plan.name)}
      >
        <Text style={[
          styles.selectPlanButtonText,
          plan.recommended && styles.recommendedButtonText,
        ]}>
          {plan.name === 'Enterprise' ? 'Contact Sales' : plan.trial ? 'Start Free Trial' : 'Get Started'}
        </Text>
      </TouchableOpacity>
    </CoreAnimated.View>
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
      <CoreAnimated.View style={[styles.faqContent, animatedStyle]}>
        <Text style={styles.faqAnswer}>{answer}</Text>
      </CoreAnimated.View>
    </View>
  );
};

// <<< START COPIED ShimmerEffect CODE >>>
const shimmerStyles = StyleSheet.create({
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure shimmer is behind header content if needed
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
    zIndex: 2, // Above raindrop
  },
  splashGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

const ShimmerEffect = () => {
  const [raindrops, setRaindrops] = useState([]);
  const screenHeight = useWindowDimensions().height; // Use screen height for raindrop animation

  // Function to create initial raindrop states
  const createRaindrops = () => {
    const drops = [];
    const numDrops = 30; // Adjust number of raindrops
    for (let i = 0; i < numDrops; i++) {
      drops.push({
        id: i,
        horizontalOffset: Math.random() * 100,
        height: Math.random() * 50 + 40, // Varying heights
        width: Math.random() * 2 + 2,   // Varying widths
        position: new CoreAnimated.Value(- (Math.random() * screenHeight * 0.5 + 50)), // Use CoreAnimated.Value
        splash: new CoreAnimated.Value(0),
        splashOpacity: new CoreAnimated.Value(0),
        delay: Math.random() * 5000, // Random start delay
        duration: Math.random() * 1500 + 1000, // Random duration
        landingPoint: screenHeight * (Math.random() * 0.3 + 0.6), // Where splash occurs (lower part)
      });
    }
    setRaindrops(drops);
    return drops;
  };

  React.useEffect(() => {
    const drops = createRaindrops();

    const startRainAnimation = (drop) => {
      const animateRaindrop = () => {
        drop.position.setValue(-drop.height); // Reset position above screen
        drop.splash.setValue(0);
        drop.splashOpacity.setValue(0);

        CoreAnimated.sequence([ // Use CoreAnimated.sequence
          CoreAnimated.delay(drop.delay), // Use CoreAnimated.delay
          CoreAnimated.timing(drop.position, { // Use CoreAnimated.timing
            toValue: drop.landingPoint,
            duration: drop.duration,
            useNativeDriver: true,
          }),
          // Splash Animation
          CoreAnimated.parallel([ // Use CoreAnimated.parallel
            CoreAnimated.timing(drop.splash, { // Use CoreAnimated.timing
              toValue: 1,
              duration: 400, // Splash expansion duration
              useNativeDriver: true,
            }),
            CoreAnimated.timing(drop.splashOpacity, { // Use CoreAnimated.timing
              toValue: 1,
              duration: 100, // Quick fade in
              useNativeDriver: true,
            }),
          ]),
          CoreAnimated.timing(drop.splashOpacity, { // Use CoreAnimated.timing
            toValue: 0,
            duration: 300, // Fade out splash
            delay: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
           // Loop the animation after a random delay
           drop.delay = Math.random() * 3000 + 1000;
           drop.duration = Math.random() * 1500 + 1000; // Randomize duration for next fall
           animateRaindrop();
        });
      };
      animateRaindrop();
    };

    drops.forEach(drop => startRainAnimation(drop));

    // Cleanup function
    return () => {
      raindrops.forEach(drop => {
        if (drop.position) drop.position.stopAnimation();
        if (drop.splash) drop.splash.stopAnimation();
        if (drop.splashOpacity) drop.splashOpacity.stopAnimation();
      });
    };
  }, []); // Run only once on mount

  return (
    <View style={shimmerStyles.shimmerContainer} pointerEvents="none">
      {raindrops.map((drop) => (
        <React.Fragment key={drop.id}>
          {/* Raindrop */}
          <CoreAnimated.View // Use CoreAnimated.View
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

          {/* Splash effect */}
          <CoreAnimated.View // Use CoreAnimated.View
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
                      outputRange: [0.5, 2.5], // Splash size animation
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

const PricingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width, height } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const [isAnnual, setIsAnnual] = useState(false);

  // Header height calculation (similar to FeaturesScreen)
  const headerHeight = 80 + insets.top;

  // Wave animation values
  const wave1Animation = useSharedValue(0);
  const wave2Animation = useSharedValue(0);
  const wave3Animation = useSharedValue(0);

  // Create animated styles for each wave
  const wave1Style = useAnimatedStyle(() => {
    // Create a more organic, apple-like curve
    return {
      transform: [
        {translateX: Math.sin(wave1Animation.value * 0.5) * 70 + Math.cos(wave1Animation.value * 1.1) * 30},
        {translateY: Math.sin(wave1Animation.value * 0.9) * 40 + Math.cos(wave1Animation.value * 0.7) * 20},
        {skewX: `${Math.sin(wave1Animation.value * 0.6) * 15 + Math.cos(wave1Animation.value * 0.9) * 8}deg`},
        {skewY: `${Math.sin(wave1Animation.value * 1.0) * 10 + Math.cos(wave1Animation.value * 0.4) * 9}deg`},
        {scaleX: 1.3 + Math.sin(wave1Animation.value * 0.3) * 0.3 + Math.cos(wave1Animation.value * 0.7) * 0.2},
        {scaleY: 1.2 + Math.sin(wave1Animation.value * 0.8) * 0.2 + Math.cos(wave1Animation.value * 0.5) * 0.15},
        {rotate: `${Math.sin(wave1Animation.value * 0.4) * 4 + Math.cos(wave1Animation.value * 0.8) * 3}deg`}
      ],
      borderRadius: 300 + Math.sin(wave1Animation.value * 0.7) * 100 + Math.cos(wave1Animation.value * 1.2) * 50,
      opacity: 0.85 + Math.sin(wave1Animation.value * 0.4) * 0.1,
    };
  });

  const wave2Style = useAnimatedStyle(() => {
    // Create a more organic, orange-like curve
    return {
      transform: [
        {translateX: Math.sin(wave2Animation.value * 0.8 + 1.2) * 80 + Math.cos(wave2Animation.value * 0.5) * 35},
        {translateY: Math.sin(wave2Animation.value * 0.7 + 0.5) * 50 + Math.cos(wave2Animation.value * 1.0) * 30},
        {skewX: `${Math.sin(wave2Animation.value * 0.9) * -20 + Math.cos(wave2Animation.value * 0.5) * -10}deg`},
        {skewY: `${Math.sin(wave2Animation.value * 0.5) * 12 + Math.cos(wave2Animation.value * 0.9) * 11}deg`},
        {scaleX: 1.4 + Math.sin(wave2Animation.value * 0.6) * 0.35 + Math.cos(wave2Animation.value * 0.3) * 0.25},
        {scaleY: 1.3 + Math.sin(wave2Animation.value * 0.4) * 0.25 + Math.cos(wave2Animation.value * 0.8) * 0.2},
        {rotate: `${Math.sin(wave2Animation.value * 0.6) * -6 + Math.cos(wave2Animation.value * 0.7) * -4}deg`}
      ],
      borderRadius: 280 + Math.sin(wave2Animation.value * 0.9) * 120 + Math.cos(wave2Animation.value * 0.6) * 60,
      opacity: 0.9 + Math.sin(wave2Animation.value * 0.5) * 0.08,
    };
  });

  const wave3Style = useAnimatedStyle(() => {
    // Create a more organic, fruit-like curve
    return {
      transform: [
        {translateX: Math.sin(wave3Animation.value * 0.4 + 2.0) * 90 + Math.cos(wave3Animation.value * 0.8) * 40},
        {translateY: Math.sin(wave3Animation.value * 1.1 + 0.8) * 60 + Math.cos(wave3Animation.value * 0.6) * 35},
        {skewX: `${Math.sin(wave3Animation.value * 0.7) * 25 + Math.cos(wave3Animation.value * 1.0) * 12}deg`},
        {skewY: `${Math.sin(wave3Animation.value * 0.9) * -15 + Math.cos(wave3Animation.value * 0.3) * -13}deg`},
        {scaleX: 1.5 + Math.sin(wave3Animation.value * 0.8) * 0.4 + Math.cos(wave3Animation.value * 0.5) * 0.3},
        {scaleY: 1.4 + Math.sin(wave3Animation.value * 0.5) * 0.3 + Math.cos(wave3Animation.value * 0.9) * 0.25},
        {rotate: `${Math.sin(wave3Animation.value * 0.8) * 8 + Math.cos(wave3Animation.value * 0.4) * 5}deg`}
      ],
      borderRadius: 260 + Math.sin(wave3Animation.value * 0.6) * 140 + Math.cos(wave3Animation.value * 1.1) * 70,
      opacity: 1.0 + Math.sin(wave3Animation.value * 0.7) * 0.05,
    };
  });

  // Start the wave animations when component mounts
  React.useEffect(() => {
    // Create looping animations for each wave at different speeds
    const loop1 = setInterval(() => {
      wave1Animation.value = wave1Animation.value + 0.005;
    }, 16);
    
    const loop2 = setInterval(() => {
      wave2Animation.value = wave2Animation.value + 0.004;
    }, 16);
    
    const loop3 = setInterval(() => {
      wave3Animation.value = wave3Animation.value + 0.003;
    }, 16);

    // Clean up intervals on unmount
    return () => {
      clearInterval(loop1);
      clearInterval(loop2);
      clearInterval(loop3);
    };
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleWavePress = () => {
    // Scroll to pricing cards section with a smoother animation
    if (scrollY && scrollY.value) {
      scrollY.value = withSpring(300, {
        damping: 20,
        stiffness: 90,
        mass: 1.2,
        overshootClamping: false,
      });
    }
  };

  const pricingPlans = [
    {
      name: 'Free Trial',
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        '14-day full access',
        'All Pro features included',
        'No credit card required',
        'Cancel anytime',
        'Email support',
      ],
      recommended: false,
      trial: true,
    },
    {
      name: 'Professional',
      price: {
        monthly: 29,
        annual: 299,
      },
      features: [
        '$29/month for first user',
        '$25/month per additional user',
        'All features included',
        'Priority support',
        'Unlimited storage',
        'Advanced reporting',
        'Custom branding',
      ],
      recommended: true,
      trial: false,
    },
    {
      name: 'Enterprise',
      price: {
        monthly: null,
        annual: null,
      },
      features: [
        'Custom pricing',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment option',
        'Advanced security features',
        'Custom training',
        'Phone support',
      ],
      recommended: false,
      trial: false,
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
      {/* Render the standard Header */}
      <Header /> 

      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContentContainer, { paddingTop: headerHeight }]}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        {/* Hero Content */}
        <View style={styles.heroContent}>
          {/* Apply Gradient and Shimmer *inside* heroContent */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, '#E0F2F1']} // Gradient similar to Features fallback
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill} // Fill the container
          />
          <ShimmerEffect />

          {/* Ensure content is layered on top */}
          <View style={{ zIndex: 1, alignItems: 'center' }}> 
            <Text style={styles.heroTitle}>Find the Perfect Plan</Text>
            <Text style={styles.heroSubtitle}>
              Choose the plan that best fits your project needs and budget. 
              Start with a free trial, no credit card required.
            </Text>
            <BillingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
          </View>
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingCardsContainer}>
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
          <View style={styles.faqContainer}>
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
      </AnimatedScrollView>
      <Footer />
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
  scrollContentContainer: {
    paddingBottom: 100, // Ensure space for footer etc.
  },
  heroContent: {
    paddingTop: 40, // Keep top padding
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden', // Change from visible to hidden for absoluteFill
    paddingBottom: 40, // Add reasonable bottom padding
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.textDark,
    marginBottom: 40,
    opacity: 0.8,
  },
  billingToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  billingOption: {
    fontSize: 16,
    color: '#E0F2F1', // Change text color to be visible on gradient
  },
  billingOptionActive: {
    color: COLORS.white, // Change text color to be visible on gradient
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
  },
  pricingCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#f8f9fa',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  pricingCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: 320,
    minHeight: 520,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 6,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  recommendedCard: {
    backgroundColor: COLORS.cardBackgroundAlt,
    transform: [{ scale: 1.02 }],
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    width: 120,
    alignItems: 'center',
  },
  recommendedText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },
  price: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.text,
  },
  period: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginLeft: 2,
  },
  featuresContainer: {
    flex: 1,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  featureText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  selectPlanButton: {
    borderWidth: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  recommendedButton: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  selectPlanButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
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
    marginTop: 60,
    paddingHorizontal: 20,
  },
  faqTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  faqContainer: {
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
  enterprisePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  savingsBadge: {
    position: 'absolute',
    top: -20,
    right: -40,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  wavesContainer: {
    position: 'absolute',
    bottom: -200,
    left: 0,
    right: 0,
    height: 400,
    overflow: 'visible',
    zIndex: 10,
  },
  waveBackground: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  waveSVG: {
    position: 'absolute',
    width: '240%',
    height: 240,
    left: '-70%',
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'visible',
  },
  waveGradient: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 500,
    ...Platform.select({
      ios: {
        overflow: 'hidden',
      },
      android: {
        overflow: 'hidden',
      },
      web: {
        overflow: 'visible',
      },
    }),
  },
  wave1: {
    bottom: 10,
    height: 220,
    opacity: 0.85,
    zIndex: 3,
  },
  wave2: {
    bottom: 80,
    height: 240,
    opacity: 0.9,
    zIndex: 2,
  },
  wave3: {
    bottom: 150,
    height: 260,
    opacity: 1,
    zIndex: 1,
  },
  touchableContainer: {
    width: '100%',
    height: '100%',
  },
});

export default PricingScreen; 