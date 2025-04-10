#!/usr/bin/env node

/**
 * dev.js
 * Task Master CLI - AI-driven development task management
 * 
 * This is the refactored entry point that uses the modular architecture.
 * It imports functionality from the modules directory and provides a CLI.
 */

// Add at the very beginning of the file
if (process.env.DEBUG === '1') {
  console.error('DEBUG - dev.js received args:', process.argv.slice(2));
}

// Use an absolute path for importing the commands module
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// import { runCLI } from './modules/commands.js'; // Commented out - unused and causes crash

// Changed this section to start the app development server instead
// of running CLI commands
import { spawn } from 'child_process';

// Run the app in development mode - bypass the module import issue
console.log('Starting development server...');
console.log('NOTE: Press "y" when prompted about port selection');

// Using spawn instead of exec to allow for interactive input
const expoProcess = spawn('npx', ['expo', 'start', '--web', '--port', '8083'], { 
  stdio: 'inherit',  // This connects the child process I/O to the parent
  shell: true
});

expoProcess.on('error', (error) => {
  console.error(`Failed to start Expo: ${error.message}`);
});

// We don't need to handle stdout/stderr separately since we're using stdio: 'inherit' 