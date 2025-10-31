// Simple test to see if Next.js can start at all
const { spawn } = require('child_process');
const path = require('path');

console.log('Testing Next.js server...');
console.log('Current directory:', __dirname);
console.log('');

const next = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

next.on('error', (error) => {
  console.error('Failed to start:', error);
});

next.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

// Keep alive for 30 seconds
setTimeout(() => {
  console.log('\nTest complete. Killing server...');
  next.kill();
  process.exit(0);
}, 30000);
