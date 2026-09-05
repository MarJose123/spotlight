import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const orm = app.get(MikroORM);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.reduce(
          (acc, error) => {
            acc[error.property] = Object.values(error.constraints ?? {});
            return acc;
          },
          {} as Record<string, string[]>,
        );

        return new BadRequestException({
          message: messages,
          error: 'Bad Request',
          statusCode: 422,
        });
      },
    }),
  );
  // In development only, make sure the database exists and the schema is up to
  // date (a missing SQLite database file is created programmatically in
  // `src/config/mikro-orm.config.ts`). Production should rely on migrations.
  if ((process.env.NODE_ENV ?? 'development') === 'development') {
    await orm.schema.ensureDatabase();
    await orm.schema.update();
  }
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
