import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  TextInput,
  StyleSheet as CoreStyleSheet,
  Animated as CoreAnimated,
  Pressable,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types'; // Assuming this type exists
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/LandingPage/Header';

// Combine original and new COLORS
const COLORS = {
  primary: '#10B981', // Original primary green
  primaryDark: '#059669',
  textDark: '#111827', // Original dark text
  textLight: '#6B7280', // Original light text
  white: '#FFFFFF',
  background: '#F9FAFB', // Original background
  border: '#E5E7EB',
  backgroundAlt: '#F1F3F5',
  // New colors from SVG design, potentially overriding/adjusting
  cardBg: '#ffffff',
  newPrimary: '#00c389', // Main green color (Selected State)
  primaryLight: '#e6f9f1', // Light green (Selected State BG)
  inactivePillBg: '#e0f2fe', // Light Blue for INACTIVE pill background
  inactivePillBorder: '#bae6fd', // Medium Blue for INACTIVE pill border
  newTextDark: '#333333',
  newTextLight: '#666666', // From new design
  newBorder: '#e5e7eb', // Same as original border
  inactiveStep: '#f1f5f9',
  placeholder: '#aaaaaa',
  agentPreviewBg: '#f1f5f9',
  agentIconBg: 'rgba(0, 195, 137, 0.5)',
};

// --- Original Animated Components & Effects ---

// AnimatedHeadline Component for color sweep effect (Kept from original)
const AnimatedHeadline = ({ text, style }) => {
  // Simplified version without the color sweep for now
  return <Animated.Text style={style}>{text}</Animated.Text>;
};

// ShimmerEffect Component (Kept from original)
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

  useEffect(() => {
    const drops = createRaindrops();
    const animations = [];

    const startRainAnimation = (drop) => {
      const animateRaindrop = () => {
        drop.position.setValue(-drop.height);
        drop.splash.setValue(0);
        drop.splashOpacity.setValue(0);

        const animation = CoreAnimated.sequence([
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
        ]);
        
        animations.push(animation); // Store animation reference
        
        animation.start(({ finished }) => {
           if (finished) {
               // Reset values for next loop
               drop.delay = Math.random() * 3000 + 1000;
               drop.duration = Math.random() * 1500 + 1000;
               animateRaindrop(); // Loop animation
           }
        });
      };
      animateRaindrop();
    };

    drops.forEach(drop => startRainAnimation(drop));

    // Cleanup function to stop animations when component unmounts
    return () => {
      animations.forEach(anim => anim.stop()); 
      raindrops.forEach(drop => {
        if (drop.position) drop.position.removeAllListeners();
        if (drop.splash) drop.splash.removeAllListeners();
        if (drop.splashOpacity) drop.splashOpacity.removeAllListeners();
      });
    };
  }, []); // Rerun effect only on mount/unmount

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

// --- NEW Support Journey Components ---

// Data for support options
const supportOptionsData = [
  {
    id: 'liveChat',
    title: 'Live Chat Support',
    description: 'Average wait: < 1 minute',
    icon: 'chat-bubble-outline', // MaterialIcons name
    status: 'Online',
    faq: 'How do I share my screen?',
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Response time: 24 hours',
    icon: 'email', // MaterialIcons name
    status: null,
    faq: 'What information should I include?',
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: 'Available 9am - 5pm Mon-Fri',
    icon: 'phone', // MaterialIcons name
    status: null,
    faq: 'What is the support phone number?',
  },
];

// Left Column: Support Journey
const SupportJourney = ({ selectedMethod, onSelectMethod, styles }) => { // Pass styles down
  const selectedOptionData = supportOptionsData.find(opt => opt.id === selectedMethod);

  return (
    <View style={styles.leftColumn}>
      <Text style={styles.journeyTitle}>Support Journey</Text>
      <Text style={styles.journeySubtitle}>Select your preferred contact method</Text>

      {/* Options Container (now directly under subtitle) */}
      <View style={styles.optionsContainer}>
        {/* Support Options Area */}
        {supportOptionsData.map((option) => (
          <SupportOption
            key={option.id}
            {...option}
            isSelected={selectedMethod === option.id}
            onPress={() => onSelectMethod(option.id)}
            styles={styles} // Pass styles
          />
        ))}
      </View>

      {/* FAQ Section - Will flow naturally after options */}
      {selectedOptionData && (
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>{selectedOptionData.title} FAQ</Text>
          <Text style={styles.faqQuestion}>Top question: {selectedOptionData.faq}</Text>
        </View>
      )}
    </View>
  );
};

// Support Option Component
const SupportOption = ({ id, title, description, icon, status, isSelected, onPress, styles }) => {
  const showDescription = id !== 'liveChat' || !isSelected; // Keep hiding description for selected Live Chat

  // Determine icon and status text color based on state
  let iconColor = COLORS.newTextLight; // Default inactive icon color
  let statusTextColor = COLORS.newTextLight; // Default inactive status text
  let statusDotColor = COLORS.inactivePillBorder; // Default inactive dot (matches border)

  if (isSelected) {
    iconColor = COLORS.newPrimary; // Green icon when selected
    statusTextColor = COLORS.newPrimary; // Green status text when selected
    statusDotColor = COLORS.newPrimary; // Green dot when selected
  } else {
    iconColor = COLORS.inactivePillBorder; // Use inactive border blue for icon
  }

  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        // Use green selected style or blue inactive style
        isSelected ? styles.optionButtonSelected : styles.optionButtonInactive,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.optionIconCircle, isSelected ? styles.optionIconCircleSelected : styles.optionIconCircleInactive]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        {showDescription && <Text style={styles.optionDescription}>{description}</Text>}
      </View>
      {status && (
        <View style={styles.optionStatusContainer}>
          <Text style={[styles.optionStatusText, isSelected && styles.optionStatusTextSelected]}>{status}</Text>
          {/* Status dot color now reflects state */}
          <View style={[styles.optionStatusDot, { backgroundColor: statusDotColor }]} />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Right Column: Contact Form Area
const ContactFormArea = ({ selectedMethod, styles }) => { // Pass styles down
  const renderContent = () => {
    switch (selectedMethod) {
      case 'liveChat':
        return <LiveChatForm styles={styles} />; // Pass styles
      case 'email':
        return <EmailSupportForm styles={styles} />; // Render Email Form
      case 'phone':
        return <PhoneSupportInfo styles={styles} />; // Render Phone Info
      default:
        return null;
    }
  };

  return <View style={styles.rightColumn}>{renderContent()}</View>;
};

// Live Chat Form specific content
const LiveChatForm = ({ styles }) => { // Receive styles
  const [focusedInput, setFocusedInput] = useState(null); // State to track focus

  return (
    <View style={styles.formWrapper}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.newPrimary, '#00a975']} // Use new primary color
        style={styles.formHeader}
      >
        <Text style={styles.formHeaderTitle}>Start Live Chat</Text>
        <Text style={styles.formHeaderSubtitle}>Connect with an agent in less than a minute</Text>
      </LinearGradient>

      {/* Agent Preview */}
      <View style={styles.agentPreviewContainer}>
        <View style={styles.agentAvatar}>
          {/* Simple representation of the SVG face */}
          <View style={styles.agentFace} />
          <View style={[styles.agentEye, { left: 15 }]} />
          <View style={[styles.agentEye, { right: 15 }]} />
          <View style={styles.agentMouth} />
        </View>
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>Sarah Miller</Text>
          <Text style={styles.agentTitle}>Customer Support</Text>
        </View>
        <View style={styles.agentStatusDot} />
      </View>

      {/* Form Fields */}
      <View style={styles.formFieldsContainer}>
        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'chatName' && styles.inputFocused // Apply focus style
          ]}
          placeholder="Enter your name"
          placeholderTextColor={COLORS.placeholder}
          onFocus={() => setFocusedInput('chatName')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'chatEmail' && styles.inputFocused // Apply focus style
          ]}
          placeholder="Enter your email"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="email-address"
          onFocus={() => setFocusedInput('chatEmail')}
          onBlur={() => setFocusedInput(null)}
        />

        <TouchableOpacity style={styles.submitChatButton}>
          <Text style={styles.submitChatButtonText}>Start Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- NEW Email Support Form Component ---
const EmailSupportForm = ({ styles }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [focusedInput, setFocusedInput] = useState(null); // State to track focus

  const handleSubmit = () => {
    console.log('Email Form submitted:', form);
    // Add actual email sending logic here
  };

  return (
    <View style={styles.formWrapper}>
      {/* Email Form Header - Use primary colors */}
      <LinearGradient
        colors={[COLORS.newPrimary, '#00a975']} // Changed from grey gradient
        style={styles.formHeader}
      >
        <Text style={styles.formHeaderTitle}>Send an Email</Text>
        <Text style={styles.formHeaderSubtitle}>We typically respond within 24 hours</Text>
      </LinearGradient>

      {/* Form Fields */}
      <ScrollView style={styles.formFieldsScrollView}> // Make fields scrollable if needed
          <View style={styles.formFieldsContainer}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              style={[
                  styles.input,
                  focusedInput === 'emailName' && styles.inputFocused // Apply focus style
              ]}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.placeholder}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              onFocus={() => setFocusedInput('emailName')}
              onBlur={() => setFocusedInput(null)}
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={[
                  styles.input,
                  focusedInput === 'emailEmail' && styles.inputFocused // Apply focus style
              ]}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              onFocus={() => setFocusedInput('emailEmail')}
              onBlur={() => setFocusedInput(null)}
            />

            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={[
                  styles.input,
                  focusedInput === 'emailSubject' && styles.inputFocused // Apply focus style
              ]}
              placeholder="How can we help?"
              placeholderTextColor={COLORS.placeholder}
              value={form.subject}
              onChangeText={(text) => setForm({ ...form, subject: text })}
              onFocus={() => setFocusedInput('emailSubject')}
              onBlur={() => setFocusedInput(null)}
            />

            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              style={[
                  styles.input, 
                  styles.messageInput, 
                  focusedInput === 'emailMessage' && styles.inputFocused // Apply focus style
              ]}
              placeholder="Describe your issue here..."
              placeholderTextColor={COLORS.placeholder}
              multiline
              numberOfLines={5}
              value={form.message}
              onChangeText={(text) => setForm({ ...form, message: text })}
              onFocus={() => setFocusedInput('emailMessage')}
              onBlur={() => setFocusedInput(null)}
            />

            <TouchableOpacity style={styles.submitEmailButton} onPress={handleSubmit}>
              <Text style={styles.submitEmailButtonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </View>
  );
};

// --- NEW Phone Support Info Component ---
const PhoneSupportInfo = ({ styles }) => {
  const handleCall = () => {
    console.log('Attempting to call support...');
    // Add logic for Linking.openURL('tel:YOUR_PHONE_NUMBER') if needed
    // Be mindful of platform differences and permissions
  };

  return (
    <View style={styles.formWrapper}>
      {/* Phone Info Header - Use primary colors */}
      <LinearGradient
        colors={[COLORS.newPrimary, '#00a975']} // Changed from dark gradient
        style={styles.formHeader}
      >
        <Text style={styles.formHeaderTitle}>Phone Support</Text>
        <Text style={styles.formHeaderSubtitle}>Speak directly with our team</Text>
      </LinearGradient>

      {/* Phone Info Content */}
      <View style={styles.phoneInfoContainer}>
         <MaterialIcons name="phone" size={60} color={COLORS.newPrimary} style={{ marginBottom: 20 }} />
         <Text style={styles.phoneInfoHeader}>Support Hours:</Text>
         <Text style={styles.phoneInfoText}>Monday - Friday</Text>
         <Text style={styles.phoneInfoText}>9:00 AM - 5:00 PM (Your Timezone)</Text>
         
         <Text style={[styles.phoneInfoHeader, { marginTop: 25 }]}>Phone Number:</Text>
         <Text style={styles.phoneNumberText}>+1 (555) 123-4567</Text> // Replace with actual number
         
         <TouchableOpacity style={styles.callNowButton} onPress={handleCall}>
           <MaterialIcons name="call" size={20} color={COLORS.white} style={{ marginRight: 8 }}/>
           <Text style={styles.callNowButtonText}>Call Now</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
};

// Restore Right Panel Overlay Component
const RightPanelOverlay = ({ isVisible, onClose, selectedMethod, styles }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View 
        style={styles.overlayContainer}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
    >
        <Pressable style={styles.overlayBackdrop} onPress={onClose} />
        
        <View style={styles.overlayContentContainer}>
            {/* Content area uses rightColumn styles implicitly via ContactFormArea */}
            <ContactFormArea selectedMethod={selectedMethod} styles={styles} /> 
            
            <TouchableOpacity style={styles.overlayCloseButton} onPress={onClose}>
                <MaterialIcons name="close" size={24} color={COLORS.newTextDark} />
            </TouchableOpacity>
        </View>
    </Animated.View>
  );
};

// --- Main Screen Component ---
const SupportScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const pageOpacity = useSharedValue(0);
  const [selectedMethod, setSelectedMethod] = useState('liveChat');
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(false); // Restore state
  const isMobile = width < 768; // Restore mobile check

  useEffect(() => {
    pageOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const pageAnimStyle = useAnimatedStyle(() => ({
    opacity: pageOpacity.value
  }));

  // Restore handler for selecting a method with overlay logic
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    if (isMobile) {
      setIsRightPanelVisible(true); // Show overlay on mobile
    }
  };

  // Restore handler to close the overlay
  const handleCloseOverlay = () => {
    setIsRightPanelVisible(false);
  };

  const styles = getCombinedStyles(isMobile);

  return (
    <Animated.View style={[styles.container, pageAnimStyle]}>
      <Header />

      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* --- Original Hero Section --- */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, '#E0F2F1']} // Use original colors
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={CoreStyleSheet.absoluteFill}
          />
          <ShimmerEffect />
          <View style={{ zIndex: 1, alignItems: 'center' }}>
            <AnimatedHeadline
              text="Get in Touch"
              style={styles.headline}
            />
            <Text style={styles.subheadline}>
              We are here to help! Reach out or browse our support options.
            </Text>
          </View>
        </View>

        {/* --- Support Section --- */}
        <View style={styles.supportJourneySection}>
          {/* Restore conditional rendering logic */}
          <View style={[styles.mainContainer, isMobile && styles.mainContainerMobile]}>
            <SupportJourney
              selectedMethod={selectedMethod}
              onSelectMethod={handleSelectMethod} // Use handler with overlay logic
              styles={styles}
            />
            {/* Only render right column directly if NOT mobile */}
            {!isMobile && (
              <ContactFormArea
                selectedMethod={selectedMethod}
                styles={styles}
              />
            )}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Restore Overlay Rendering */}
      {isMobile && (
        <RightPanelOverlay
          isVisible={isRightPanelVisible}
          onClose={handleCloseOverlay}
          selectedMethod={selectedMethod}
          styles={styles}
        />
      )}
    </Animated.View>
  );
};

// --- Combined Styles Function ---
const getCombinedStyles = (isMobile) => StyleSheet.create({
  // Original Styles (potentially modified)
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  heroSection: {
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 80,
    backgroundColor: COLORS.primary,
    width: '100%',
  },
  headline: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 2, // Ensure headline is above shimmer
  },
  subheadline: {
    fontSize: 18,
    color: '#E0F2F1',
    textAlign: 'center',
    marginBottom: 32, // Reduced margin if needed
    maxWidth: 600,
    opacity: 0.9,
    zIndex: 2, // Ensure subheadline is above shimmer
  },
  
  // Styles for the new section container
  supportJourneySection: {
     paddingVertical: Platform.OS === 'web' ? 50 : 30,
     paddingHorizontal: Platform.OS === 'web' ? 20 : 10,
     alignItems: 'center',
     width: '100%',
     marginBottom: 50,
  },

  // New Styles for the two-column layout (prefixed to avoid conflicts where possible)
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 800, // Max width based on SVG dimensions
    backgroundColor: 'transparent',
    gap: 20,
    alignItems: 'stretch',
  },
  mainContainerMobile: {
    flexDirection: 'column', 
    maxWidth: 500,
    gap: 0, // No gap when overlaying
    alignItems: 'center', // Center the left column
  },
  leftColumn: {
    width: isMobile ? '100%' : undefined,
    flex: isMobile ? undefined : 1,
    maxWidth: isMobile ? 400 : 350, 
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 20,
    minHeight: 600, 
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' },
      default: { elevation: 5 },
    }),
  },
  journeyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.newTextDark,
    textAlign: 'center',
    marginBottom: 5,
  },
  journeySubtitle: {
    fontSize: 14,
    color: COLORS.newTextLight,
    textAlign: 'center',
    marginBottom: 40, // Increased space before options
  },
  optionsContainer: {
    marginVertical: 0,
    gap: 25, // Increased gap for more vertical spacing
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 40,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    height: 60,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1, // Add base border width for inactive state
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out',
        cursor: 'pointer',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        }
      },
      default: {
        elevation: 2,
      }
    }),
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primaryLight, // Light Green BG
    borderColor: COLORS.newPrimary, // Green Border
    borderWidth: 2, // Keep slightly thicker border for selected
    ...Platform.select({ web: { boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }, default: { elevation: 4 } })
  },
  optionButtonInactive: {
    backgroundColor: COLORS.inactivePillBg, // Light Blue BG
    borderColor: COLORS.inactivePillBorder, // Medium Blue Border
    // Base borderWidth is set in optionButton now
  },
  optionIconCircle: { // Base style for the icon circle
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionIconCircleSelected: {
    backgroundColor: COLORS.white, // White background when selected (Green pill)
  },
  optionIconCircleInactive: {
    backgroundColor: COLORS.white, // White background when inactive (Blue pill)
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 5, 
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.newTextDark,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: COLORS.newTextLight,
  },
  optionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    top: 22,
  },
  optionStatusText: {
    fontSize: 12,
    color: COLORS.newTextLight, // Default greyish text
    marginRight: 8,
  },
  optionStatusTextSelected: {
    color: COLORS.newPrimary, // Green text when selected
    fontWeight: 'bold',
  },
  optionStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    // backgroundColor is now set dynamically inline based on state
  },
  faqContainer: {
    width: '100%', // Take full width of column
    maxWidth: 300, // Match options container width
    marginTop: 'auto', // Push FAQ to the bottom if leftColumn has flex: 1 and sufficient height
    paddingBottom: 10, // Add some padding at the very bottom
    alignItems: 'center',
    paddingHorizontal: 0, // Padding handled by parent
  },
  faqTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.newTextDark,
    marginBottom: 5,
  },
  faqQuestion: {
    fontSize: 12,
    color: COLORS.newTextLight,
    textAlign: 'center',
  },
  rightColumn: {
    flex: 1,
    maxWidth: 330, 
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    minHeight: 600, 
    overflow: 'hidden',
    ...Platform.select({
        web: { boxShadow: !isMobile ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : undefined },
        default: { elevation: !isMobile ? 5 : undefined },
      }),
  },
  formWrapper: {
    flex: 1,
  },
  formPlaceholder: {
    textAlign: 'center',
    marginTop: 50,
    color: COLORS.newTextLight,
    fontSize: 16,
  },
  formHeader: {
    height: 80,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingRight: 45,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  formHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  formHeaderSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  agentPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  agentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.agentPreviewBg,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  agentFace: {
    width: 30,
    height: 20,
    backgroundColor: COLORS.agentIconBg,
    borderRadius: 15 / 2,
    position: 'absolute',
    top: 25,
    opacity: 0.7,
  },
  agentEye: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.newTextDark,
    top: 30,
  },
  agentMouth: {
    position: 'absolute',
    width: 14,
    height: 7,
    bottom: 30,
    borderBottomWidth: 2,
    borderColor: COLORS.newTextDark,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.newTextDark,
  },
  agentTitle: {
    fontSize: 14,
    color: COLORS.newTextLight,
  },
  agentStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.newPrimary,
    marginLeft: 10,
  },
  formFieldsContainer: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.newTextLight,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.newBorder,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 15,
    fontSize: 14,
    color: COLORS.newTextDark,
    marginBottom: 20,
    ...Platform.select({
        web: {
            transition: 'border-color 0.3s ease',
        }
    }),
  },
  inputFocused: {
    borderColor: COLORS.newPrimary,
    borderWidth: 1.5,
     ...Platform.select({
        web: {
             boxShadow: `0 0 0 2px ${COLORS.primaryLight}`
        }
    }),
  },
  submitChatButton: {
    backgroundColor: COLORS.newPrimary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitChatButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  formFieldsScrollView: {
      flex: 1,
  },
  messageInput: {
    height: 120, 
    textAlignVertical: 'top',
  },
  submitEmailButton: {
    backgroundColor: COLORS.newPrimary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitEmailButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneInfoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  phoneInfoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.newTextDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneInfoText: {
    fontSize: 16,
    color: COLORS.newTextLight,
    marginBottom: 4,
    textAlign: 'center',
  },
  phoneNumberText: {
     fontSize: 20,
     fontWeight: 'bold',
     color: COLORS.newPrimary,
     marginBottom: 30,
     textAlign: 'center',
  },
  callNowButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.newPrimary,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  callNowButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    width: '100%',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20, 
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayContentContainer: {
    width: '100%', 
    maxWidth: 400, // Match mobile left column max width
    maxHeight: '85%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
     ...Platform.select({
        web: { boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
        default: { elevation: 20 }
    }),
  },
  overlayCloseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6, 
    borderRadius: 20, 
    zIndex: 10, 
  },
});

export default SupportScreen; 