# PowerShell script to create placeholder images for testing
# Run this in your Zenith-OG directory

Write-Host "Creating image directories..." -ForegroundColor Green

# Create directory structure
New-Item -ItemType Directory -Force -Path "Zenith-OG/public/images/categories"
New-Item -ItemType Directory -Force -Path "Zenith-OG/public/images/avatars"
New-Item -ItemType Directory -Force -Path "Zenith-OG/public/images/products"

Write-Host "Downloading placeholder images..." -ForegroundColor Green

# Category placeholders
Invoke-WebRequest -Uri "https://picsum.photos/600/400?random=1" -OutFile "Zenith-OG/public/images/categories/textbooks.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/600/400?random=2" -OutFile "Zenith-OG/public/images/categories/electronics.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/600/400?random=3" -OutFile "Zenith-OG/public/images/categories/notes.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/600/400?random=4" -OutFile "Zenith-OG/public/images/categories/tutoring.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/600/400?random=5" -OutFile "Zenith-OG/public/images/categories/stationery.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/600/400?random=6" -OutFile "Zenith-OG/public/images/categories/furniture.jpg"

# Avatar placeholders
Invoke-WebRequest -Uri "https://picsum.photos/400/400?random=11" -OutFile "Zenith-OG/public/images/avatars/john_smith.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/400/400?random=12" -OutFile "Zenith-OG/public/images/avatars/sarah_jones.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/400/400?random=13" -OutFile "Zenith-OG/public/images/avatars/mike_brown.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/400/400?random=14" -OutFile "Zenith-OG/public/images/avatars/emma_wilson.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/400/400?random=15" -OutFile "Zenith-OG/public/images/avatars/david_lee.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/400/400?random=16" -OutFile "Zenith-OG/public/images/avatars/lisa_clark.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/400/400?random=17" -OutFile "Zenith-OG/public/images/avatars/james_taylor.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/400/400?random=18" -OutFile "Zenith-OG/public/images/avatars/anna_martin.jpg"

Write-Host "Creating product images..." -ForegroundColor Yellow

# Product placeholders (sample of main ones)
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=21" -OutFile "Zenith-OG/public/images/products/financial_accounting_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=22" -OutFile "Zenith-OG/public/images/products/financial_accounting_back.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=23" -OutFile "Zenith-OG/public/images/products/financial_accounting_inside.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=24" -OutFile "Zenith-OG/public/images/products/psychology_textbook_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=25" -OutFile "Zenith-OG/public/images/products/psychology_textbook_spine.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=26" -OutFile "Zenith-OG/public/images/products/psychology_textbook_contents.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=27" -OutFile "Zenith-OG/public/images/products/engineering_math_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=28" -OutFile "Zenith-OG/public/images/products/engineering_math_back.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=29" -OutFile "Zenith-OG/public/images/products/grays_anatomy_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=30" -OutFile "Zenith-OG/public/images/products/grays_anatomy_inside1.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=31" -OutFile "Zenith-OG/public/images/products/grays_anatomy_inside2.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=32" -OutFile "Zenith-OG/public/images/products/grays_anatomy_spine.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=33" -OutFile "Zenith-OG/public/images/products/casio_calculator_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=34" -OutFile "Zenith-OG/public/images/products/casio_calculator_box.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=35" -OutFile "Zenith-OG/public/images/products/casio_calculator_manual.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=36" -OutFile "Zenith-OG/public/images/products/dell_laptop_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=37" -OutFile "Zenith-OG/public/images/products/dell_laptop_keyboard.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=38" -OutFile "Zenith-OG/public/images/products/dell_laptop_ports.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=39" -OutFile "Zenith-OG/public/images/products/dell_laptop_specs.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=40" -OutFile "Zenith-OG/public/images/products/ipad_air_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=41" -OutFile "Zenith-OG/public/images/products/ipad_air_pencil.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=42" -OutFile "Zenith-OG/public/images/products/ipad_air_keyboard.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=43" -OutFile "Zenith-OG/public/images/products/ipad_air_accessories.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=44" -OutFile "Zenith-OG/public/images/products/accounting_notes_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=45" -OutFile "Zenith-OG/public/images/products/accounting_notes_sample1.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=46" -OutFile "Zenith-OG/public/images/products/accounting_notes_sample2.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=47" -OutFile "Zenith-OG/public/images/products/psych_study_guide_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=48" -OutFile "Zenith-OG/public/images/products/psych_study_guide_inside.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=49" -OutFile "Zenith-OG/public/images/products/math_formulas_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=50" -OutFile "Zenith-OG/public/images/products/math_formulas_sample.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=51" -OutFile "Zenith-OG/public/images/products/study_desk_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=52" -OutFile "Zenith-OG/public/images/products/study_desk_drawers.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=53" -OutFile "Zenith-OG/public/images/products/study_desk_side.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=54" -OutFile "Zenith-OG/public/images/products/office_chair_main.jpg"
Invoke-WebRequest -Uri "https://picsum.photos/800/600?random=55" -OutFile "Zenith-OG/public/images/products/office_chair_side.jpg"

Write-Host "✅ Placeholder images created successfully!" -ForegroundColor Green
Write-Host "Your marketplace now has visual content for testing." -ForegroundColor Cyan
Write-Host "Next step: Run the realistic_sample_data.sql in MySQL Workbench" -ForegroundColor Yellow