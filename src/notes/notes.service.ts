import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotesDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
    constructor(private prisma: PrismaService) {}

    private async getNoteById(id: number, userId: number) {
        return this.prisma.notes.findUnique({
            where: { userId, id },
        });
    }

    private async checkNoteExistence(id: number, userId: number) {
        const existingNote = await this.getNoteById(id, userId);

        if (!existingNote) {
            throw new NotFoundException(`Note with id ${id} and userId ${userId} not found`)
        }

        return existingNote;
    }

    async createNote(dto: NotesDto, userId: number) {
        return this.prisma.notes.create({
            data: {
                title: dto.title,
                description: dto.description,
                user: { connect: { id: userId } },
            },
        });
    }

    async getAllUserNotes(userId: number) {
        return this.prisma.notes.findMany({
            where: { userId },
        });
    }

    async getById(id: number, userId: number) {
        try {
            return await this.checkNoteExistence(id, userId);
        } catch (error) {
            throw new NotFoundException(`Note with id ${id} and userId ${userId} not found`)
        }
    }

    async updateNote(id: number, dto: NotesDto, userId: number) {
        try {
            await this.checkNoteExistence(id, userId);

            return this.prisma.notes.update({
                where: { id, userId },
                data: { title: dto.title, description: dto.description },
            });
        } catch (error) {
            throw new NotFoundException(`Note with id ${id} and userId ${userId} not found`)
        }
    }

    async deleteNote(id: number, userId: number) {
        try {
            await this.checkNoteExistence(id, userId);

            return this.prisma.notes.delete({
                where: { id, userId },
            });
        } catch (error) {
            throw new NotFoundException(`Note with id ${id} and userId ${userId} not found`)
        }
    }
}