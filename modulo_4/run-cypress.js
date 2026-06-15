const { spawn } = require('child_process');
const path = require('path');

const binaryPath = 'C:\\Users\\mario\\AppData\\Local\\Cypress\\Cache\\15.17.0\\Cypress\\Cypress.exe';
const projectPath = 'D:\\dev_projects\\curso_angular\\modulo_4';

const args = [
  '--disable-gpu',
  '--disable-software-rasterizer',
  '--disable-gpu-compositing',
  '--disable-gpu-sandbox',
  '--no-sandbox',
  '--run-project', projectPath,
  '--cwd', projectPath
];

console.log('Spawning Cypress directly with GPU disabled...');
const child = spawn(binaryPath, args, {
  cwd: projectPath,
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_DISABLE_GPU: '1',
    ELECTRON_EXTRA_LAUNCH_ARGS: '--disable-gpu --disable-software-rasterizer'
  }
});

child.on('close', (code) => {
  console.log(`Cypress exited with code ${code}`);
  process.exit(code);
});
