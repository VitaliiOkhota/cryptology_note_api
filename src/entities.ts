import { ApiProperty } from '@nestjs/swagger';
import {Notes} from "@prisma/client";

export class UserEntity {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;
}

export class AuthResponse {
    @ApiProperty({ type: () => UserEntity })
    user: UserEntity;

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}

export class ErrorsEntity {

    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: [string];

    @ApiProperty()
    error: string;
}

export class NoteEntity implements Notes {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty({required: false, nullable: true})
    description: string | null;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}