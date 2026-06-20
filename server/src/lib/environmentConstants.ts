import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    
    SUPPRESS_RESPONSE_ERROR_MESSAGES: boolean;
    SERVER_UNDER_MAINTENANCE: boolean;

    DATABASE_URL: string;
    PORT: number;
    ALLOWED_ORIGINS: string[];

    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;

    LOG_LEVEL: string;
    LOG_PRETTY: boolean;
    SAVE_LOG_TO_FILE: boolean;
}

const requiredEnvVars = ['DATABASE_URL', 'PORT', 'JWT_SECRET','JWT_EXPIRES_IN' ] as const;

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.log(`Environment variable ${varName} is missing!`);
        process.exit(1);
    }
});

const ENV: EnvConfig = {

    SUPPRESS_RESPONSE_ERROR_MESSAGES: process.env.SUPPRESS_RESPONSE_ERROR_MESSAGES==='true',
    SERVER_UNDER_MAINTENANCE: process.env.SERVER_UNDER_MAINTENANCE==='true',

    DATABASE_URL: process.env.DATABASE_URL as string,
    PORT: parseInt(process.env.PORT as string, 10),
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],

    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'trace',
    LOG_PRETTY: process.env.LOG_PRETTY === 'true',
    SAVE_LOG_TO_FILE: process.env.SAVE_LOG_TO_FILE === 'true'
};

console.log('20241004143135 - Environment variables loaded successfully');

export default ENV;