/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@ionic|@stencil|ionicons|rxjs)',
  ],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};