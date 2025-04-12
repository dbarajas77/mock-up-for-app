# Features Page - Detailed Subtasks

## 1. Header (Consistent Across All Pages)

*   **Objective:** Maintain consistent branding and primary navigation across the app.
*   **Component:** Reuse the `src/components/LandingPage/Header.tsx` component (or a shared `src/components/shared/Header.tsx` if created).
*   **Implementation:**
    *   Ensure the Header component is rendered at the top of the `FeaturesScreen`.
    *   The "Features" navigation link within the header should be styled as the active link (e.g., `color: '#00BA88'`).
    *   All navigation links (`Home`, `Features`, `Pricing`, etc.) should correctly navigate to their respective screens defined in the root navigator (`src/navigation/RootNavigator.tsx`).
    *   Login/Sign Up button functionality remains the same, navigating to the Auth screen.

## 2. Introduction Section (`screens/features/FeaturesScreen.tsx` - Top Part)

*   **Objective:** Introduce the features page with an engaging headline and overview.
*   **Layout:** Full-width section below the header, centered content.
    *   Container: `paddingVertical: 48px`, `paddingHorizontal: 20px`, `alignItems: 'center'`.
*   **Headline:**
    *   Text: "Transform Your Project Management with Powerful Tools".
    *   Styling: `fontSize: 36px` (desktop) / `28px` (mobile), `fontWeight: '700'`, `color: '#111827'`, `textAlign: 'center'`, `marginBottom: 16px`, `maxWidth: 800px`.
    *   Animation (`react-native-reanimated`):
        *   Apply a sequential fade-in/slide-up animation to each word or character group. Example: `FadeInUp.duration(600).delay(index * 100)`.
*   **Overview Text:**
    *   Text: "Streamline project management, automate reporting, and enhance team collaboration with our comprehensive suite of tools".
    *   Styling: `fontSize: 18px` (desktop) / `16px` (mobile), `color: '#6B7280'`, `textAlign: 'center'`, `maxWidth: 700px`, `lineHeight: 26px`.
    *   Animation (`Animated` or `reanimated`):
        *   Apply a simple fade-in effect after the headline animation completes. Example: `FadeIn.duration(800).delay(800)`.

## 3. Feature Categories (`screens/features/FeaturesScreen.tsx` - Main Content)

*   **Objective:** Detail each core feature area with associated components, visuals, and animations.
*   **Layout:** Organize features into distinct sections, potentially alternating background colors (`#FFFFFF`, `#F9FAFB`) for visual separation. Each section should have padding (e.g., `paddingVertical: 64px`, `paddingHorizontal: 20px`).

### 3.1 Project & Task Management

#### 3.1.1 Dashboard Overview

*   **Component:** `src/screens/projects/ProjectDashboard` (or a dedicated feature display component).
*   **Layout:** Two-column layout (desktop: image/visual on one side, text/features on the other; mobile: stack vertically). `maxWidth: 1200px`, `marginHorizontal: 'auto'`.
*   **Text Content:**
    *   Category Title: "Project & Task Management". Styling: `fontSize: 24px`, `fontWeight: '600'`, `color: '#00BA88'`, `marginBottom: 8px`.
    *   Feature Title: "Dashboard Overview". Styling: `fontSize: 28px`, `fontWeight: '700'`, `color: '#111827'`, `marginBottom: 16px`.
    *   Feature Bullets (using `react-native-progress`, `@react-native-community/datetimepicker`):
        *   "Real-time project status cards".
        *   "Visual task progress bars".
        *   "Upcoming deadlines and milestones".
        *   Styling: `fontSize: 16px`, `color: '#333'`, `marginBottom: 8px`, use checkmark icons.
*   **Visual:**
    *   Interactive dashboard screenshot/mockup.
    *   Placement: Right side (desktop), top (mobile).
    *   Sizing: `width: 50%` (desktop, adjust based on text), `width: 100%` (mobile), `borderRadius: 8px`, shadow.
*   **Animation (`react-native-reanimated`):**
    *   *Parallax Scroll:* As the user scrolls the page, the text content scrolls slightly faster than the visual, creating a depth effect. Implement using `useAnimatedScrollHandler` and interpolating `translateY`.
    *   *Element Entry:* Fade-in/slide-in animations for text and visual as the section scrolls into view.

#### 3.1.2 Task Tracking

*   **Component:** `src/screens/tasks/TaskManager` (or display component).
*   **Layout:** Similar to Dashboard Overview (two-column/stacked), potentially alternating visual/text sides.
*   **Text Content:**
    *   Feature Title: "Advanced Task Tracking". Styling: `fontSize: 28px`, `fontWeight: '700'`, `color: '#111827'`, `marginBottom: 16px`.
    *   Feature Bullets (using `react-native-gesture-handler`, Redux, Supabase Realtime):
        *   "Intuitive drag-and-drop interface (Kanban/List)".
        *   "Instant status updates and assignments".
        *   "Integrated comment system for task discussions".
        *   Styling: `fontSize: 16px`, `color: '#333'`, `marginBottom: 8px`, use checkmark icons.
*   **Visual:**
    *   Animated GIF or short video demonstrating the task management workflow (drag-drop, status change).
    *   Placement: Left side (desktop), top (mobile).
    *   Sizing: Similar to dashboard visual.
*   **Animation (`react-native-reanimated`):**
    *   *List Item Transitions:* If showing a list, animate items entering/leaving/reordering using `LayoutAnimation` or `reanimated`'s layout animations.
    *   *Element Entry:* Fade-in/slide-in animations.

### 3.2 Document & Photo Management

#### 3.2.1 Photo Upload & Organization

*   **Component:** `src/screens/media/PhotoGrid` (or display component).
*   **Layout:** Two-column/stacked.
*   **Text Content:**
    *   Category Title: "Document & Photo Management". Styling: `fontSize: 24px`, `fontWeight: '600'`, `color: '#00BA88'`, `marginBottom: 8px`.
    *   Feature Title: "Effortless Photo Upload & Organization". Styling: `fontSize: 28px`, `fontWeight: '700'`, `color: '#111827'`, `marginBottom: 16px`.
    *   Feature Bullets (using Expo ImagePicker, `FlatList`, `react-native-select-dropdown`):
        *   "Upload photos directly from mobile or web".
        *   "Responsive grid view for easy browsing".
        *   "Powerful search and filtering options".
        *   Styling: `fontSize: 16px`, `color: '#333'`, `marginBottom: 8px`, use checkmark icons.
*   **Visual:**
    *   Screenshot of the photo grid interface, potentially showing the filter dropdown.
    *   Placement: Right side (desktop), top (mobile).
    *   Sizing: Similar to previous visuals.
*   **Animation (`react-native-reanimated`):**
    *   *Grid Item Loading:* As grid items load (especially if paginated), apply a subtle scale/fade-in animation. Example: `FadeIn.duration(300)`.
    *   *Element Entry:* Fade-in/slide-in animations.

#### 3.2.2 Document Management

*   **Component:** `src/screens/documents/DocumentList` (or display component).
*   **Layout:** Two-column/stacked, alternating sides.
*   **Text Content:**
    *   Feature Title: "Secure Document Management". Styling: `fontSize: 28px`, `fontWeight: '700'`, `color: '#111827'`, `marginBottom: 16px`.
    *   Feature Bullets (using Expo DocumentPicker, `react-native-pdf`, Supabase):
        *   "Upload various document types (PDF, DOCX, etc.)".
        *   "In-app document preview".
        *   "Track document versions and history".
        *   Styling: `fontSize: 16px`, `color: '#333'`, `marginBottom: 8px`, use checkmark icons.
*   **Visual:**
    *   Screenshot of the document list/preview interface.
    *   Placement: Left side (desktop), top (mobile).
    *   Sizing: Similar to previous visuals.
*   **Animation (CSS Hover / `Animated.View`):**
    *   *Document Card Hover Effects (Web):* On hover over a document card/list item, apply a subtle lift (translateY) or background color change.
    *   *Element Entry:* Fade-in/slide-in animations.

### 3.3 Reporting & Analytics

#### 3.3.1 Report Generation

*   **Component:** `src/screens/reports/ReportBuilder` (or display component).
*   **Layout:** Two-column/stacked.
*   **Text Content:**
    *   Category Title: "Reporting & Analytics". Styling: `fontSize: 24px`, `fontWeight: '600'`, `color: '#00BA88'`, `marginBottom: 8px`.
    *   Feature Title: "Automated Report Generation". Styling: `fontSize: 28px`, `fontWeight: '700'`, `color: '#111827'`, `marginBottom: 16px`.
    *   Feature Bullets (using `@react-pdf/renderer`, `react-native-chart-kit`):
        *   "Create professional PDF reports from templates".
        *   "Include charts and data visualizations".
        *   "Easy export and sharing options".
        *   Styling: `fontSize: 16px`, `color: '#333'`, `marginBottom: 8px`, use checkmark icons.
*   **Visual:**
    *   Screenshot or GIF showing the report builder interface or a sample generated report.
    *   Placement: Right side (desktop), top (mobile).
    *   Sizing: Similar to previous visuals.
*   **Animation (`react-native-reanimated`):**
    *   *Step-by-Step Form Transitions:* If showing a form, animate transitions between steps (slide-in/out).
    *   *Element Entry:* Fade-in/slide-in animations.

#### 3.3.2 Data Analysis

*   **Component:** `src/screens/analytics/AnalyticsDashboard` (or display component).
*   **Layout:** Two-column/stacked, alternating sides.
*   **Text Content:**
    *   Feature Title: "Insightful Data Analysis". Styling: `fontSize: 28px`, `fontWeight: '700'`, `color: '#111827'`, `marginBottom: 16px`.
    *   Feature Bullets:
        *   "Interactive charts for project trends".
        *   "Customizable date range and data filters".
        *   "Export raw data for further analysis".
        *   Styling: `fontSize: 16px`, `color: '#333'`, `marginBottom: 8px`, use checkmark icons.
*   **Visual:**
    *   Screenshot of the analytics dashboard featuring various charts.
    *   Placement: Left side (desktop), top (mobile).
    *   Sizing: Similar to previous visuals.
*   **Animation (`react-native-chart-kit` / `reanimated`):**
    *   *Chart Loading:* Animate charts drawing or fading in as data loads.
    *   *Element Entry:* Fade-in/slide-in animations.

### 3.4 Team Collaboration

#### 3.4.1 User Management

*   **Component:** `src/screens/team/TeamManagement` (or display component).
*   **Layout:** Two-column/stacked.
*   **Text Content:**
    *   Category Title: "Team Collaboration". Styling: `fontSize: 24px`, `fontWeight: '600'`, `color: '#00BA88'`, `marginBottom: 8px`.
    *   Feature Title: "Seamless User Management". Styling: `fontSize: 28px`, `fontWeight: '700'`, `color: '#111827'`, `marginBottom: 16px`.
    *   Feature Bullets (using Supabase Auth):
        *   "Assign roles and permissions easily".
        *   "Organize users into project teams".
        *   "Control access to sensitive project data".
        *   Styling: `fontSize: 16px`, `color: '#333'`, `marginBottom: 8px`, use checkmark icons.
*   **Visual:**
    *   Screenshot of the team management interface (list of users, roles, permissions).
    *   Placement: Right side (desktop), top (mobile).
    *   Sizing: Similar to previous visuals.
*   **Animation (`react-native-modal` / `reanimated`):**
    *   *Modal Transitions:* Animate modals (e.g., for adding users or editing roles) sliding up/fading in.
    *   *Element Entry:* Fade-in/slide-in animations.

#### 3.4.2 Communication Tools

*   **Component:** `src/screens/communication/ChatSystem` (or display component).
*   **Layout:** Two-column/stacked, alternating sides.
*   **Text Content:**
    *   Feature Title: "Integrated Communication Tools". Styling: `fontSize: 28px`, `fontWeight: '700'`, `color: '#111827'`, `marginBottom: 16px`.
    *   Feature Bullets (using Supabase Realtime):
        *   "Real-time chat for project discussions".
        *   "In-app notification system for updates".
        *   "Share files directly within conversations".
        *   Styling: `fontSize: 16px`, `color: '#333'`, `marginBottom: 8px`, use checkmark icons.
*   **Visual:**
    *   Screenshot of the chat or notification interface.
    *   Placement: Left side (desktop), top (mobile).
    *   Sizing: Similar to previous visuals.
*   **Animation (`react-native-reanimated`):**
    *   *Message Transitions:* Animate new messages sliding/fading into the chat view.
    *   *Element Entry:* Fade-in/slide-in animations.

## 4. Integration Section (`screens/features/FeaturesScreen.tsx` - Near Bottom)

*   **Component:** `src/screens/integrations/IntegrationHub` (or display component).
*   **Layout:** Centered section, potentially full width with internal max-width for content.
    *   Container: `paddingVertical: 64px`, `paddingHorizontal: 20px`, `alignItems: 'center'`, `backgroundColor: '#F9FAFB'`.
*   **Title:**
    *   Text: "Connect Your Favorite Tools". Styling: `fontSize: 32px`, `fontWeight: '700'`, `color: '#111827'`, `textAlign: 'center'`, `marginBottom: 32px`.
*   **Integration Grid:**
    *   Layout: Display icons in a responsive grid (e.g., 5-6 columns on desktop, fewer on mobile). Use `flexWrap: 'wrap'`, `justifyContent: 'center'`.
    *   Icons: Google Drive, Dropbox, Slack, Google Calendar logos.
    *   Styling: Icon `width/height: 64px`, `margin: 16px`. Grayscale effect (`opacity: 0.7`).
*   **Animation (CSS Hover / `Animated.View`):**
    *   *Icon Hover Effects (Web):* On hover, remove grayscale (`opacity: 1`) and apply a slight scale-up effect (`transform: [{ scale: 1.1 }]`).

## 5. Call-to-Action Section (`screens/features/FeaturesScreen.tsx` - Bottom)

*   **Objective:** Drive conversion after showcasing features.
*   **Component:** Reuse or adapt `src/components/shared/CTASection` or `src/components/LandingPage/FinalCTASection.tsx`.
*   **Layout:** Full-width section, centered content.
    *   Container: `paddingVertical: 80px`, `paddingHorizontal: 20px`, `alignItems: 'center'`. Use background gradient or color consistent with landing page final CTA.
*   **Headline:**
    *   Text: "Ready to Streamline Your Projects?".
    *   Styling: Match final CTA headline style (`fontSize: 36px`/`28px`, `fontWeight: '700'`, `color: '#FFFFFF'`). `marginBottom: 32px`.
*   **Buttons:**
    *   Layout: Row, `gap: 16px`.
    *   Button 1 ("Start Free Trial"): Style as primary CTA (e.g., white background, green text if on dark bg). Navigate to Auth (`SignUp`).
    *   Button 2 ("View Pricing"): Style as secondary CTA (e.g., transparent background, white border/text if on dark bg). Navigate to `PricingScreen`.
*   **Animation:**
    *   *Button Hover Effects (Web):* Subtle background/border color transitions on hover.

## 6. Footer (Consistent Across All Pages)

*   **Objective:** Provide consistent footer navigation and information.
*   **Component:** Reuse `src/components/LandingPage/Footer.tsx` (or a shared `src/components/shared/Footer.tsx`).
*   **Implementation:** Ensure the Footer component is rendered at the bottom of the `FeaturesScreen`. Content and links remain the same.

## 7. Technical Specifications & Performance Considerations

*   *(Keep these sections as high-level guidelines, no detailed subtasks needed unless specifically requested)*
*   **Technical Specifications:**
    *   Animations: Emphasize use of `react-native-reanimated` for performance.
    *   State Management: Redux Toolkit.
    *   Navigation: React Navigation v7.
    *   Styling: StyleSheet primarily, styled-components if needed.
    *   Data: Supabase.
    *   UI Components: Expo compatible.
*   **Performance Considerations:**
    *   Lazy loading sections/components.
    *   Image optimization (consider `expo-image`).
    *   `FlatList` optimization (`getItemLayout`, `keyExtractor`).
    *   Caching with React Query or similar if fetching data.
    *   Loading indicators for data/visuals. 