import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  projects: [
    '<rootDir>/jest.frontend.config.ts', // Frontend tests
    '<rootDir>/jest.backend.config.ts',  // Backend tests
  ],

//   setupFilesAfterEnv: [
//     '<rootDir>/jest.setup.ts',
//     '<rootDir>/text-encoder.mock.ts',
//     '<rootDir>/singleton.ts'
// ],
  preset: "ts-jest",
}

export default createJestConfig(config)
