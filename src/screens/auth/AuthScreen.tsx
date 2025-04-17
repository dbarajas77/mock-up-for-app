import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AuthStyles from './AuthStyles';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetPasswordForm from './ResetPasswordForm';

enum AuthTab {
  LOGIN = 'login',
  SIGNUP = 'signup',
  RESET = 'reset',
}

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>(AuthTab.SIGNUP);
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  useEffect(() => {
    // Check route params for explicit screen selection
    console.log('AuthScreen: Route params:', route.params);
    if (route.params?.screen === 'Login') {
      setActiveTab(AuthTab.LOGIN);
    } else if (route.params?.screen === 'Reset') {
      setActiveTab(AuthTab.RESET);
    }
    // Otherwise keep SIGNUP as default
  }, [route.params]);

  const renderTabContent = () => {
    switch (activeTab) {
      case AuthTab.LOGIN:
        return <LoginForm onForgotPassword={() => setActiveTab(AuthTab.RESET)} />;
      case AuthTab.SIGNUP:
        return <SignupForm onLoginPress={() => setActiveTab(AuthTab.LOGIN)} />;
      case AuthTab.RESET:
        return <ResetPasswordForm onBackToLogin={() => setActiveTab(AuthTab.LOGIN)} />;
      default:
        return <LoginForm onForgotPassword={() => setActiveTab(AuthTab.RESET)} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={AuthStyles.container}>
          <View style={AuthStyles.authWrapper}>
            <View style={[AuthStyles.formContainer, { minHeight: 550 }]}>
              <View style={AuthStyles.header}>
                <Text style={AuthStyles.welcomeText}>Welcome</Text>
                <Text style={AuthStyles.subheaderText}>Sign in to access the dashboard</Text>
              </View>

              <View style={AuthStyles.tabContainer}>
                <TouchableOpacity
                  style={[
                    AuthStyles.tabButton,
                    activeTab === AuthTab.LOGIN && AuthStyles.activeTab,
                  ]}
                  onPress={() => setActiveTab(AuthTab.LOGIN)}
                >
                  <Text
                    style={[
                      AuthStyles.tabText,
                      activeTab === AuthTab.LOGIN && AuthStyles.activeTabText,
                    ]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    AuthStyles.tabButton,
                    activeTab === AuthTab.SIGNUP && AuthStyles.activeTab,
                  ]}
                  onPress={() => setActiveTab(AuthTab.SIGNUP)}
                >
                  <Text
                    style={[
                      AuthStyles.tabText,
                      activeTab === AuthTab.SIGNUP && AuthStyles.activeTabText,
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    AuthStyles.tabButton,
                    activeTab === AuthTab.RESET && AuthStyles.activeTab,
                  ]}
                  onPress={() => setActiveTab(AuthTab.RESET)}
                >
                  <Text
                    style={[
                      AuthStyles.tabText,
                      activeTab === AuthTab.RESET && AuthStyles.activeTabText,
                    ]}
                  >
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>

              {renderTabContent()}

              {/* Back to Home Link */}
              <TouchableOpacity 
                style={AuthStyles.backToHomeButton}
                onPress={() => navigation.navigate('Landing')}
              >
                <Text style={AuthStyles.backToHomeButtonText}>← Back to Home</Text>
              </TouchableOpacity>

              <View style={AuthStyles.footer}>
                <Text style={AuthStyles.footerText}>
                  Secure authentication, powered by Supabase
                </Text>
              </View>
            </View>

            {!isSmallScreen && (
              <View style={AuthStyles.heroContainer}>
                <Image 
                  source={require('../../../assets/hero guy.png')}
                  style={AuthStyles.heroImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
