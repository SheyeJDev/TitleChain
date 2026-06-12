import { Controller, Get, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { BusinessModule } from "./business/business.module";
import { databaseConfig, getDatabaseConfig } from "./config/database.config";
import { validate } from "./config/env.validation";
import { InvoicesModule } from "./invoices/invoices.module";
import { RepaymentModule } from "./repayment/repayment.module";
import { RiskModule } from "./risk/risk.module";
import { StellarModule } from "./stellar/stellar.module";
import { UsersModule } from "./users/users.module";

@Controller("health")
class HealthController {
  @Get()
  check() {
    return { status: "ok" };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UsersModule,
    AuthModule,
    BusinessModule,
    InvoicesModule,
    RiskModule,
    StellarModule,
    RepaymentModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
