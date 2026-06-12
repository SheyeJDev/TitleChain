import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";

export enum BusinessVerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

@Entity("business_profiles")
export class BusinessProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  companyName: string;

  @Column({ unique: true })
  registrationNumber: string;

  @Column()
  country: string;

  @Column()
  industry: string;

  @Column({
    type: "enum",
    enum: BusinessVerificationStatus,
    default: BusinessVerificationStatus.PENDING,
  })
  verificationStatus: BusinessVerificationStatus;

  @OneToOne(() => User, (user) => user.businessProfile, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
