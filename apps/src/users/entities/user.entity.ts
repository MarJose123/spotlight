import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';
import { IsOptional } from 'class-validator';
import { UserStatus } from '@/users/enums/status.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @Index()
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ nullable: true })
  @IsOptional()
  avatar: string | undefined;

  @Property({ unique: true })
  @IsOptional()
  username: string | undefined;

  @Property()
  name!: string;

  @Index()
  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  @Exclude()
  password!: string;

  @Property()
  @Enum({ items: () => UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus = UserStatus.ACTIVE;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
