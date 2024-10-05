import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config = {
  displayName: 'backend',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/backend/**/*.test.tsx'],

  setupFilesAfterEnv: [
    '<rootDir>/text-encoder.mock.ts',
    '<rootDir>/singleton.ts',
  ],
  preset: 'ts-jest',
};

export default createJestConfig(customJestConfig);
