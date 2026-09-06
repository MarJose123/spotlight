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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  app.enableShutdownHooks();
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
          statusCode: 400,
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

  /**
   * Swagger UI documentation
   */

  const configOpenApi = new DocumentBuilder()
    .setTitle('Spotlight API')
    .setDescription('Spotlight API description')
    .setVersion('1.0')
    .build();

  const openApiDocumentFactory = () =>
    SwaggerModule.createDocument(app, configOpenApi);
  SwaggerModule.setup('docs', app, openApiDocumentFactory);

  /**
   * Start the application
   */

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
