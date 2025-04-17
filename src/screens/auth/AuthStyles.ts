import { StyleSheet, Platform } from 'react-native';

const AuthStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  authWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  heroContainer: {
    flex: 1,
    maxWidth: 500,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: 500,
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00BA88', // Changed from #001532 to match the green theme
    marginBottom: 10,
  },
  subheaderText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#9ca3af', // Gray dark color
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Gray primary color
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00BA88', // Changed from #001532 to match the green theme
  },
  tabText: {
    fontSize: 16,
    color: '#9ca3af', // Gray dark color
  },
  activeTabText: {
    color: '#00BA88', // Changed from #001532 to match the green theme
    fontWeight: 'bold',
  },
  formContent: {
    minHeight: 300, // Fixed height for form content
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4b5563',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e5e7eb', // Gray primary color
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 5,
    backgroundColor: '#f9fafb',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'transparent', // Make background transparent since parent has bg color
    borderWidth: 0, // Remove border since parent has border
  },
  passwordVisibilityToggle: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    backgroundColor: '#00BA88', // Changed from #001532 to match the green theme
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#00BA88', // Changed from #001532 to match the green theme
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 5,
    fontSize: 14,
  },
  successText: {
    color: '#10b981',
    marginTop: 5,
    fontSize: 14,
  },
  switchAuthButton: {
    marginTop: 15,
    padding: 10,
  },
  switchAuthText: {
    color: '#00BA88', // Changed from #001532 to match the green theme
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#9ca3af', // Gray dark color
    fontSize: 12,
  },
  // Back to Home link styles
  backToHomeButton: {
    marginTop: 20, // Add some space above the footer
    marginBottom: 10,
    alignSelf: 'center', // Center the button
    paddingVertical: 8,
  },
  backToHomeButtonText: {
    fontSize: 14,
    color: '#007AFF', // Changed to standard blue
    textDecorationLine: 'none', // No underline by default
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          textDecorationLine: 'underline', // Underline on hover for web
          color: '#0056b3', // Darker blue on hover
        },
      }
    })
  },
  // Media queries for responsive design
  '@media (max-width: 768px)': {
    authWrapper: {
      flexDirection: 'column',
      padding: 10,
    },
    formContainer: {
      maxWidth: '100%',
    },
    heroContainer: {
      display: 'none',
    },
  },
});

export default AuthStyles;
