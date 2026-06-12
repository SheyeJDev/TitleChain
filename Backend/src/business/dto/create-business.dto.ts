import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BusinessVerificationStatus } from "../business-profile.entity";

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsOptional()
  @IsEnum(BusinessVerificationStatus)
  verificationStatus?: BusinessVerificationStatus;
}
