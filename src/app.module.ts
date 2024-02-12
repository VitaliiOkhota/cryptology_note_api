import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {PrismaService} from './prisma.service'
import {ConfigModule} from '@nestjs/config'
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, NotesModule],
  providers: [PrismaService],
})
export class AppModule {}
