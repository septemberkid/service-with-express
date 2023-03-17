import type {Config} from 'jest';
import { pathsToModuleNameMapper } from "ts-jest";
const { compilerOptions } = require('./tsconfig.json');

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
}
export default config;