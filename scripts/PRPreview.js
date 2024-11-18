import { execSync } from 'child_process'

console.log('[DEPLOY_PREVIEW]: START');
const command = 'npm run deploy:staging';
const output = execSync(command, { encoding: 'utf-8' });
const outputLines = output.split('\n');
// the last line of the build is Vercel's deploy preview url
const DEPLOY_URL = outputLines[outputLines.length - 1];
console.log('[DEPLOY_PREVIEW]: END')
console.log(`You can check the deploy preview on ${DEPLOY_URL}`);