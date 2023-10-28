/* eslint-disable @typescript-eslint/no-var-requires */
const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
  moduleNameMapper,
  moduleFileExtensions: ['ts', 'js', 'json'],
  modulePathIgnorePatterns: ['<rootDir>/src/@types', '<rootDir>/src/main.ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': ['@swc/jest'] },
  collectCoverageFrom: ['src/users/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
};
