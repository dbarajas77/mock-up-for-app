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

## Color Palette

- **Primary**: Deep Blue (#003366)
- **Accent**: Vibrant Green (#00CC66)
- **Neutral**: Light Gray (#F5F5F5), Dark Gray (#333333)
- **Error**: Red (#FF3333)
- **Warning**: Yellow (#FFD700)
- **Dark Mode**: Dark Gray Background (#1A1A1A), Light Gray Text (#E0E0E0)
