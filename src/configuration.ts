export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV as 'prod' | 'dev',
  MAILGUN: {
    USER: process.env.MAILGUN_USER,
    PASS: process.env.MAILGUN_PASS,
    HOST: process.env.MAILGUN_HOST,
    PORT: Number(process.env.MAILGUN_PORT),
  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: Number(process.env.REDIS_PORT),
  },
});
