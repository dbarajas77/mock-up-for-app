import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, ScrollView, Platform, TouchableOpacity, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  useAnimatedScrollHandler, 
  interpolate, 
  Extrapolate, 
  runOnJS, 
  withRepeat, 
  withSequence, 
  withDelay, 
  Easing 
} from 'react-native-reanimated';
import { PageWrapper } from './index';

// Define interfaces for type safety
interface TestimonialData {
  text: string;
  highlightedText: string;
  name: string;
  role: string;
  company: string;
  metric: string;
  image: any; // Using 'any' for image require statements
  industry: string;
}

interface TestimonialItemProps extends TestimonialData {
  index: number;
  scrollX: Animated.SharedValue<number>;
  cardWidth: number;
  viewportWidth: number;
}

const testimonialsData: TestimonialData[] = [
  {
    text: "SiteSnap has revolutionized how we handle project documentation. The time savings are incredible.",
    highlightedText: "time savings are incredible",
    name: "Alex Morgan",
    role: "Project Manager",
    company: "BuildCorp Inc.",
    metric: "40% reduction in documentation time",
    image: require('../../assets/images/dashboard-preview.png'), // Using existing image
    industry: "Construction"
  },
  {
    text: "The collaboration features are game-changing. Our team communication has improved significantly.",
    highlightedText: "team communication has improved significantly",
    name: "Sarah Chen",
    role: "Team Lead",
    company: "Elite Inspections",
    metric: "85% faster issue resolution",
    image: require('../../assets/images/dashboard-preview.png'), // Using existing image
    industry: "Field Service"
  },
  {
    text: "The analytics dashboard provides invaluable insights for our project management.",
    highlightedText: "invaluable insights",
    name: "James Wilson",
    role: "Operations Director",
    company: "TechMaintain Co.",
    metric: "30% increase in project efficiency",
    image: require('../../assets/images/dashboard-preview.png'), // Using existing image
    industry: "Inspection"
  },
  {
    text: "Linking photos directly to tasks has saved us countless hours in verification.",
    highlightedText: "saved us countless hours",
    name: "Maria Garcia",
    role: "Site Supervisor",
    company: "ConstructAll",
    metric: "50% faster photo verification",
    image: require('../../assets/images/dashboard-preview.png'), // Using existing image
    industry: "General Contracting"
  },
  {
    text: "Automated reporting is incredibly intuitive and saves our team so much administrative overhead.",
    highlightedText: "incredibly intuitive",
    name: "David Lee",
    role: "Compliance Officer",
    company: "InfraSource",
    metric: "Reduced report errors by 90%",
    image: require('../../assets/images/dashboard-preview.png'), // Using existing image
    industry: "Infrastructure"
  },
  // Add 3 more for a total of 8
  {
    text: "The ease of use is fantastic. Our field team adopted it instantly.",
    highlightedText: "ease of use is fantastic",
    name: "Emily Carter",
    role: "Field Technician",
    company: "ServicePro Solutions",
    metric: "Reduced training time by 60%",
    image: require('../../assets/images/dashboard-preview.png'), // Using existing image
    industry: "Field Service"
  },
  {
    text: "Real-time updates keep everyone on the same page, eliminating confusion.",
    highlightedText: "everyone on the same page",
    name: "Michael Brown",
    role: "Construction Foreman",
    company: "BuildRight Contractors",
    metric: "Improved team sync by 95%",
    image: require('../../assets/images/dashboard-preview.png'), // Using existing image
    industry: "Construction"
  },
  {
    text: "Customer support is top-notch! They helped us customize reports perfectly.",
    highlightedText: "support is top-notch",
    name: "Jessica Green",
    role: "Admin Manager",
    company: "InspectNow Ltd.",
    metric: "100% satisfaction with support",
    image: require('../../assets/images/dashboard-preview.png'), // Using existing image
    industry: "Inspection"
  }
];

// Duplicate data for infinite loop effect
const tripleTestimonials = [...testimonialsData, ...testimonialsData, ...testimonialsData];

// Placeholder logos - replace with actual logo sources
const companyLogos = Array(5).fill(require('../../assets/images/dashboard-preview.png'));

// Star Rating component
const StarRating = ({ rating = 5 }) => {
  return (
    <View style={styles.starContainer}>
      {[...Array(rating)].map((_, i) => (
        <FontAwesome key={i} name="star" size={20} color="#FFC107" style={styles.star} />
      ))}
    </View>
  );
};

// Testimonial Item with Vertical Animation
const TestimonialItem = ({ 
  text, highlightedText, name, role, company, metric, image, industry, 
  index, scrollX, cardWidth, viewportWidth 
}: TestimonialItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate the center position of this card within the entire scrollable content
  const itemCenterPosition = index * cardWidth + cardWidth / 2;

  const animatedStyle = useAnimatedStyle(() => {
    // Calculate the position of the card's center relative to the viewport's center
    const relativeCenter = itemCenterPosition - scrollX.value - viewportWidth / 2;
    
    // Define the range where the vertical animation should happen
    // Animate when the card is within +/- half the viewport width from the center
    const inputRange = [-viewportWidth / 2, 0, viewportWidth / 2];
    
    // Define the output range for translateY (5px up, 5px down = 10px total difference)
    const outputRange = [5, -5, 5];
    
    const translateY = interpolate(
      relativeCenter,
      inputRange,
      outputRange,
      Extrapolate.CLAMP // Clamp the value when outside the range
    );
    
    return {
      transform: [{ translateY }],
    };
  });
  
  // Format text with highlighted portion
  const formattedText = () => {
    if (!highlightedText) return <Text style={styles.testimonialText}>"{text}"</Text>;
    const parts = text.split(highlightedText);
    return (
      <Text style={styles.testimonialText}>
        "{parts[0]}
        <Text style={styles.highlightedText}>{highlightedText}</Text>
        {parts[1]}"
      </Text>
    );
  };
  
  // Create conditional props for web only
  const webProps = Platform.OS === 'web' ? {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  } : {};

  return (
    <Animated.View 
      style={[
        styles.testimonialCard,
        animatedStyle,
        isHovered && styles.testimonialCardHovered,
      ]} 
      {...webProps}
    >
      <StarRating rating={5} />
      {formattedText()}
      <View style={styles.metricContainer}>
        <MaterialIcons name="trending-up" size={14} color="#6A47B8" style={styles.metricIcon} />
        <Text style={styles.metricText}>{metric}</Text>
      </View>
      <View style={styles.authorInfo}>
        <Image source={image} style={styles.authorImage} />
        <View>
          <Text style={styles.authorName}>{name}</Text>
          <Text style={styles.authorRole}>{role}, {company}</Text>
          <View style={styles.industryTag}>
            <Text style={styles.industryText}>{industry}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const TestimonialsSection = () => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const cardWidth = 360; // Fixed card width for consistency
  const viewportWidth = useWindowDimensions().width;
  const autoScrollSpeed = 0.1; // Pixels per millisecond (slowed down to 1 pixel per 10ms)
  const isScrolling = useRef(true);

  // Setup continuous auto-scrolling
  useEffect(() => {
    // Calculate the total width of all original testimonials
    const totalContentWidth = testimonialsData.length * cardWidth;
    let lastTime: number;
    let frameId: number;
    
    // Create continuous animation function
    const continuousScroll = (time: number) => {
      if (lastTime) {
        const deltaTime = time - lastTime;
        if (isScrolling.current) {
          // Move the scroll position
          scrollX.value += autoScrollSpeed * deltaTime;
          
          // If we've scrolled past the first set of cards, reset to beginning of second set
          if (scrollX.value >= totalContentWidth * 2) {
            scrollX.value = totalContentWidth;
          }
          
          // Scroll the actual view
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              x: scrollX.value,
              animated: false
            });
          }
        }
      }
      lastTime = time;
      frameId = requestAnimationFrame(continuousScroll);
    };
    
    // Start the animation loop
    frameId = requestAnimationFrame(continuousScroll);
    
    // Set initial position to start of middle set for best looping
    scrollX.value = totalContentWidth;
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: totalContentWidth,
        animated: false
      });
    }
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [cardWidth, autoScrollSpeed]);

  // Handle scroll events
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      runOnJS(() => { isScrolling.current = false; });
    },
    onEndDrag: () => {
      // Resume auto-scrolling after a short delay
      setTimeout(() => {
        runOnJS(() => { isScrolling.current = true; });
      }, 1000);
    },
  });

  // For testimonial video
  const [showVideo, setShowVideo] = useState(false);

  return (
    <PageWrapper backgroundColor="#F9FAFB">
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Loved by teams worldwide</Text>
        <Text style={styles.sectionSubtitle}>See what our customers have to say about SiteSnap</Text>
        
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollViewContainer}
          decelerationRate="normal"
        >
          {tripleTestimonials.map((testimonial, index) => (
            <TestimonialItem
              key={`${testimonial.name}-${index}`}
              {...testimonial}
              index={index}
              scrollX={scrollX}
              cardWidth={cardWidth}
              viewportWidth={viewportWidth}
            />
          ))}
        </Animated.ScrollView>
        
        {/* Video Testimonial */}
        <View style={styles.videoTestimonialContainer}>
          <Text style={styles.videoTitle}>Hear from our customers</Text>
          <TouchableOpacity 
            style={styles.videoThumbnail}
            onPress={() => setShowVideo(true)}
          >
            <Image 
              source={require('../../assets/images/dashboard-preview.png')} 
              style={styles.videoImage}
              resizeMode="cover"
            />
            <View style={styles.playButtonOverlay}>
              <FontAwesome name="play-circle" size={64} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.videoCaption}>
            "How TechMaintain improved field documentation by 73%"
          </Text>
        </View>

        {/* Company Logos */}
        <View style={styles.logosContainer}>
          <Text style={styles.logosTitle}>Trusted by leading companies</Text>
          <View style={styles.logosGrid}>
            {companyLogos.map((logo, index) => (
              <View key={index} style={styles.logoContainer}>
                <Image source={logo} style={styles.logoImage} resizeMode="contain" />
              </View>
            ))}
          </View>
        </View>
      </View>
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    maxWidth: 600,
  },
  scrollViewContainer: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    height: 380, // Fixed height for consistent card presentation
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    width: 360, // Fixed width for all platforms
    height: 340, // Fixed height for all platforms
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 16, // Equal spacing between cards
  },
  testimonialCardHovered: {
    ...Platform.select({
      web: {
        transform: [{ translateY: -8 }],
        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  testimonialText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
    flexGrow: 1,
    textAlign: 'center',
  },
  highlightedText: {
    fontWeight: '700',
    color: '#4361EE',
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(106, 71, 184, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 'auto',
  },
  metricIcon: {
    marginRight: 6,
  },
  metricText: {
    fontSize: 14,
    color: '#6A47B8',
    fontWeight: '500',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  authorImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: '#E5E7EB',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  authorRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  industryTag: {
    backgroundColor: '#E6F7F2',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  industryText: {
    fontSize: 12,
    color: '#00BA88',
    fontWeight: '500',
  },
  videoTestimonialContainer: {
    marginTop: 64,
    width: '100%',
    maxWidth: 800,
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoCaption: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  logosContainer: {
    marginTop: 64,
    width: '100%',
    maxWidth: 1000,
    alignItems: 'center',
  },
  logosTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  logosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 40,
    width: '100%',
  },
  logoContainer: {
    width: 140,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoImage: {
    height: '100%',
    width: '100%',
    opacity: 0.7,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});

export default TestimonialsSection; 