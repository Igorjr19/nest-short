import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as handlebars from 'handlebars';
import { join } from 'node:path';
import { AppModule } from './app.module';

const publicDir = join(__dirname, '..', 'public');
const viewsDir = join(__dirname, '..', 'views');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useStaticAssets({
    root: publicDir,
    prefix: '/public/',
  });
  app.setViewEngine({
    templates: viewsDir,
    engine: {
      handlebars,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
