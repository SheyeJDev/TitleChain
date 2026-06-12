import { ConfigService, registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const parseBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

export const databaseConfig = registerAs("database", () => ({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "titlechain",
  synchronize: parseBoolean(
    process.env.DB_SYNCHRONIZE,
    process.env.NODE_ENV !== "production",
  ),
  logging: parseBoolean(process.env.DB_LOGGING),
}));

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>("database.host", "localhost"),
  port: configService.get<number>("database.port", 5432),
  username: configService.get<string>("database.username", "postgres"),
  password: configService.get<string>("database.password", "password"),
  database: configService.get<string>("database.database", "titlechain"),
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: configService.get<boolean>("database.synchronize", true),
  logging: configService.get<boolean>("database.logging", false),
});
