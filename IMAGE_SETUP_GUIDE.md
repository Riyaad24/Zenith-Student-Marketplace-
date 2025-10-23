# ZENITH MARKETPLACE - Image File Structure Guide
# This document shows the image files needed to match the database references

## Required Directory Structure

```
Zenith-OG/public/images/
├── categories/
│   ├── textbooks.jpg
│   ├── electronics.jpg
│   ├── notes.jpg
│   ├── tutoring.jpg
│   ├── stationery.jpg
│   └── furniture.jpg
├── avatars/
│   ├── john_smith.jpg
│   ├── sarah_jones.jpg
│   ├── mike_brown.jpg
│   ├── emma_wilson.jpg
│   ├── david_lee.jpg
│   ├── lisa_clark.jpg
│   ├── james_taylor.jpg
│   └── anna_martin.jpg
└── products/
    ├── financial_accounting_main.jpg
    ├── financial_accounting_back.jpg
    ├── financial_accounting_inside.jpg
    ├── psychology_textbook_main.jpg
    ├── psychology_textbook_spine.jpg
    ├── psychology_textbook_contents.jpg
    ├── engineering_math_main.jpg
    ├── engineering_math_back.jpg
    ├── grays_anatomy_main.jpg
    ├── grays_anatomy_inside1.jpg
    ├── grays_anatomy_inside2.jpg
    ├── grays_anatomy_spine.jpg
    ├── casio_calculator_main.jpg
    ├── casio_calculator_box.jpg
    ├── casio_calculator_manual.jpg
    ├── dell_laptop_main.jpg
    ├── dell_laptop_keyboard.jpg
    ├── dell_laptop_ports.jpg
    ├── dell_laptop_specs.jpg
    ├── ipad_air_main.jpg
    ├── ipad_air_pencil.jpg
    ├── ipad_air_keyboard.jpg
    ├── ipad_air_accessories.jpg
    ├── accounting_notes_main.jpg
    ├── accounting_notes_sample1.jpg
    ├── accounting_notes_sample2.jpg
    ├── psych_study_guide_main.jpg
    ├── psych_study_guide_inside.jpg
    ├── math_formulas_main.jpg
    ├── math_formulas_sample.jpg
    ├── study_desk_main.jpg
    ├── study_desk_drawers.jpg
    ├── study_desk_side.jpg
    ├── office_chair_main.jpg
    └── office_chair_side.jpg
```

## Quick Image Setup Options

### Option 1: Use Placeholder Images
You can use placeholder images from services like:
- https://picsum.photos/800/600 (random images)
- https://via.placeholder.com/800x600 (solid color placeholders)

### Option 2: Download Sample Images
Find appropriate stock photos for:
- University textbooks
- Electronics (laptops, calculators, tablets)
- Study materials and notes
- Student furniture
- Student profile photos (use diverse, professional photos)

### Option 3: Use AI Generated Images
Use tools like:
- DALL-E, Midjourney, or Stable Diffusion
- Generate realistic product photos
- Create diverse student avatars

## Image Specifications
- **Avatars**: 400x400px, square format
- **Product Images**: 800x600px, landscape format
- **Category Images**: 600x400px, landscape format
- **Format**: JPG or PNG
- **File Size**: Keep under 500KB per image for web performance

## Implementation Note
The database references these image paths. Your Next.js application will serve them from the `public/images/` directory. Make sure to create the folder structure and add actual image files for the best user experience.