import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
      },
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/client.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  setupFilesAfterEnv: ['./tests/jest.setup.ts'],
};

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

export default config;
