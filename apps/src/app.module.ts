import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import databaseConfig, { DatabaseConfig } from './config/database.config';
import { buildMikroOrmOptions } from './config/mikro-orm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import AppConfig from './config/app.config';
import { AppController } from './app.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, AppConfig],
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        buildMikroOrmOptions(config.getOrThrow<DatabaseConfig>('database')),
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [AuthService, JwtService],
  controllers: [AppController],
})
export class AppModule {}
