# Landing Page - Detailed Subtasks

## 1. Header (`src/components/LandingPage/Header.tsx`)

*   **Logo:**
    *   Placement: Far left.
    *   Source: `src/assets/images/siteSnap-logo.svg`.
    *   Dimensions: `width: 140px`, `height: 48px`.
    *   Style: `resizeMode: 'contain'`.
*   **Navigation Links (Desktop - `min-width: 768px`):**
    *   Placement: Center area, horizontal layout.
    *   Links: `Home`, `Features`, `Pricing`, `Resources`, `Support`.
    *   Styling: `fontSize: 16px`, `fontWeight: '500'`, `color: '#333'`.
    *   Active Link (`Home`): `color: '#00BA88'`.
    *   Spacing: `marginHorizontal: 16px`.
*   **Login/Sign Up Button (Desktop - `min-width: 768px`):**
    *   Placement: Far right.
    *   Styling: `backgroundColor: '#00BA88'`, `paddingVertical: 10px`, `paddingHorizontal: 20px`, `borderRadius: 4px`.
    *   Text: "Login / Sign Up", `color: '#FFFFFF'`, `fontWeight: '600'`, `fontSize: 16px`.
*   **Mobile Menu Button (Mobile - `max-width: 767px`):**
    *   Placement: Far right (replaces desktop nav/button).
    *   Icon: Hamburger icon (`☰`).
    *   Styling: `padding: 8px`.
*   **Mobile Menu (On Tap):**
    *   Layout: Full width, `backgroundColor: '#FFFFFF'`, `padding: 16px`.
    *   Links: Vertical list (`Home`, `Features`, `Pricing`, `Resources`, `Support`).
    *   Link Item Style: `paddingVertical: 12px`, `borderBottomWidth: 1`, `borderBottomColor: '#F0F0F0'`.
    *   Link Text Style: `fontSize: 16px`, `fontWeight: '500'`, `color: '#333'`.
    *   Login/Sign Up Button: At bottom, full width, centered text, `marginTop: 16px`. Style like desktop button.
*   **General Header Styling:**
    *   Layout: Full width, `position: 'absolute'`, `top: 0`, `zIndex: 10`.
    *   Appearance: `backgroundColor: '#FFFFFF'`, shadow (`shadowColor: '#000'`, `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.1`, `shadowRadius: 4`, `elevation: 3`).
    *   Container: `maxWidth: 1200px`, `marginHorizontal: 'auto'`, `paddingHorizontal: 20px`, `paddingVertical: 16px`.

## 2. Hero Section (`src/components/LandingPage/HeroSection.tsx`)

*   **Container:**
    *   Layout: Align items center, `maxWidth: 800px`, `marginHorizontal: 'auto'`.
    *   Spacing: `paddingTop: 100px + safeAreaInsets.top`, `paddingBottom: 64px`, `paddingHorizontal: 20px`.
*   **Headline:**
    *   Text: "SiteSnap: Streamline Your Project Reporting & Documentation Effortlessly".
    *   Styling: `fontSize: 48px` (desktop) / `36px` (mobile), `fontWeight: '800'`, `color: '#111827'`, `textAlign: 'center'`.
    *   Spacing: `marginBottom: 24px`.
    *   Animation: Text splitting/fade-in.
*   **Sub-headline:**
    *   Text: "SiteSnap is a comprehensive platform for managing projects, tracking tasks, generating reports, and organizing documents - designed for construction teams, field service operators, and inspection agencies".
    *   Styling: `fontSize: 18px` (desktop) / `16px` (mobile), `color: '#6B7280'`, `textAlign: 'center'`, `maxWidth: 600px`.
    *   Spacing: `marginBottom: 32px`.
    *   Animation: Fade in after headline.
*   **Visual (Product Screenshot/Montage):**
    *   Placement: Below sub-headline.
    *   Dimensions: Example: `width: '100%'`, `height: 400px`.
    *   Spacing: `marginBottom: 40px`.
    *   Animation: Parallax/scale-in effect.
*   **CTA Button ("Start Free Trial"):**
    *   Placement: Centered below visual.
    *   Styling: `backgroundColor: '#00BA88'`, `paddingVertical: 16px`, `paddingHorizontal: 32px`, `borderRadius: 8px`.
    *   Text: "Start Free Trial", `color: '#FFFFFF'`, `fontWeight: '600'`, `fontSize: 18px`.
    *   Animation: Hover effect (background transition).
*   **Scroll Animation:**
    *   Trigger animations on viewport entry.
    *   Optional: Headline sticky on initial scroll.

## 3. Problem/Solution Section (`src/components/LandingPage/ProblemSolutionSection.tsx`)

*   **Container:**
    *   Layout: `maxWidth: 1200px`, `marginHorizontal: 'auto'`.
    *   Spacing: `paddingVertical: 64px`, `paddingHorizontal: 20px`.
*   **Layout:**
    *   Desktop (`min-width: 768px`): 3 columns, `gap: 32px`.
    *   Mobile: Stack vertically, `gap: 32px`.
*   **Item Structure (for each problem/solution):**
    *   Icon: FontAwesome (`folder-open`, `file-alt`, `camera`), `size: 32px`, `color: '#00BA88'`, `marginBottom: 16px`.
    *   Title (Problem): `fontSize: 20px`, `fontWeight: '600'`, `color: '#111827'`, `marginBottom: 8px`.
    *   Problem Text: `fontSize: 16px`, `color: '#6B7280'`, `marginBottom: 12px`.
    *   Solution Text: `fontSize: 16px`, `color: '#333'`.

## 4. Key Features Overview (`src/components/LandingPage/FeaturesSection.tsx`)

*   **Container:**
    *   Layout: `maxWidth: 1200px`, `marginHorizontal: 'auto'`.
    *   Appearance: `backgroundColor: '#F9FAFB'`.
    *   Spacing: `paddingVertical: 64px`, `paddingHorizontal: 20px`.
*   **Section Title:**
    *   Text: "Key Features".
    *   Styling: `fontSize: 32px`, `fontWeight: '700'`, `color: '#111827'`, `textAlign: 'center'`.
    *   Spacing: `marginBottom: 48px`.
*   **Layout:**
    *   Desktop (`min-width: 768px`): 2x2 grid, `gap: 40px`.
    *   Mobile: Stack vertically, `gap: 40px`.
*   **Feature Item Structure:**
    *   Icon: MaterialIcons/FontAwesome, `size: 40px`, `color: '#00BA88'`, `marginBottom: 16px`.
    *   Title: `fontSize: 20px`, `fontWeight: '600'`, `color: '#111827'`, `marginBottom: 8px`.
    *   Description: `fontSize: 16px`, `color: '#6B7280'`.
*   **"Explore All Features" Button:**
    *   Placement: Centered below grid.
    *   Styling: Secondary button (`border: 2px solid #00BA88'`, `color: '#00BA88'`, `backgroundColor: 'transparent'`, `paddingVertical: 12px`, `paddingHorizontal: 24px`, `borderRadius: 8px`).
    *   Text: "Explore All Features", `fontWeight: '600'`, `fontSize: 16px`.
    *   Spacing: `marginTop: 40px`.

## 5. How It Works (`src/components/LandingPage/HowItWorksSection.tsx`)

*   **Container:**
    *   Layout: `maxWidth: 1200px`, `marginHorizontal: 'auto'`.
    *   Spacing: `paddingVertical: 64px`, `paddingHorizontal: 20px`.
*   **Section Title:**
    *   Text: "How It Works".
    *   Styling: `fontSize: 32px`, `fontWeight: '700'`, `color: '#111827'`, `textAlign: 'center'`.
    *   Spacing: `marginBottom: 48px`.
*   **Layout:**
    *   Desktop (`min-width: 1024px`): 4 steps horizontally, `gap: 32px`.
    *   Tablet (`min-width: 640px`): 2x2 grid.
    *   Mobile: Stack vertically.
    *   Visual Connectors: Add lines/arrows between steps if possible.
*   **Step Item Structure:**
    *   Step Number/Icon: Prominent number (1-4), `fontSize: 24px`, `color: '#00BA88'`. Consider circle background.
    *   Visual: Placeholder graphic (`dashboard-preview.png`), e.g., `width: 100%`, `height: 150px`, `marginBottom: 16px`.
    *   Title: `fontSize: 18px`, `fontWeight: '600'`, `color: '#111827'`, `marginBottom: 8px`.
    *   Description: `fontSize: 14px`, `color: '#6B7280'`.

## 6. Social Proof/Testimonials (`src/components/LandingPage/TestimonialsSection.tsx`)

*   **Container:**
    *   Layout: `maxWidth: 1200px`, `marginHorizontal: 'auto'`.
    *   Appearance: `backgroundColor: '#F9FAFB'`.
    *   Spacing: `paddingVertical: 64px`, `paddingHorizontal: 20px`.
*   **Section Title:**
    *   Text: "What Our Users Say".
    *   Styling: `fontSize: 32px`, `fontWeight: '700'`, `color: '#111827'`, `textAlign: 'center'`.
    *   Spacing: `marginBottom: 48px`.
*   **Layout:**
    *   Desktop (`min-width: 1024px`): 3 columns, `gap: 32px`.
    *   Smaller Screens: Consider carousel or stacking.
*   **Testimonial Item Structure:**
    *   Container Style: `backgroundColor: '#FFFFFF'`, `padding: 24px`, `borderRadius: 8px`, add shadow.
    *   Quote Text: `fontSize: 16px`, `color: '#333'`, `fontStyle: 'italic'`, `marginBottom: 16px`.
    *   Author Info (Row):
        *   Photo: Placeholder (`dashboard-preview.png`), `width: 48px`, `height: 48px`, `borderRadius: 24px`, `marginRight: 12px`.
        *   Name: `fontSize: 16px`, `fontWeight: '600'`, `color: '#111827'`.
        *   Role/Company: `fontSize: 14px`, `color: '#6B7280'`.
*   **Company Logos (Optional):**
    *   Placement: Below testimonials in a row.
    *   Styling: Grayscale, uniform height (e.g., `height: 40px`), `gap: 24px`.
    *   Spacing: `marginTop: 48px`.

## 7. Pricing Overview (`src/components/LandingPage/PricingSection.tsx`)

*   **Container:**
    *   Layout: Align items center, `maxWidth: 800px`, `marginHorizontal: 'auto'`.
    *   Spacing: `paddingVertical: 64px`, `paddingHorizontal: 20px`.
*   **Headline:**
    *   Text: "Simple, Transparent Pricing".
    *   Styling: `fontSize: 32px`, `fontWeight: '700'`, `color: '#111827'`, `textAlign: 'center'`.
    *   Spacing: `marginBottom: 16px`.
*   **Sub-headline:**
    *   Text: "Plans for teams of all sizes, starting with a free tier".
    *   Styling: `fontSize: 18px`, `color: '#6B7280'`, `textAlign: 'center'`.
    *   Spacing: `marginBottom: 32px`.
*   **"View Pricing Plans" Button:**
    *   Placement: Centered.
    *   Styling: Primary button (`backgroundColor: '#00BA88'`, `paddingVertical: 16px`, `paddingHorizontal: 32px`, `borderRadius: 8px`).
    *   Text: "View Pricing Plans", `color: '#FFFFFF'`, `fontWeight: '600'`, `fontSize: 18px`.

## 8. Final CTA Section (`src/components/LandingPage/FinalCTASection.tsx`)

*   **Container:**
    *   Layout: Align items center.
    *   Appearance: Background gradient or solid color (e.g., `#111827` or gradient with `#00BA88`).
    *   Spacing: `paddingVertical: 80px`, `paddingHorizontal: 20px`.
*   **Headline:**
    *   Text: "Ready to Transform Your Project Workflow?".
    *   Styling: `fontSize: 36px` (desktop) / `28px` (mobile), `fontWeight: '700'`, `color: '#FFFFFF'`, `textAlign: 'center'`.
    *   Spacing: `marginBottom: 32px`.
*   **CTA Button ("Start Free Trial"):**
    *   Placement: Centered.
    *   Styling: Reuse primary CTA style (`backgroundColor: '#00BA88'`, `paddingVertical: 16px`, `paddingHorizontal: 32px`, `borderRadius: 8px`).
    *   Text: "Start Free Trial", `color: '#FFFFFF'`, `fontWeight: '600'`, `fontSize: 18px`.

## 9. Footer (`src/components/LandingPage/Footer.tsx`)

*   **Container:**
    *   Layout: Full width, `maxWidth: 1200px`, `marginHorizontal: 'auto'`.
    *   Appearance: `backgroundColor: '#111827'`.
    *   Spacing: `paddingVertical: 64px`, `paddingHorizontal: 20px`.
*   **Footer Top (Logo + Nav):**
    *   Layout: Logo left, Nav right (desktop, `justifyContent: 'space-between'`). Stacked (mobile).
    *   **Logo Area:** `maxWidth: 280px` (desktop), `marginBottom: 32px` (mobile).
        *   Logo: `siteSnap-logo.svg`, `width: 140px`, `height: 48px`, `marginBottom: 12px`.
        *   Tagline: "Project Documentation Made Simple", `fontSize: 14px`, `color: '#9CA3AF'`.
    *   **Nav Columns:** 3 columns (Product, Resources, Company). Side-by-side (desktop, `marginRight: 64px`). Stacked (mobile).
        *   Column Title: `fontSize: 16px`, `fontWeight: 'bold'`, `color: '#FFFFFF'`, `marginBottom: 16px`.
        *   Nav Link: `fontSize: 14px`, `color: '#9CA3AF'`, `marginBottom: 12px`.
*   **Divider:**
    *   Styling: `height: 1px`, `backgroundColor: '#374151'`.
    *   Spacing: `marginVertical: 32px`.
*   **Footer Bottom (Copyright, Legal, Social):**
    *   Layout: Row, `justifyContent: 'space-between'`, `alignItems: 'center'` (desktop). Column, `alignItems: 'center'` (mobile).
    *   **Copyright:** "© {currentYear} SiteSnap. All rights reserved.", `fontSize: 14px`, `color: '#9CA3AF'`, `marginBottom: 16px` (mobile).
    *   **Legal Links:** "Privacy Policy", "Terms of Service". Horizontal row, `fontSize: 14px`, `color: '#9CA3AF'`, `marginHorizontal: 8px`, `marginBottom: 16px` (mobile).
    *   **Social Media Icons:** Horizontal row. Icons (e.g., FontAwesome), `size: 24px`, `marginHorizontal: 8px`. Wrap in `TouchableOpacity`. 