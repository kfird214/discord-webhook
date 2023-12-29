import type { Config } from 'jest';
import { config as dotconfig } from 'dotenv';

dotconfig();

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
};

export default config;
