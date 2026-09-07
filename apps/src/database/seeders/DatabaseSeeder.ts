import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from '@/database/seeders/UserSeeder';
import { PostsSeeder } from '@/database/seeders/PostsSeeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [UserSeeder, PostsSeeder]);
  }
}
