import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {PrismaService} from './prisma.service'
import * as process from 'process'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import * as path from 'path'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.API_PORT || 3001;
  const prismaService = app.get(PrismaService);

  const config = new DocumentBuilder()
      .setTitle('Cryptology note-taking application API')
      .setDescription('Documentation of a RESTful API for a simple note-taking application built with NestJS. It includes a guide with a list of endpoints and rules on how to use them, as well as the types of input and output data.')
      .setVersion('1.0')
      .addTag('API')
      .build()
  const documentation = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentation)

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  });
}
bootstrap();
