#!/bin/bash
# Quick setup script to create placeholder images for testing
# Run this in your Zenith-OG directory

# Create directory structure
mkdir -p public/images/categories
mkdir -p public/images/avatars  
mkdir -p public/images/products

echo "Creating placeholder images..."

# Category placeholders
curl -o public/images/categories/textbooks.jpg "https://picsum.photos/600/400?random=1"
curl -o public/images/categories/electronics.jpg "https://picsum.photos/600/400?random=2"
curl -o public/images/categories/notes.jpg "https://picsum.photos/600/400?random=3"
curl -o public/images/categories/tutoring.jpg "https://picsum.photos/600/400?random=4"
curl -o public/images/categories/stationery.jpg "https://picsum.photos/600/400?random=5"
curl -o public/images/categories/furniture.jpg "https://picsum.photos/600/400?random=6"

# Avatar placeholders
curl -o public/images/avatars/john_smith.jpg "https://picsum.photos/400/400?random=11"
curl -o public/images/avatars/sarah_jones.jpg "https://picsum.photos/400/400?random=12"
curl -o public/images/avatars/mike_brown.jpg "https://picsum.photos/400/400?random=13"
curl -o public/images/avatars/emma_wilson.jpg "https://picsum.photos/400/400?random=14"
curl -o public/images/avatars/david_lee.jpg "https://picsum.photos/400/400?random=15"
curl -o public/images/avatars/lisa_clark.jpg "https://picsum.photos/400/400?random=16"
curl -o public/images/avatars/james_taylor.jpg "https://picsum.photos/400/400?random=17"
curl -o public/images/avatars/anna_martin.jpg "https://picsum.photos/400/400?random=18"

# Product placeholders
curl -o public/images/products/financial_accounting_main.jpg "https://picsum.photos/800/600?random=21"
curl -o public/images/products/financial_accounting_back.jpg "https://picsum.photos/800/600?random=22"
curl -o public/images/products/financial_accounting_inside.jpg "https://picsum.photos/800/600?random=23"
curl -o public/images/products/psychology_textbook_main.jpg "https://picsum.photos/800/600?random=24"
curl -o public/images/products/psychology_textbook_spine.jpg "https://picsum.photos/800/600?random=25"
curl -o public/images/products/psychology_textbook_contents.jpg "https://picsum.photos/800/600?random=26"
curl -o public/images/products/engineering_math_main.jpg "https://picsum.photos/800/600?random=27"
curl -o public/images/products/engineering_math_back.jpg "https://picsum.photos/800/600?random=28"
curl -o public/images/products/grays_anatomy_main.jpg "https://picsum.photos/800/600?random=29"
curl -o public/images/products/grays_anatomy_inside1.jpg "https://picsum.photos/800/600?random=30"
curl -o public/images/products/grays_anatomy_inside2.jpg "https://picsum.photos/800/600?random=31"
curl -o public/images/products/grays_anatomy_spine.jpg "https://picsum.photos/800/600?random=32"
curl -o public/images/products/casio_calculator_main.jpg "https://picsum.photos/800/600?random=33"
curl -o public/images/products/casio_calculator_box.jpg "https://picsum.photos/800/600?random=34"
curl -o public/images/products/casio_calculator_manual.jpg "https://picsum.photos/800/600?random=35"
curl -o public/images/products/dell_laptop_main.jpg "https://picsum.photos/800/600?random=36"
curl -o public/images/products/dell_laptop_keyboard.jpg "https://picsum.photos/800/600?random=37"
curl -o public/images/products/dell_laptop_ports.jpg "https://picsum.photos/800/600?random=38"
curl -o public/images/products/dell_laptop_specs.jpg "https://picsum.photos/800/600?random=39"
curl -o public/images/products/ipad_air_main.jpg "https://picsum.photos/800/600?random=40"
curl -o public/images/products/ipad_air_pencil.jpg "https://picsum.photos/800/600?random=41"
curl -o public/images/products/ipad_air_keyboard.jpg "https://picsum.photos/800/600?random=42"
curl -o public/images/products/ipad_air_accessories.jpg "https://picsum.photos/800/600?random=43"
curl -o public/images/products/accounting_notes_main.jpg "https://picsum.photos/800/600?random=44"
curl -o public/images/products/accounting_notes_sample1.jpg "https://picsum.photos/800/600?random=45"
curl -o public/images/products/accounting_notes_sample2.jpg "https://picsum.photos/800/600?random=46"
curl -o public/images/products/psych_study_guide_main.jpg "https://picsum.photos/800/600?random=47"
curl -o public/images/products/psych_study_guide_inside.jpg "https://picsum.photos/800/600?random=48"
curl -o public/images/products/math_formulas_main.jpg "https://picsum.photos/800/600?random=49"
curl -o public/images/products/math_formulas_sample.jpg "https://picsum.photos/800/600?random=50"
curl -o public/images/products/study_desk_main.jpg "https://picsum.photos/800/600?random=51"
curl -o public/images/products/study_desk_drawers.jpg "https://picsum.photos/800/600?random=52"
curl -o public/images/products/study_desk_side.jpg "https://picsum.photos/800/600?random=53"
curl -o public/images/products/office_chair_main.jpg "https://picsum.photos/800/600?random=54"
curl -o public/images/products/office_chair_side.jpg "https://picsum.photos/800/600?random=55"

echo "Placeholder images created! Your marketplace now has visual content for testing."