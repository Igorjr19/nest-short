import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as handlebars from 'handlebars';
import { join } from 'node:path';
import process from 'node:process';
import { AppModule } from './app.module';

// Diretórios configurados para Clean Architecture
const publicDir = join(__dirname, '..', 'public');
const viewsDir = join(__dirname, 'infrastructure', 'views');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(helmet);

  // Servir arquivos estáticos (CSS puro)
  app.useStaticAssets({
    root: publicDir,
    prefix: '/public/',
  });

  // Configurar Handlebars como View Engine
  app.setViewEngine({
    templates: viewsDir,
    engine: {
      handlebars,
    },
  });

  const port = process.env['PORT'] ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
