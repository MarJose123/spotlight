import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';
import { AttachmentType } from '@/posts/enums/attachment-type.enum';
import { IsNotEmpty } from 'class-validator';
import { PostType } from '@/posts/enums/post-type.enum';
import { User } from '@/users/entities/user.entity';
import { Likes } from '@/likes/entities/likes.entity';
import { Collection } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Posts {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @PrimaryKey({ type: 'uuid' })
  @Index()
  id: string = randomUUID();

  @ApiProperty({ type: 'string' })
  @Property({ type: 'string', columnType: 'longtext' })
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ type: 'string', format: 'enum', enum: AttachmentType })
  @Property()
  @Enum({ items: () => AttachmentType })
  @IsNotEmpty()
  attachmentType!: AttachmentType;

  @ApiProperty({ type: 'string', format: 'uri' })
  @Property({ type: 'string' })
  @IsNotEmpty()
  attachment!: string;

  @ApiProperty({ type: 'string', format: 'enum', enum: PostType, default: PostType.USER })
  @Property()
  @Enum({ items: () => PostType, default: PostType.USER })
  @IsNotEmpty()
  postType: PostType = PostType.USER;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @ManyToOne(() => User)
  user!: User;

  @ApiProperty({ type: Object, format: 'uuid', isArray: true })
  @OneToMany(() => Likes, (likes) => likes.post)
  likes? = new Collection<Likes>(this);

  @ApiProperty({ type: 'string', format: 'date-time' })
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @ApiProperty({ type: 'string', format: 'date-time' })
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
