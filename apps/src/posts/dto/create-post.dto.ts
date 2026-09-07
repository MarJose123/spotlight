import { Enum } from '@mikro-orm/decorators/legacy';
import { IsNotEmpty } from 'class-validator';
import { AttachmentType } from '@/posts/enums/attachment-type.enum';
import { PostType } from '@/posts/enums/post-type.enum';
import { User } from '@/users/entities/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  content!: string;

  @Enum({ items: () => AttachmentType })
  @IsNotEmpty()
  attachmentType!: AttachmentType;

  @IsNotEmpty()
  attachment!: string;

  @Enum({ items: () => PostType, default: PostType.USER })
  @IsNotEmpty()
  postType: PostType = PostType.USER;

  @IsNotEmpty()
  user!: User;
}
