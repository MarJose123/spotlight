import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';
import { Posts } from '@/posts/entities/posts.entity';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Likes {
  @PrimaryKey({ type: 'uuid' })
  @Index()
  id: string = randomUUID();

  @ManyToOne(() => Posts)
  post!: Posts;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
