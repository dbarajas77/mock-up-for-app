# Pricing Page Content

## Header Component
- **Component:** `src/components/shared/Header`
- **Implementation:**
  ```tsx
  - Navigation using `@react-navigation/stack`
  - Supabase auth integration for Login/Signup
  - Routes:
    - Home → `screens/landing/LandingScreen`
    - Features → `screens/features/FeaturesScreen`
    - Pricing (active) → `screens/pricing/PricingScreen`
    - Resources → `screens/resources/ResourcesScreen`
    - Support → `screens/support/SupportScreen`
   
  ```

## Headline Section
- **Component:** `src/components/pricing/PricingHero`
- **Implementation:**
  ```tsx
  - Headline: "Simple Pricing for Teams of All Sizes"
  - Subtext: "No hidden fees. Cancel anytime."
  - BillingToggle component using react-native-reanimated:
    - Monthly/Annual switch
    - Savings calculator
    - Animated price updates
  ```

## Pricing Tiers
- **Component:** `src/components/pricing/PricingTiers`
- **Implementation:**
  ```tsx
  - FlatList/ScrollView for tier cards
  - Animated hover effects (web-only)
  - Redux integration for plan selection
  ```

### Tier Structure
```typescript
interface PricingTier {
  id: string;
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  limits: {
    projects: number;
    storage: string;
    users: number;
  };
  recommended: boolean;
}
```

### Defined Tiers
1. **Basic Plan**
   - Free tier
   - Core features:
     - Basic project management
     - Simple reporting
     - 1GB storage
     - 3 projects
     - 2 users

2. **Pro Plan**
   - $29/month
   - Additional features:
     - Advanced reporting
     - Photo annotations
     - 10GB storage
     - Unlimited projects
     - 10 users
     - Priority support

3. **Enterprise Plan**
   - Custom pricing
   - All features:
     - Custom integrations
     - Dedicated support
     - SSO
     - Unlimited everything
     - Custom permissions

## Feature Comparison
- **Component:** `src/components/pricing/FeatureComparison`
- **Implementation:**
  ```tsx
  - Responsive table using react-native-web
  - Sticky headers on scroll
  - Feature grouping by category
  - Checkmark icons from @expo/vector-icons
  ```

## FAQ Section
- **Component:** `src/components/pricing/FAQAccordion`
- **Implementation:**
  ```tsx
  - Animated accordion using react-native-reanimated
  - Questions stored in Supabase
  - Search functionality
  ```

### Common Questions
1. Trial period details
2. Plan switching process
3. User definition and limits
4. Payment security
5. Non-profit discounts

## Trust Indicators
- **Component:** `src/components/shared/TrustBadges`
- **Implementation:**
  ```tsx
  - Security badges
  - Payment processor logos
  - Compliance info (GDPR, SOC2)
  ```

## Call-to-Action
- **Component:** `src/components/shared/CTASection`
- **Implementation:**
  ```tsx
  - Custom Button component
  - Supabase auth integration
  - Trial signup flow
  ```

## Footer
- **Component:** `src/components/shared/Footer`
- **Implementation:**
  ```tsx
  - Navigation links
  - Social media icons (@expo/vector-icons)
  - Legal links
  - Newsletter signup
  ```

## Technical Implementation

### State Management
```typescript
// Redux slice for pricing
interface PricingState {
  selectedPlan: string;
  billingCycle: 'monthly' | 'annual';
  currency: string;
  promoCode?: string;
}
```

### Animations
```typescript
// Using react-native-reanimated
- Price change animations
- Hover effects (web)
- Accordion transitions
- Button interactions
```

### Responsive Design
```typescript
// Platform-specific styles
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: {
        maxWidth: 1200,
        margin: '0 auto',
      },
      default: {
        flex: 1,
        marginHorizontal: 20,
      },
    }),
  },
});
```

### Data Management
```typescript
// Supabase tables
pricing_plans
pricing_features
pricing_faqs
pricing_promotions
```

### Integration Points
- Supabase Auth for signup flow
- Stripe integration for payments
- Redux for state management
- Analytics for conversion tracking

### Performance Optimizations
- Lazy loading of comparison table
- Image optimization
- Cached pricing calculations
- Preloaded FAQ data

### Web-Specific Features
- SEO metadata
- Rich snippets for pricing
- Social sharing metadata
- Schema markup for pricing 