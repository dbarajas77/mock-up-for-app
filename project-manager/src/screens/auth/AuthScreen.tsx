import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
  const [activeTab, setActiveTab] = useState<AuthTab>(AuthTab.LOGIN);

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

            <View style={AuthStyles.footer}>
              <Text style={AuthStyles.footerText}>
                Secure authentication, powered by Supabase
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
