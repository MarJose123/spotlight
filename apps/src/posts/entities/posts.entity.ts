import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';
import { AttachmentType } from '@/posts/enums/attachment-type.enum';
import { IsNotEmpty } from 'class-validator';
import { PostType } from '@/posts/enums/post-type.enum';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Posts {
  @PrimaryKey({ type: 'uuid' })
  @Index()
  id: string = randomUUID();

  @Property({ type: 'string', columnType: 'longtext' })
  @IsNotEmpty()
  content!: string;

  @Property()
  @Enum({ items: () => AttachmentType })
  @IsNotEmpty()
  attachmentType!: AttachmentType;

  @Property({ type: 'string' })
  @IsNotEmpty()
  attachment!: string;

  @Property()
  @Enum({ items: () => PostType, default: PostType.USER })
  @IsNotEmpty()
  postType: PostType = PostType.USER;

  @ManyToOne(() => User)
  user!: User;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
