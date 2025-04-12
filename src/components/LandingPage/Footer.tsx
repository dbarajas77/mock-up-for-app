import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // For social icons

const Footer = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const currentYear = new Date().getFullYear();
  
  return (
    <View style={styles.footer}>
      <View style={styles.contentContainer}>
        {/* Footer Top: Logo + Nav Columns */}
        <View style={[styles.footerTop, isDesktop && styles.footerTopDesktop]}>
          {/* Logo Area */}
          <View style={[styles.logoContainer, isDesktop && styles.logoContainerDesktop]}>
            <Image 
              source={require('../../assets/images/siteSnap-logo.svg')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Project Documentation Made Simple</Text>
          </View>
          
          {/* Nav Columns */}
          <View style={[styles.navColumnsContainer, isDesktop && styles.navColumnsContainerDesktop]}>
            {/* Product Column */}
            <View style={[styles.navColumn, isDesktop && styles.navColumnDesktop]}>
              <Text style={styles.columnTitle}>Product</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
                <Text style={styles.navLink}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Features')}>
                <Text style={styles.navLink}>Features</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Pricing')}>
                <Text style={styles.navLink}>Pricing</Text>
              </TouchableOpacity>
            </View>
            
            {/* Resources Column */}
            <View style={[styles.navColumn, isDesktop && styles.navColumnDesktop]}>
              <Text style={styles.columnTitle}>Resources</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Resources')}>
                <Text style={styles.navLink}>Documentation</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Resources')}>
                <Text style={styles.navLink}>Blog</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Resources')}>
                <Text style={styles.navLink}>Guides</Text>
              </TouchableOpacity>
            </View>
            
            {/* Company Column */}
            <View style={[styles.navColumn, isDesktop && styles.navColumnDesktop]}>
              <Text style={styles.columnTitle}>Company</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Support')}>
                <Text style={styles.navLink}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Support')}>
                <Text style={styles.navLink}>Support</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Support')}> 
                <Text style={styles.navLink}>Contact Us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        {/* Footer Bottom: Copyright, Legal, Social */}
        <View style={[styles.footerBottom, isDesktop && styles.footerBottomDesktop]}>
          <Text style={[styles.copyright, isDesktop && styles.copyrightDesktop]}>
            © {currentYear} SiteSnap. All rights reserved.
          </Text>
          
          <View style={[styles.legalLinks, isDesktop && styles.legalLinksDesktop]}>
            <TouchableOpacity onPress={() => navigation.navigate('Support')}> 
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Support')}> 
              <Text style={styles.legalLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.socialLinks}>
            {/* Replace with actual links and icons */}
            <TouchableOpacity style={styles.socialIcon} onPress={() => console.log('Twitter')}>
              <FontAwesome name="twitter" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={() => console.log('LinkedIn')}>
              <FontAwesome name="linkedin" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={() => console.log('GitHub')}>
              <FontAwesome name="github" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    backgroundColor: '#111827', // Dark background
    paddingVertical: 64,
    paddingHorizontal: 20,
  },
  contentContainer: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  // Footer Top Styles
  footerTop: { // Mobile default: column
    flexDirection: 'column',
  },
  footerTopDesktop: { // Desktop: row
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoContainer: { // Mobile
    marginBottom: 32,
  },
  logoContainerDesktop: { // Desktop
    marginBottom: 0,
    maxWidth: 280, // Max width for logo area
    marginRight: 32, // Space before nav columns
  },
  logo: {
    width: 140,
    height: 48,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: '#9CA3AF', // Light gray text
    lineHeight: 20,
  },
  navColumnsContainer: { // Mobile: column
    flexDirection: 'column',
  },
  navColumnsContainerDesktop: { // Desktop: row
    flexDirection: 'row',
    flex: 1, // Allow columns to take remaining space
    justifyContent: 'space-around', // Distribute columns
  },
  navColumn: { // Mobile
    marginBottom: 32,
  },
  navColumnDesktop: { // Desktop
    marginBottom: 0,
    // Width will be determined by flex distribution
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White title
    marginBottom: 16,
  },
  navLink: {
    fontSize: 14,
    color: '#9CA3AF', // Light gray link
    marginBottom: 12,
    lineHeight: 20,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#374151', // Darker gray divider
    marginVertical: 32,
  },
  // Footer Bottom Styles
  footerBottom: { // Mobile: column, centered
    flexDirection: 'column',
    alignItems: 'center',
  },
  footerBottomDesktop: { // Desktop: row, space-between
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyright: { // Mobile
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  copyrightDesktop: { // Desktop
    marginBottom: 0,
    textAlign: 'left',
  },
  legalLinks: { // Mobile
    flexDirection: 'row',
    marginBottom: 16,
  },
  legalLinksDesktop: { // Desktop
    marginBottom: 0,
  },
  legalLink: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  socialLinks: {
    flexDirection: 'row',
  },
  socialIcon: {
    // Style for the touchable area if needed
    padding: 8, // Add padding for easier touch
    marginHorizontal: 4, // Adjust spacing
  },
});

export default Footer; 