# Animated Stats Counter Component

## Overview
A React component that displays animated number counters for key platform statistics using `react-countup`, `react-intersection-observer`, and `framer-motion`. The component features smooth animations that trigger only when the section scrolls into view.

## Features

### ✨ Animation Features
- **Intersection Observer**: Animations trigger only when the section is visible
- **One-time Animation**: Each counter animates only once (triggerOnce: true)
- **Staggered Animation**: Each stat counter has a slight delay for visual appeal
- **Smooth Counting**: Numbers count up from 0 to target value with customizable duration

### 🎨 Design Features
- **Responsive Grid**: 2-column layout on mobile, 4-column on desktop
- **Brand Colors**: Uses #6C63FF primary brand color for numbers
- **Gradient Background**: Subtle purple gradient background with pattern overlay
- **Smooth Transitions**: Fade-in and upward motion animations
- **Large Numbers**: Eye-catching typography that scales with screen size

### 📊 Stats Displayed
1. **Active Students**: 25,000+ (2.5s animation)
2. **Items Sold**: 150,000+ (2.8s animation) 
3. **Universities**: 35+ (2.0s animation)
4. **Money Saved**: R2.0M+ (3.0s animation with currency prefix)

## Technical Implementation

### Dependencies
```bash
npm install react-countup react-intersection-observer
```

### Core Technologies
- **react-countup**: Handles number counting animations
- **react-intersection-observer**: Detects when component enters viewport
- **framer-motion**: Provides smooth enter animations and stagger effects
- **Tailwind CSS**: Responsive styling and layout

### Performance Optimizations
- **triggerOnce**: Prevents re-triggering on scroll
- **hasAnimated state**: Tracks completion to prevent re-animations
- **Responsive breakpoints**: Optimized for all screen sizes
- **Lazy intersection**: Only animates when 30% visible

## Component Structure

### StatCounter (Individual Counter)
```tsx
interface StatItem {
  id: string
  number: number
  label: string
  prefix?: string    // For currency symbols (R)
  suffix?: string    // For + symbols
  duration?: number  // Animation duration
}
```

### Main StatsCounter Component
- Container with gradient background
- Responsive grid layout
- Intersection observer setup
- Staggered animation timing

## Usage

### In Home Page
```tsx
import StatsCounter from "@/components/stats-counter"

export default function HomePage() {
  return (
    <div>
      {/* Other sections */}
      <StatsCounter />
      {/* Other sections */}
    </div>
  )
}
```

### Customization Options

#### Update Stats Data
```tsx
const statsData: StatItem[] = [
  {
    id: 'students',
    number: 25000,
    label: 'Active Students',
    suffix: '+',
    duration: 2.5
  },
  // Add more stats...
]
```

#### Modify Appearance
- **Colors**: Update `text-[#6C63FF]` to your brand color
- **Background**: Modify gradient classes in the background section
- **Typography**: Adjust text size classes (text-4xl, text-5xl, etc.)
- **Spacing**: Change padding/margin classes (py-20, gap-8, etc.)

## Accessibility Features
- **Semantic HTML**: Uses proper heading hierarchy and section roles
- **ARIA Labels**: Descriptive labels for screen readers
- **High Contrast**: Ensures good readability with color choices
- **Responsive Text**: Scales appropriately across devices

## Browser Support
- Modern browsers with CSS Grid support
- React 18+ compatible
- Framer Motion v10+ compatible
- Intersection Observer API support

## File Structure
```
components/
├── stats-counter.tsx       # Main component
styles/
├── stats-counter.css      # Additional responsive styles
app/
├── page.tsx              # Implementation in home page
```

## Animation Sequence
1. **Page Load**: Component renders with opacity 0
2. **Scroll Into View**: Intersection observer triggers
3. **Staggered Entry**: Each stat card fades in with 0.2s delay
4. **Number Counting**: CountUp animates from 0 to target
5. **One-time Only**: hasAnimated state prevents re-triggering

## Large Number Formatting
The component intelligently formats large numbers:
- **2,000,000** → **2.0M** (for Money Saved)
- **150,000** → **150,000** (comma formatting)
- **25,000** → **25,000** (comma formatting)

## Performance Considerations
- Uses `useCallback` for event handlers
- Minimal re-renders with proper state management
- Intersection observer automatically cleans up
- Window resize listener properly removed on unmount

## Future Enhancements
- [ ] Add number formatting options (K, M, B)
- [ ] Support for decimal precision control
- [ ] Custom easing functions
- [ ] Sound effects on counter completion
- [ ] Real-time data integration via API
- [ ] A/B testing for different animation styles

## Troubleshooting

### Common Issues
1. **Animation not triggering**: Check intersection observer threshold
2. **Numbers not formatting**: Verify formatNumber function logic
3. **Responsive issues**: Test CSS Grid browser support
4. **Performance lag**: Reduce animation duration or disable on mobile

### Debug Tips
```tsx
// Add to component for debugging
console.log('In view:', inView)
console.log('Should animate:', shouldAnimate)
console.log('Screen size:', isLargeScreen)
```