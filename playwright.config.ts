import { defineConfig } from '@playwright/test';

const baseURL = process.env.FOUNDRY_E2E_URL ?? 'http://127.0.0.1:30020';
const url = new URL(baseURL);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
  throw new Error('E2E writes test documents: only a loopback Foundry server is allowed.');
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    baseURL,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    },
  },
  outputDir: 'test-results',
  reporter: [['list']],
});
