const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Textbook products data
const textbooks = [
  {
    filename: 'textbook1.jpg',
    title: 'Computer Science\nData Structures',
    subject: 'CSC2001F'
  },
  {
    filename: 'chem-book.jpg',
    title: 'Organic Chemistry',
    subject: 'CHM2046'
  },
  {
    filename: 'math-textbook.jpg',
    title: 'Calculus',
    subject: 'MAT2001'
  },
  {
    filename: 'physics-book.jpg',
    title: 'Physics',
    subject: 'PHY1001'
  },
  {
    filename: 'biology-book.jpg',
    title: 'Biology',
    subject: 'BIO1001'
  }
];

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate images
textbooks.forEach((book) => {
  // Create canvas
  const width = 600;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient (purple theme)
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#7c3aed'); // Purple
  gradient.addColorStop(1, '#5b21b6'); // Darker purple
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw book spine effect
  ctx.fillStyle = '#4c1d95';
  ctx.fillRect(0, 0, 60, height);

  // Draw book pages effect (right side)
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(width - 20, 50, 15, height - 100);

  // Draw book icon (simple open book)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 60, 200);
  ctx.lineTo(width / 2 - 60, 280);
  ctx.lineTo(width / 2, 260);
  ctx.lineTo(width / 2 + 60, 280);
  ctx.lineTo(width / 2 + 60, 200);
  ctx.stroke();

  // Center line
  ctx.beginPath();
  ctx.moveTo(width / 2, 200);
  ctx.lineTo(width / 2, 260);
  ctx.stroke();

  // Add subject code
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(book.subject, width / 2, 380);

  // Add title (handle multi-line)
  ctx.font = 'bold 48px Arial';
  const lines = book.title.split('\n');
  let yPosition = 480;
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, yPosition + (index * 60));
  });

  // Add decorative elements
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 150);
  ctx.lineTo(500, 150);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(100, height - 150);
  ctx.lineTo(500, height - 150);
  ctx.stroke();

  // Add "TEXTBOOK" label at bottom
  ctx.font = '24px Arial';
  ctx.fillStyle = '#e9d5ff';
  ctx.fillText('TEXTBOOK', width / 2, height - 80);

  // Save image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  const outputPath = path.join(outputDir, book.filename);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated: ${book.filename}`);
});

console.log('\n✨ All textbook images generated successfully!');
console.log(`📁 Images saved to: ${outputDir}`);
