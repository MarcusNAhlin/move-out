import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config = {
  displayName: 'frontend',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/frontend/**/*.test.tsx'],

  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/text-encoder.mock.ts',
    '<rootDir>/singleton.ts',
  ],
  preset: 'ts-jest',
};

export default createJestConfig(customJestConfig);
