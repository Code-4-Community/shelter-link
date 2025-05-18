require('ts-node').register();

module.exports = {
    mutator: 'javascript',
    coverageAnalysis: 'off',
    jest: {
        projectType: 'custom',
        configFile: './backend-e2e/jest.config.ts',
    },
    testRunner: "command",
    commandRunner: {
      command: "npm run test:e2e" // Or whatever command runs your backend-e2e tests
    },
    coverageAnalysis: "perTest",
    reporters: ["html", "clear-text", "progress"],
    mutate: ['backend/src/event/*.ts', 
        'backend/src/shelter/*.ts', 
        'backend/src/user/*.ts', 
        'backend/src/dynamodb.ts',], 
    files: [
        'backend-e2e/jest.config.ts',
        'backend-e2e/src/backend/*.spec.ts', // <- include all test files
        'backend/src/*/*.ts',              // <- include source files
        'backend/src/*.ts',
        'backend/*.json',
        'tsconfig.json',            // <- important for TypeScript setup
        'backend-e2e/*.json',
        'backend-e2e/src/support/global-setup.ts',
        'backend-e2e/src/support/global-teardown.ts',
        'backend-e2e/src/support/test-setup.ts',
        'tsconfig.base.json',
        'package.json',
    ],
    timeoutMS: 10000,
    concurrency: 3,
}
