import { Body, Controller, Get, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";

@UseGuards(JwtAuthGuard)
@Controller("business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post("profile")
  createProfile(@Request() req, @Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.createProfile(req.user.id, createBusinessDto);
  }

  @Get("profile")
  getProfile(@Request() req) {
    return this.businessService.getProfile(req.user.id);
  }

  @Patch("profile")
  updateProfile(@Request() req, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.updateProfile(req.user.id, updateBusinessDto);
  }
}
