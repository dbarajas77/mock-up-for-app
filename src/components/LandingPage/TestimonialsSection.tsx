import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, ScrollView, Platform } from 'react-native';

const testimonialsData = [
  {
    text: "SiteSnap has transformed how we manage our construction projects. Report generation that used to take hours now takes minutes.",
    name: "Sarah Johnson",
    role: "Project Manager, BuildCorp Inc.",
    image: require('../../assets/images/dashboard-preview.png'), // Placeholder
  },
  {
    text: "The ability to link photos directly to tasks and locations has eliminated confusion and improved our compliance documentation.",
    name: "Michael Chen",
    role: "Operations Director, Elite Inspections",
    image: require('../../assets/images/dashboard-preview.png'), // Placeholder
  },
  {
    text: "Our team has seen a 40% reduction in documentation time. The automated reporting feature alone has paid for itself.",
    name: "Jessica Rivera",
    role: "Field Service Manager, TechMaintain Co.",
    image: require('../../assets/images/dashboard-preview.png'), // Placeholder
  },
];

// Placeholder logos - replace with actual logo sources
const companyLogos = Array(5).fill(require('../../assets/images/dashboard-preview.png'));

const TestimonialItem = ({ text, name, role, image }) => (
  <View style={styles.testimonialItem}>
    <Text style={styles.testimonialText}>"{text}"</Text>
    <View style={styles.authorInfo}>
      <Image source={image} style={styles.authorImage} />
      <View>
        <Text style={styles.authorName}>{name}</Text>
        <Text style={styles.authorRole}>{role}</Text>
      </View>
    </View>
  </View>
);

const TestimonialsSection = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>What Our Users Say</Text>
      
      {/* Testimonials Layout: Row for desktop, ScrollView for smaller */}
      {isDesktop ? (
        <View style={styles.testimonialsGridDesktop}>
          {testimonialsData.map((testimonial, index) => (
            <TestimonialItem 
              key={index} 
              text={testimonial.text} 
              name={testimonial.name} 
              role={testimonial.role} 
              image={testimonial.image} 
            />
          ))}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.testimonialsScrollMobile}>
          {testimonialsData.map((testimonial, index) => (
            <TestimonialItem 
              key={index} 
              text={testimonial.text} 
              name={testimonial.name} 
              role={testimonial.role} 
              image={testimonial.image} 
            />
          ))}
        </ScrollView>
      )}

      {/* Company Logos */}
      <View style={styles.logosContainer}>
        <Text style={styles.logosTitle}>Trusted by leading companies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.logosScroll}>
          {companyLogos.map((logo, index) => (
            <Image key={index} source={logo} style={styles.logoImage} resizeMode="contain" />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB', // Light gray background
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 48,
  },
  // Desktop Testimonials Layout
  testimonialsGridDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    gap: 32,
  },
  // Mobile/Tablet Testimonials Layout
  testimonialsScrollMobile: {
    paddingHorizontal: 20, // Give some padding within the scroll view
    gap: 16,
  },
  testimonialItem: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    // Desktop: Width is determined by grid layout (flex: 1 implicitly)
    width: Platform.OS === 'web' ? 'calc(33.333% - 22px)' : 300, // Explicit width for scroll view items
    marginBottom: 16, // Add margin for scroll view
    minHeight: 220, // Ensure items have some minimum height
  },
  testimonialText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 24,
    flexGrow: 1, // Allow text to take available space
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto', // Push author to bottom
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24, // Circle
    marginRight: 12,
    backgroundColor: '#E5E7EB', // Placeholder background
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  authorRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Company Logos Section
  logosContainer: {
    marginTop: 48,
    width: '100%',
    maxWidth: 1000,
    alignItems: 'center',
  },
  logosTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  logosScroll: {
    gap: 24,
    alignItems: 'center',
  },
  logoImage: {
    height: 40,
    width: 100, // Give logos some width
    opacity: 0.6, // Make them grayscale-like
  },
});

export default TestimonialsSection; 