import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ScrollView,
  Pressable, // Use Pressable instead of Touchable components
} from 'react-native';
// Replace react-native-svg with a more compatible SVG solution
import * as Svg from 'react-native-svg';
import { PageWrapper } from './index';
import { useGesture } from '@use-gesture/react'; // Import gesture handling

// --- Colors from new SVG --- 
const COLORS_TIMELINE = {
  background: '#F8F9FB',     // Light gray-white for main background
  textDark: '#333333',       // Dark text for titles
  textLight: '#666666',      // Gray for regular text
  border: '#e5e7eb',         // Light gray for borders
  timelinePath: '#00c389',   // Example green, adjust if needed
  cardBg: '#ffffff',         // White for card backgrounds
  step1: { circle: '#eaecff', text: '#6366f1', iconBg: '#eaecff', statBg: '#eaecff' },
  step2: { circle: '#ffe2ec', text: '#ec4899', iconBg: '#ffe2ec', statBg: '#ffe2ec' },
  step3: { circle: '#dcfce7', text: '#10b981', iconBg: '#dcfce7', statBg: '#dcfce7' },
  step4: { circle: '#f3e8ff', text: '#a855f7', iconBg: '#f3e8ff', statBg: '#f3e8ff' },
};

// Constants for layout calculations - different sizes for different breakpoints
const CARD_WIDTH = 220;
const STEP_SPACING = 280;

// Mobile card width will be different
const MOBILE_CARD_WIDTH = 300;
const SMALL_TABLET_CARD_WIDTH = 260;
const TABLET_CARD_WIDTH = 240;

// --- Updated stepsData based on new SVG --- 
const stepsData = [
  {
    step: 1,
    title: 'Create Project',
    description: [
      'Set up your project with all',
      'relevant details, locations,',
      'and team members in minutes.',
    ],
    stat: 'Save 30 minutes on setup',
    icon: 'project', // Key to select visual
  },
  {
    step: 2,
    title: 'Add Tasks & Photos',
    description: [
      'Document your work with photos',
      'and organize them by task,',
      'location, or custom categories.',
    ],
    stat: 'Improve quality by 80%',
    icon: 'photos', // Key to select visual
  },
  {
    step: 3,
    title: 'Generate Report',
    description: [
      'Create professional reports with',
      'a few clicks using your project',
      'data and documentation.',
    ],
    stat: 'Reduce time by 75%',
    icon: 'report', // Key to select visual
  },
  {
    step: 4,
    title: 'Share & Collaborate',
    description: [
      'Instantly share reports with',
      'stakeholders and collaborate',
      'with your team in real-time.',
    ],
    stat: 'Improve communication',
    icon: 'collaborate', // Key to select visual
  },
];

// --- New StepItemTimeline Component --- 
const StepItemTimeline = ({ stepData, isFirst, isLast, isMobile, isTablet, isSmallTablet, isExtraSmall }) => {
  const { step, title, description, stat, icon } = stepData;
  const colorScheme = COLORS_TIMELINE[`step${step}`];
  
  // Add gesture handler for better touch interactions
  const bind = useGesture({
    onHover: ({ hovering }) => {
      // You can add hover effects here if needed
    },
    onClick: () => {
      // Handle click events if needed
      console.log(`Clicked on step ${step}`);
    }
  });

  const renderIconVisual = () => {
    // Basic placeholder visuals for the new design
    const iconColor = colorScheme.text;
    switch (icon) {
      case 'project':
        return (
          <View style={styles.cardIconVisual}>
            <View style={{ width: 30, height: 30, borderRadius: 5, backgroundColor: iconColor }} >
              <View style={{width: 10, height: 10, borderRadius: 2, backgroundColor: 'white', position: 'absolute', top: 10, left: 10}} />
            </View>
          </View>
        );
      case 'photos':
         return (
          <View style={styles.cardIconVisual}>
            <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: iconColor, position: 'absolute', left: 5, top: 10}} />
            <View style={{width: 20, height: 30, borderRadius: 2, backgroundColor: iconColor, position: 'absolute', left: 25, top: 5}} >
               <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: 'white', position: 'absolute', top: 12, left: 7}} />
            </View>
          </View>
        );
      case 'report':
         return (
          <View style={styles.cardIconVisual}>
            <View style={{width: 40, height: 30, borderRadius: 2, backgroundColor: iconColor, position: 'absolute', top: 5, left: 0}}> 
              <View style={{height: 5, width: 30, borderRadius: 2, backgroundColor: 'white', marginTop: 3, marginLeft: 5}} />
              <View style={{height: 5, width: 20, borderRadius: 2, backgroundColor: 'white', marginTop: 3, marginLeft: 5}} />
              <View style={{height: 5, width: 25, borderRadius: 2, backgroundColor: 'white', marginTop: 3, marginLeft: 5}} />
            </View>
          </View>
        );
      case 'collaborate':
        return (
          <View style={styles.cardIconVisual}>
            <View style={{width: 16, height: 16, borderRadius: 8, backgroundColor: iconColor, position: 'absolute', left: 0, top: 10}} >
               <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: 'white', position: 'absolute', top: 5, left: 5}} />
            </View>
            <View style={{width: 16, height: 16, borderRadius: 8, backgroundColor: iconColor, position: 'absolute', left: 15, top: 20}} >
               <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: 'white', position: 'absolute', top: 5, left: 5}} />
            </View>
             <View style={{width: 16, height: 16, borderRadius: 8, backgroundColor: iconColor, position: 'absolute', left: 30, top: 10}} >
               <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: 'white', position: 'absolute', top: 5, left: 5}} />
            </View>
          </View>
        );
      default: return <View style={styles.cardIconVisual} />;
    }
  };

  return (
    <View style={[
      styles.stepItemContainer, 
      isTablet && styles.stepItemContainerTablet,
      isSmallTablet && styles.stepItemContainerSmallTablet,
      isMobile && styles.stepItemContainerMobile,
      isExtraSmall && styles.stepItemContainerExtraSmall
    ]}>
      {/* Top Circle Indicator */}
      <Pressable style={({ pressed }) => [
        styles.stepCircle,
        isTablet && styles.stepCircleTablet,
        isSmallTablet && styles.stepCircleSmallTablet,
        isMobile && styles.stepCircleMobile,
        isExtraSmall && styles.stepCircleExtraSmall,
        { backgroundColor: colorScheme.circle, opacity: pressed ? 0.8 : 1 }
      ]}>
        <Text style={[
          styles.stepCircleText,
          isTablet && styles.stepCircleTextTablet,
          isSmallTablet && styles.stepCircleTextSmallTablet,
          isMobile && styles.stepCircleTextMobile,
          isExtraSmall && styles.stepCircleTextExtraSmall,
          { color: colorScheme.text }
        ]}>{step}</Text>
      </Pressable>

      {/* Card Below */}
      <View style={[
        styles.stepCard,
        isTablet && styles.stepCardTablet,
        isSmallTablet && styles.stepCardSmallTablet,
        isMobile && styles.stepCardMobile,
        isExtraSmall && styles.stepCardExtraSmall
      ]}>
        {/* Icon Area */}
        <View style={[
          styles.cardIconArea, 
          isTablet && styles.cardIconAreaTablet,
          isSmallTablet && styles.cardIconAreaSmallTablet,
          isMobile && styles.cardIconAreaMobile,
          { backgroundColor: colorScheme.iconBg }
        ]}>
          {renderIconVisual()}
        </View>

        {/* Text Content - Wrap in container for consistent spacing */}
        <View style={[
          styles.cardTextContainer,
          isTablet && styles.cardTextContainerTablet,
          isSmallTablet && styles.cardTextContainerSmallTablet,
          isMobile && styles.cardTextContainerMobile
        ]}>
          <Text style={[
            styles.cardTitle,
            isTablet && styles.cardTitleTablet,
            isSmallTablet && styles.cardTitleSmallTablet,
            isMobile && styles.cardTitleMobile,
            isExtraSmall && styles.cardTitleExtraSmall
          ]}>{title}</Text>
          {description.map((line, index) => (
            <Text key={index} style={[
              styles.cardDescription,
              isTablet && styles.cardDescriptionTablet,
              isSmallTablet && styles.cardDescriptionSmallTablet,
              isMobile && styles.cardDescriptionMobile,
              isExtraSmall && styles.cardDescriptionExtraSmall
            ]}>{line}</Text>
          ))}
        </View>

        {/* Stats Box */}
        <View style={[
          styles.cardStatsBox,
          isTablet && styles.cardStatsBoxTablet,
          isSmallTablet && styles.cardStatsBoxSmallTablet,
          isMobile && styles.cardStatsBoxMobile,
          isExtraSmall && styles.cardStatsBoxExtraSmall,
          { backgroundColor: colorScheme.statBg }
        ]}>
          <Text style={[
            styles.cardStatsText,
            isTablet && styles.cardStatsTextTablet,
            isSmallTablet && styles.cardStatsTextSmallTablet,
            isMobile && styles.cardStatsTextMobile,
            isExtraSmall && styles.cardStatsTextExtraSmall,
            { color: colorScheme.text }
          ]}>{stat}</Text>
        </View>
      </View>
    </View>
  );
};
// --- End StepItemTimeline Component ---


const HowItWorksSection = () => {
  const { width } = useWindowDimensions();
  
  // More granular breakpoints
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isSmallTablet = width >= 576 && width < 768; // This handles the ~597px breakpoint
  const isMobile = width < 576;
  const isExtraSmall = width < 360;
  
  // Calculate total width needed for ScrollView content - adjust based on screen size
  let cardWidth, stepSpacing;
  
  if (isExtraSmall) {
    cardWidth = MOBILE_CARD_WIDTH - 40; // Even smaller for tiny screens
    stepSpacing = width * 0.85;
  } else if (isMobile) {
    cardWidth = MOBILE_CARD_WIDTH;
    stepSpacing = width * 0.85;
  } else if (isSmallTablet) {
    cardWidth = SMALL_TABLET_CARD_WIDTH;
    stepSpacing = width * 0.7; // More proportional spacing
  } else if (isTablet) {
    cardWidth = TABLET_CARD_WIDTH;
    stepSpacing = width * 0.6;
  } else {
    cardWidth = CARD_WIDTH;
    stepSpacing = STEP_SPACING;
  }
  
  const totalContentWidth = (stepsData.length * stepSpacing);
  const startPadding = Math.max((width - cardWidth) / 2, isMobile ? 20 : 40);
  const totalScrollViewWidth = totalContentWidth + startPadding * 2 - (stepSpacing / 2);

  // Replace SVG with a simpler solution - adjusted for responsiveness
  const renderTimelineLine = () => {
    // Calculate proper position based on screen size
    const topPosition = isExtraSmall ? 30 : isSmallTablet ? 32 : 35;
    
    return (
      <View style={{
        position: 'absolute',
        top: topPosition,
        left: stepSpacing / 2,
        width: (stepsData.length - 1) * stepSpacing,
        height: isExtraSmall ? 3 : 4,
        backgroundColor: COLORS_TIMELINE.timelinePath,
        borderRadius: 2,
        borderStyle: 'solid',
        borderColor: COLORS_TIMELINE.timelinePath,
      }} />
    );
  };

  return (
    <PageWrapper backgroundColor={COLORS_TIMELINE.background}>
      <View style={[
        styles.container,
        isTablet && styles.containerTablet,
        isSmallTablet && styles.containerSmallTablet,
        isMobile && styles.containerMobile,
        isExtraSmall && styles.containerExtraSmall
      ]}>
        {/* Header Text */}
        <View style={[
          styles.headerContainer,
          isTablet && styles.headerContainerTablet,
          isSmallTablet && styles.headerContainerSmallTablet,
          isMobile && styles.headerContainerMobile,
          isExtraSmall && styles.headerContainerExtraSmall
        ]}>
          <Text style={[
            styles.sectionTitle,
            isTablet && styles.sectionTitleTablet,
            isSmallTablet && styles.sectionTitleSmallTablet,
            isMobile && styles.sectionTitleMobile,
            isExtraSmall && styles.sectionTitleExtraSmall
          ]}>How It Works</Text>
          <Text style={[
            styles.sectionSubtitle,
            isTablet && styles.sectionSubtitleTablet,
            isSmallTablet && styles.sectionSubtitleSmallTablet,
            isMobile && styles.sectionSubtitleMobile,
            isExtraSmall && styles.sectionSubtitleExtraSmall
          ]}>
            Getting started with SiteSnap is easy - follow these simple steps
          </Text>
        </View>

        {/* Timeline Container - Horizontal Scroll */}
        <View style={[
          styles.timelineOuterContainer,
          isTablet && styles.timelineOuterContainerTablet,
          isSmallTablet && styles.timelineOuterContainerSmallTablet,
          isMobile && styles.timelineOuterContainerMobile,
          isExtraSmall && styles.timelineOuterContainerExtraSmall
        ]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingLeft: startPadding,
              paddingRight: startPadding,
              width: totalScrollViewWidth,
              height: isExtraSmall ? 450 : isMobile ? 480 : isSmallTablet ? 460 : isTablet ? 440 : 480,
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            {/* Timeline Path - Replaced SVG with View */}
            <View style={styles.timelinePathContainer}>
              {renderTimelineLine()}
            </View>
            
            {/* Step Items - Use absolute positioning on timeline */}
            {stepsData.map((item, index) => (
              // Position each step absolutely along the horizontal axis
              <View 
                key={item.step} 
                style={[
                  styles.stepItemWrapper,
                  { left: index * stepSpacing },
                  isTablet && styles.stepItemWrapperTablet,
                  isSmallTablet && styles.stepItemWrapperSmallTablet,
                  isMobile && styles.stepItemWrapperMobile,
                  isExtraSmall && styles.stepItemWrapperExtraSmall
                ]} 
              >
                <StepItemTimeline 
                  stepData={item} 
                  isFirst={index === 0} 
                  isLast={index === stepsData.length - 1}
                  isTablet={isTablet}
                  isSmallTablet={isSmallTablet}
                  isMobile={isMobile}
                  isExtraSmall={isExtraSmall}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Footer Text */}
        <Text style={[
          styles.footerText,
          isTablet && styles.footerTextTablet,
          isSmallTablet && styles.footerTextSmallTablet,
          isMobile && styles.footerTextMobile,
          isExtraSmall && styles.footerTextExtraSmall
        ]}>
          With SiteSnap, you'll spend less time on documentation and more time on what matters.
        </Text>
      </View>
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  // Base styles
  container: {
    paddingVertical: 100,
    width: '100%',
    alignItems: 'center',
  },
  // Tablet styles
  containerTablet: {
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  // Small tablet styles (~597px)
  containerSmallTablet: {
    paddingVertical: 60,
    paddingHorizontal: 12,
  },
  // Mobile styles
  containerMobile: {
    paddingVertical: 60,
    paddingHorizontal: 8,
  },
  // Extra small styles
  containerExtraSmall: {
    paddingVertical: 40,
    paddingHorizontal: 4,
  },
  
  // Header container styles
  headerContainer: {
    marginBottom: 80,
    maxWidth: 900,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContainerTablet: {
    marginBottom: 60,
    maxWidth: 800,
  },
  headerContainerSmallTablet: {
    marginBottom: 50,
    paddingHorizontal: 16,
    maxWidth: '100%',
  },
  headerContainerMobile: {
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  headerContainerExtraSmall: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  
  // Section title styles
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS_TIMELINE.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitleTablet: {
    fontSize: 30,
    marginBottom: 18,
  },
  sectionTitleSmallTablet: {
    fontSize: 28,
    marginBottom: 16,
  },
  sectionTitleMobile: {
    fontSize: 28,
    marginBottom: 16,
  },
  sectionTitleExtraSmall: {
    fontSize: 24,
    marginBottom: 12,
  },
  
  // Section subtitle styles
  sectionSubtitle: {
    fontSize: 18,
    color: COLORS_TIMELINE.textLight,
    textAlign: 'center',
  },
  sectionSubtitleTablet: {
    fontSize: 17,
  },
  sectionSubtitleSmallTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionSubtitleMobile: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionSubtitleExtraSmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Timeline outer container
  timelineOuterContainer: {
    width: '100%',
    height: 450,
    marginTop: 40,
    marginBottom: 40,
  },
  timelineOuterContainerTablet: {
    height: 440,
    marginTop: 30,
    marginBottom: 30,
  },
  timelineOuterContainerSmallTablet: {
    height: 460,
    marginTop: 30,
    marginBottom: 30,
  },
  timelineOuterContainerMobile: {
    height: 480,
    marginTop: 20,
    marginBottom: 20,
  },
  timelineOuterContainerExtraSmall: {
    height: 450,
    marginTop: 16,
    marginBottom: 16,
  },
  
  // Timeline path container
  timelinePathContainer: {
    position: 'absolute',
    top: 15, 
    left: 0, 
    height: 60,
    zIndex: 1,
    marginLeft: 0, 
  },
  
  // Step item wrapper
  stepItemWrapper: {
    position: 'absolute',
    top: 0,
    width: CARD_WIDTH,
    alignItems: 'center',
    zIndex: 2,
  },
  stepItemWrapperTablet: {
    width: TABLET_CARD_WIDTH,
  },
  stepItemWrapperSmallTablet: {
    width: SMALL_TABLET_CARD_WIDTH,
  },
  stepItemWrapperMobile: {
    width: MOBILE_CARD_WIDTH,
  },
  stepItemWrapperExtraSmall: {
    width: MOBILE_CARD_WIDTH - 40,
  },
  
  // Step item container
  stepItemContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: CARD_WIDTH,
    height: 40,
  },
  stepItemContainerTablet: {
    width: TABLET_CARD_WIDTH,
  },
  stepItemContainerSmallTablet: {
    width: SMALL_TABLET_CARD_WIDTH,
  },
  stepItemContainerMobile: {
    width: MOBILE_CARD_WIDTH,
  },
  stepItemContainerExtraSmall: {
    width: MOBILE_CARD_WIDTH - 40,
  },
  
  // Step circle
  stepCircle: {
    width: 70,
    height: 70, 
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    marginBottom: -15,
    borderWidth: 4,
    borderColor: COLORS_TIMELINE.background,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
  stepCircleTablet: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    marginBottom: -14,
  },
  stepCircleSmallTablet: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginBottom: -13,
  },
  stepCircleMobile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: -12,
  },
  stepCircleExtraSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: -10,
    borderWidth: 3,
  },
  
  // Step circle text
  stepCircleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepCircleTextTablet: {
    fontSize: 23,
  },
  stepCircleTextSmallTablet: {
    fontSize: 22,
  },
  stepCircleTextMobile: {
    fontSize: 22,
  },
  stepCircleTextExtraSmall: {
    fontSize: 18,
  },
  
  // Step card
  stepCard: {
    width: 220,
    height: 280,
    backgroundColor: COLORS_TIMELINE.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS_TIMELINE.border,
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 35,
    paddingHorizontal: 15,
    marginTop: 15,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  stepCardTablet: {
    width: TABLET_CARD_WIDTH,
    height: 270,
    paddingTop: 22,
    paddingBottom: 32,
    paddingHorizontal: 12,
  },
  stepCardSmallTablet: {
    width: SMALL_TABLET_CARD_WIDTH,
    height: 280,
    paddingTop: 22,
    paddingBottom: 32,
    paddingHorizontal: 12,
  },
  stepCardMobile: {
    width: MOBILE_CARD_WIDTH - 20,
    height: 290,
    paddingTop: 20,
    paddingBottom: 35,
    paddingHorizontal: 18,
  },
  stepCardExtraSmall: {
    width: MOBILE_CARD_WIDTH - 60,
    height: 260,
    paddingTop: 18,
    paddingBottom: 30,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  
  // Card text container
  cardTextContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  cardTextContainerTablet: {
    paddingHorizontal: 8,
    marginBottom: 18,
  },
  cardTextContainerSmallTablet: {
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  cardTextContainerMobile: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  
  // Card icon area
  cardIconArea: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardIconAreaTablet: {
    width: 75,
    height: 75,
    marginBottom: 12,
  },
  cardIconAreaSmallTablet: {
    width: 70,
    height: 70,
    marginBottom: 12,
  },
  cardIconAreaMobile: {
    width: 80,
    height: 80,
    marginBottom: 14,
  },
  
  // Card title
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS_TIMELINE.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  cardTitleTablet: {
    fontSize: 17,
    marginBottom: 10,
  },
  cardTitleSmallTablet: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardTitleMobile: {
    fontSize: 18,
    marginBottom: 10,
  },
  cardTitleExtraSmall: {
    fontSize: 16,
    marginBottom: 8,
  },
  
  // Card description
  cardDescription: {
    fontSize: 13,
    color: COLORS_TIMELINE.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 5,
    width: '100%',
    minHeight: 20,
  },
  cardDescriptionTablet: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  cardDescriptionSmallTablet: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 3,
  },
  cardDescriptionMobile: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  cardDescriptionExtraSmall: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 3,
  },
  
  // Card stats box
  cardStatsBox: {
    position: 'absolute',
    bottom: -15,
    left: 35,
    width: 150,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  cardStatsBoxTablet: {
    width: 140,
    height: 34,
    left: (TABLET_CARD_WIDTH - 140) / 2,
    borderRadius: 17,
  },
  cardStatsBoxSmallTablet: {
    width: 130,
    height: 32,
    left: (SMALL_TABLET_CARD_WIDTH - 130) / 2,
    borderRadius: 16,
  },
  cardStatsBoxMobile: {
    width: 160,
    height: 36,
    left: (MOBILE_CARD_WIDTH - 180) / 2,
    borderRadius: 18,
  },
  cardStatsBoxExtraSmall: {
    width: 120,
    height: 30,
    left: ((MOBILE_CARD_WIDTH - 60) - 120) / 2,
    borderRadius: 15,
    bottom: -12,
  },
  
  // Card stats text
  cardStatsText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  cardStatsTextTablet: {
    fontSize: 12,
  },
  cardStatsTextSmallTablet: {
    fontSize: 11,
  },
  cardStatsTextMobile: {
    fontSize: 13,
  },
  cardStatsTextExtraSmall: {
    fontSize: 10,
  },
  
  // Footer text
  footerText: {
    marginTop: 40,
    fontSize: 18,
    color: COLORS_TIMELINE.textLight,
    textAlign: 'center',
    paddingHorizontal: 40,
    maxWidth: 700,
  },
  footerTextTablet: {
    marginTop: 32,
    fontSize: 17,
    paddingHorizontal: 30,
    maxWidth: 600,
  },
  footerTextSmallTablet: {
    marginTop: 28,
    fontSize: 16,
    paddingHorizontal: 24,
    maxWidth: 550,
  },
  footerTextMobile: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginTop: 30,
    maxWidth: 500,
  },
  footerTextExtraSmall: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 12,
    marginTop: 24,
    maxWidth: 300,
  },
});

export default HowItWorksSection; 