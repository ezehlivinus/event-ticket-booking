import { registerAs } from "@nestjs/config";

export const databaseConfig = registerAs('database', () => {
  const params = ({
    host: process.env.DB_HOST,
    port: 5432, // Always use 5432 for internal container communication
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  console.log(params);

  return params;
});