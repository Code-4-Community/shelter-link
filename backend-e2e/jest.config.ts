/* eslint-disable */
export default {
  displayName: 'backend-e2e',
  globalSetup: '<rootDir>/src/support/global-setup.ts',
  globalTeardown: '<rootDir>/src/support/global-teardown.ts',
  setupFiles: ['<rootDir>/src/support/test-setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testMatch: [
    '<rootDir>/src/backend/dynamodb.spec.ts',
    '<rootDir>/src/backend/event.controller.spec.ts',
    '<rootDir>/src/backend/event.service.spec.ts',
    '<rootDir>/src/backend/shelter.controller.spec.ts',
    '<rootDir>/src/backend/shelter.service.spec.ts',
    '<rootDir>/src/backend/user.controller.spec.ts',
    '<rootDir>/src/backend/user.service.spec.ts'
  ],
};
