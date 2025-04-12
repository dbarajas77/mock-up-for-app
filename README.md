# Mobile Project Management App

A mobile-optimized project management tool with photo documentation capabilities, designed primarily for industries such as construction.

## Features

- **Projects**: Create and manage projects with detailed tracking
- **Photos**: Document progress using photos with editing and gallery features
- **Users**: Manage team members and invitations
- **Reports**: Generate project reports
- **Checklists**: Track tasks with templates
- **Showcases**: Highlight completed projects
- **Integrations**: Connect with external tools
- **Templates**: Create reusable content
- **Map**: Visualize project locations
- **Groups**: Organize users into teams

## Tech Stack

- **React Native**: Core framework for building native mobile apps
- **React Native Web**: For running React Native components on the web
- **React Navigation**: Navigation library for React Native
- **Redux**: State management
- **Styled Components**: Styling library
- **Expo**: Development toolchain

## Project Structure

```
project-manager/
├── src/
│   ├── assets/         # Images, icons, and other static assets
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   ├── redux/          # Redux store and slices
│   ├── screens/        # Screen components
│   ├── theme/          # Theme configuration
│   └── utils/          # Utility functions
├── App.tsx             # Main application component
└── index.ts            # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Run on specific platforms:
   ```
   npm run android
   npm run ios
   npm run web
   ```

## Dependencies

### Core Dependencies

- **expo**: ~50.0.21 - Development environment and toolchain for React Native
- **react**: ^18.2.0 - Core React library
- **react-native**: 0.76.7 - Framework for building native apps with React
- **react-native-web**: ^0.19.10 - React Native for web

### Navigation

- **@react-navigation/native**: ^7.1.6 - Navigation library for React Native
- **@react-navigation/native-stack**: ^7.3.10 - Stack navigator
- **@react-navigation/stack**: ^7.2.2 - Stack navigator with more customization
- **@react-navigation/bottom-tabs**: ^7.2.1 - Tab navigator
- **@react-navigation/drawer**: ^7.1.2 - Drawer navigator
- **@react-navigation/material-top-tabs**: ^7.2.3 - Material design top tabs

### State Management

- **@reduxjs/toolkit**: ^2.6.1 - Toolset for efficient Redux development
- **react-redux**: ^9.2.0 - React bindings for Redux

### UI Components

- **@expo/vector-icons**: ^14.1.0 - Icon library
- **styled-components**: ^6.1.15 - CSS-in-JS styling
- **react-native-chart-kit**: ^6.12.0 - Charts and graphs
- **react-native-maps**: ^1.18.0 - Map component
- **framer-motion**: ^12.6.5 - Animations
- **react-native-reanimated**: ~3.16.1 - Advanced animations

### API & Data Management

- **axios**: ^1.8.3 - HTTP client
- **@supabase/supabase-js**: ^2.49.1 - Supabase client
- **@supabase/auth-helpers-react**: ^0.5.0 - Authentication helpers
- **@supabase/auth-ui-react**: ^0.4.7 - Auth UI components

### Media & File Handling

- **expo-av**: ^15.0.2 - Audio/video playback
- **expo-document-picker**: ^13.0.3 - Document picking
- **expo-file-system**: ^18.0.12 - File system access
- **react-native-fast-image**: ^8.6.3 - Performant image component
- **@react-pdf/renderer**: ^4.3.0 - PDF generation
- **file-saver**: ^2.0.5 - File downloading

### Form Handling

- **react-hook-form**: ^7.54.2 - Form state management
- **yup**: ^1.6.1 - Schema validation

### Server & CLI Tools

- **express**: ^4.21.2 - Web server framework
- **cors**: ^2.8.5 - Cross-origin resource sharing
- **commander**: ^11.1.0 - Command-line interface
- **dotenv**: ^16.4.7 - Environment variable loading
- **morgan**: ^1.10.0 - HTTP request logger

### Development Dependencies

- **typescript**: ^5.3.3 - Type checking
- **@babel/core**: ^7.25.2 - JavaScript compiler
- **@tailwindcss/forms**: ^0.5.10 - Form styling utilities
- **babel-plugin-module-resolver**: ^5.0.2 - Import path aliasing

## Dependency Management

When installing new dependencies, use the following guidelines:

1. For regular dependencies:
   ```
   npm install package-name
   ```

2. For development dependencies:
   ```
   npm install package-name --save-dev
   ```

3. If you encounter version conflicts, update the package.json file manually and reinstall, rather than using `--legacy-peer-deps`.

### Known Dependencies Issues

- There is a known conflict between Expo v52 and webpack-config v19. We currently use Expo v50.0.21 to maintain compatibility.
- If you encounter a crypto-related error when running the web version, you may need to install the crypto-browserify polyfill.

## Color Palette

- **Primary**: Deep Blue (#003366)
- **Accent**: Vibrant Green (#00CC66)
- **Neutral**: Light Gray (#F5F5F5), Dark Gray (#333333)
- **Error**: Red (#FF3333)
- **Warning**: Yellow (#FFD700)
- **Dark Mode**: Dark Gray Background (#1A1A1A), Light Gray Text (#E0E0E0)
