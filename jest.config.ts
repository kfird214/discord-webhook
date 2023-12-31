import type { Config } from 'jest';
import { config as dotconfig } from 'dotenv';

dotconfig();

console.debug('jest.config.ts: process.env: \n  ' + JSON.stringify(process.env, null, 2).split('\n').join('\n    '));

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
};

export default config;
