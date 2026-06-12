import { plainToInstance } from "class-transformer";
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
  Test = "test",
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment;

  @IsInt()
  @IsOptional()
  PORT?: number;

  @IsString()
  @IsOptional()
  DB_HOST?: string;

  @IsInt()
  @IsOptional()
  DB_PORT?: number;

  @IsString()
  @IsOptional()
  DB_USERNAME?: string;

  @IsString()
  @IsOptional()
  DB_PASSWORD?: string;

  @IsString()
  @IsOptional()
  DB_NAME?: string;

  @IsBooleanString()
  @IsOptional()
  DB_SYNCHRONIZE?: string;

  @IsBooleanString()
  @IsOptional()
  DB_LOGGING?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
