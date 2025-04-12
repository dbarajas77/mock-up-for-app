import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isDesktop = width >= 768;

  // Get current route name
  const currentRouteName = route.name;

  // Helper function to check if a route is active
  const isRouteActive = (routeName) => {
    return currentRouteName === routeName;
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/siteSnap-logo.svg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {isDesktop ? (
          <>
            <View style={styles.navContainer}>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Landing')}>
                <Text style={[styles.navText, isRouteActive('Landing') && styles.activeNavLink]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Features')}>
                <Text style={[styles.navText, isRouteActive('Features') && styles.activeNavLink]}>Features</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Pricing')}>
                <Text style={[styles.navText, isRouteActive('Pricing') && styles.activeNavLink]}>Pricing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Resources')}>
                <Text style={[styles.navText, isRouteActive('Resources') && styles.activeNavLink]}>Resources</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Support')}>
                <Text style={[styles.navText, isRouteActive('Support') && styles.activeNavLink]}>Support</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
            >
              <Text style={styles.ctaText}>Login / Sign Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.mobileMenuButton}
            onPress={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Text style={styles.mobileMenuIcon}>☰</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isDesktop && showMobileMenu && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity style={styles.mobileNavItem} onPress={() => { navigation.navigate('Landing'); setShowMobileMenu(false); }}>
            <Text style={[styles.mobileNavText, isRouteActive('Landing') && styles.activeNavLink]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem} onPress={() => { navigation.navigate('Features'); setShowMobileMenu(false); }}>
            <Text style={[styles.mobileNavText, isRouteActive('Features') && styles.activeNavLink]}>Features</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem} onPress={() => { navigation.navigate('Pricing'); setShowMobileMenu(false); }}>
            <Text style={[styles.mobileNavText, isRouteActive('Pricing') && styles.activeNavLink]}>Pricing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem} onPress={() => { navigation.navigate('Resources'); setShowMobileMenu(false); }}>
            <Text style={[styles.mobileNavText, isRouteActive('Resources') && styles.activeNavLink]}>Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem} onPress={() => { navigation.navigate('Support'); setShowMobileMenu(false); }}>
            <Text style={[styles.mobileNavText, isRouteActive('Support') && styles.activeNavLink]}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mobileCta}
            onPress={() => { navigation.navigate('Auth', { screen: 'Login' }); setShowMobileMenu(false); }}
          >
            <Text style={styles.mobileCtaText}>Login / Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  logoContainer: {
  },
  logo: {
    width: 140,
    height: 48,
    resizeMode: 'contain',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  navItem: {
    marginHorizontal: 16,
    position: 'relative',
    paddingBottom: 2,
  },
  navText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activeNavLink: {
    color: '#00BA88',
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: '#00BA88',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  mobileMenuButton: {
    padding: 8,
  },
  mobileMenuIcon: {
    fontSize: 24,
    color: '#333',
  },
  mobileMenu: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  mobileNavItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mobileNavText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  mobileCta: {
    backgroundColor: '#00BA88',
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 16,
    alignItems: 'center',
  },
  mobileCtaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Header; 