---
name: Cometa Delivery
colors:
  surface: "#faf9fe"
  surface-dim: "#dad9df"
  surface-bright: "#faf9fe"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f4f3f8"
  surface-container: "#eeedf3"
  surface-container-high: "#e9e7ed"
  surface-container-highest: "#e3e2e7"
  on-surface: "#1a1b1f"
  on-surface-variant: "#554334"
  inverse-surface: "#2f3034"
  inverse-on-surface: "#f1f0f5"
  outline: "#887361"
  outline-variant: "#dbc2ad"
  surface-tint: "#8c5000"
  primary: "#8c5000"
  on-primary: "#ffffff"
  primary-container: "#ff9500"
  on-primary-container: "#643700"
  inverse-primary: "#ffb874"
  secondary: "#0058bc"
  on-secondary: "#ffffff"
  secondary-container: "#0070eb"
  on-secondary-container: "#fefcff"
  tertiary: "#00658c"
  on-tertiary: "#ffffff"
  tertiary-container: "#00bbfe"
  on-tertiary-container: "#004764"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ffdcbf"
  primary-fixed-dim: "#ffb874"
  on-primary-fixed: "#2d1600"
  on-primary-fixed-variant: "#6a3b00"
  secondary-fixed: "#d8e2ff"
  secondary-fixed-dim: "#adc6ff"
  on-secondary-fixed: "#001a41"
  on-secondary-fixed-variant: "#004493"
  tertiary-fixed: "#c5e7ff"
  tertiary-fixed-dim: "#7fd0ff"
  on-tertiary-fixed: "#001e2d"
  on-tertiary-fixed-variant: "#004c6a"
  background: "#faf9fe"
  on-background: "#1a1b1f"
  surface-variant: "#e3e2e7"
typography:
  display:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: "700"
    lineHeight: 41px
    letterSpacing: 0.37px
  headline:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: "700"
    lineHeight: 34px
    letterSpacing: 0.36px
  title-1:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: "600"
    lineHeight: 28px
    letterSpacing: 0.35px
  title-2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 25px
    letterSpacing: 0.38px
  body:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: "400"
    lineHeight: 22px
    letterSpacing: -0.41px
  body-emphasized:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: "600"
    lineHeight: 22px
    letterSpacing: -0.41px
  callout:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 21px
    letterSpacing: -0.32px
  subheadline:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: "400"
    lineHeight: 20px
    letterSpacing: -0.24px
  footnote:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 18px
    letterSpacing: -0.08px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px
    letterSpacing: 0px
  headline-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  margin-mobile: 16px
  margin-desktop: 32px
  gutter: 16px
---

## Brand & Style

The design system is rooted in the principles of the Apple Human Interface Guidelines (HIG), prioritizing clarity, deference, and depth. It targets a premium audience that values efficiency and high-end aesthetics in the logistics and food-delivery space.

The visual style is **Corporate / Modern Minimalist**, characterized by extreme whitespace, a restrained color palette, and high-precision typography. The intent is to make the interface feel invisible, allowing the high-quality photography of food and products to take center stage. The emotional response should be one of reliability, speed, and effortless sophistication, drawing inspiration from industry leaders like Stripe and Airbnb.

## Colors

This design system utilizes a high-contrast palette optimized for legibility and system-level familiarity.

- **Primary:** A vibrant Apple-standard Orange (#FF9500) used strictly for primary actions, progress indicators, and brand-critical moments.
- **Neutrals:** A multi-layered grayscale palette following the Apple "System Gray" scale. In light mode, surfaces use pure white (#FFFFFF) with background fills of #F2F2F7.
- **Dark Mode:** The system uses a true black (#000000) foundation for OLED efficiency. Secondary surfaces elevate to "System Materials" using varying shades of dark gray (#1C1C1E, #2C2C2E).
- **Functional:** System Blue (#007AFF) is reserved for secondary links and informational icons, while System Red and Green handle error and success states respectively.

## Typography

The typography system uses **Inter** to emulate the functional, neutral, and highly legible characteristics of Apple's San Francisco typeface.

- **Scale:** Strictly adheres to the HIG Dynamic Type sizes.
- **Hierarchy:** Contrast is created through weight (Regular vs. Semibold) rather than excessive size variations.
- **Accessibility:** Line heights are tight but legible, following a standard 1.2x to 1.3x ratio. On mobile, `display` sizes should be avoided in favor of `headline` to preserve vertical density.
- **Letter Spacing:** Tracking is slightly tightened for larger headers and slightly loosened for smaller captions to maintain optical balance.

## Layout & Spacing

This design system is built on a strict **8pt grid** system to ensure mathematical alignment and consistency across all screen densities in React Native.

- **Grid Model:** Uses a fluid layout for mobile devices with a standard 16px (2 units) side margin. On tablet and desktop, content is contained within a fixed-width max-container of 1200px.
- **Rhythm:** Vertical spacing between atomic elements (label to input) uses 8px (sm). Spacing between sections or card modules uses 24px (lg) or 32px (xl).
- **Safe Areas:** Adheres strictly to device safe area insets for notched displays.

## Elevation & Depth

The system avoids heavy, "muddy" shadows. Depth is communicated through **Tonal Layers** and subtle ambient occlusion.

- **Z-Axis Hierarchy:**
  - **Level 0 (Base):** System Background (#FFFFFF / #000000).
  - **Level 1 (Cards):** Secondary Surface or White with a 1px subtle neutral-200 border.
  - **Level 2 (Modals/Sheets):** Subtle 0px 4px 20px shadow with 8% opacity black (or 20% in dark mode).
- **Glassmorphism:** Navigation bars and tab bars must use a backdrop blur (BlurView in Expo) with a semi-transparent surface fill to provide context of the content scrolling beneath.

## Shapes

The shape language is defined by the "Continuous Curve" or squircle aesthetic.

- **Standard Radius:** 8pt to 12pt for small components like inputs and buttons.
- **Large Radius:** 16pt to 20pt for primary content containers and cards to create a friendly, premium feel.
- **Interactive States:** Buttons maintain a consistent radius regardless of scale to ensure brand coherence.

## Components

- **Buttons:** Primary buttons are #FF9500 with white text, featuring a 12pt radius and haptic feedback on press. Secondary buttons use a subtle gray fill or a "ghost" style with an 8pt radius.
- **Cards:** Content is housed in cards with 16pt corner radii, no border, and either a Level 1 elevation shadow or a subtle 1px border (#E5E5EA).
- **Inputs:** Form fields use a 12pt radius with a light-gray background (#F2F2F7). On focus, the border transitions to the primary orange.
- **Chips/Badges:** Used for categories (e.g., "Fast Delivery"). These use a 32pt (pill) radius and low-saturation background tints of the primary or secondary colors.
- **Lists:** Follow the iOS "Inset Grouped" style, with rounded corners on the container and thin separators between items that don't reach the edge.
- **Motion:** Use the standard Apple "Spring" animation (damping: 0.8, response: 0.4) for all modal transitions and button interactions to ensure a fluid, high-end feel.
