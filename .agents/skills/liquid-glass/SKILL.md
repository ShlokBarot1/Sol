---
name: liquid-glass
description: >
  Applies "Liquid Glass" (iOS 26 Style) design principles to UI components.
  Includes lensing, materialization, fluidity, and morphing logic for React/Tailwind.
  Use when user says "liquid glass", "make it glassy", "apply glass aesthetics", 
  or asks for iOS 26 style.
---

# Liquid Glass Reference Skill
🪨 *Lensing, Fluidity, and Morphing for Modern UI*

This skill provides a high-density reference for implementing the "Liquid Glass" aesthetic (iOS 26 Style) in React/Next.js/Tailwind environments.

## Core Design Principles
1. **Lensing (Not just Blur)**: Bends and concentrates light in real-time. Use `backdrop-filter: blur(...)` combined with subtle `scale` and `refraction` simulations (e.g., shaders).
2. **Materialization**: Elements should appear by gradually modulating light bending (animating the backdrop-filter and scale).
3. **Fluidity**: Gel-like flexibility. Use bouncy easing (`cubic-bezier(0.68, -0.6, 0.32, 1.6)`) for all interactions.
4. **Morphing**: Seamlessly transition shapes between states (e.g., a button becoming a navbar).

## Material Variants
- **.regular**: Standard for toolbars, buttons, and navigation. Highly adaptive frosting.
- **.clear**: High transparency. Only for media-rich overlays with bold foreground content.
- **.identity**: Clear state for transitions.

## Implementation Guidelines (React/Tailwind)
- **Layering**: ONLY use Liquid Glass for the navigation/overlay layer floating above app content. NEVER apply to content itself (lists, media).
- **Vibrancy**: Text on glass should use `mix-blend-mode: plus-lighter` or high-contrast foreground colors with adaptive saturation.
- **Shadows**: Use adaptive shadows that increase opacity over text and decrease over white backgrounds.
- **Performance**: Limit continuous rotations/animations on glass layers to save GPU/Battery.

## Interaction Patterns
- **Interactive Modifier**: Scale up on hover (1.05x), scale down on press (0.95x).
- **Touch Illumination**: Use radial gradients that follow the cursor/touch point to simulate internal light radiation.

---
*Source: conorluddy/LiquidGlassReference*
