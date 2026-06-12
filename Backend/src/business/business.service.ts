import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { BusinessProfile } from "./business-profile.entity";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto";

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessProfile)
    private readonly businessProfileRepository: Repository<BusinessProfile>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createProfile(
    userId: string,
    createBusinessDto: CreateBusinessDto,
  ): Promise<BusinessProfile> {
    const user = await this.findUser(userId);
    const existingProfile = await this.findByUserId(userId);

    if (existingProfile) {
      throw new ConflictException("Business profile already exists");
    }

    const profile = this.businessProfileRepository.create({
      ...createBusinessDto,
      user,
    });

    return this.businessProfileRepository.save(profile);
  }

  async getProfile(userId: string): Promise<BusinessProfile> {
    const profile = await this.findByUserId(userId);

    if (!profile) {
      throw new NotFoundException("Business profile not found");
    }

    return profile;
  }

  async updateProfile(
    userId: string,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<BusinessProfile> {
    const profile = await this.getProfile(userId);
    Object.assign(profile, updateBusinessDto);

    return this.businessProfileRepository.save(profile);
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  private findByUserId(userId: string): Promise<BusinessProfile | null> {
    return this.businessProfileRepository
      .createQueryBuilder("profile")
      .leftJoinAndSelect("profile.user", "user")
      .where("user.id = :userId", { userId })
      .getOne();
  }
}
