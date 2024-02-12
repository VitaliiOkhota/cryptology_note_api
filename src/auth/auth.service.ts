import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async register(dto: AuthDto) {
        const existUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existUser) throw new BadRequestException('User already exists');

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: await hash(dto.password),
                name: dto.name,
            },
        });

        const tokens = await this.issueTokens(user.id);

        return {
            user: this.returnUserFields(user),
            ...tokens,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);
        const tokens = await this.issueTokens(user.id);

        return {
            user: this.returnUserFields(user),
            ...tokens,
        };
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken);
        if (!result) throw new UnauthorizedException('Invalid refresh token');

        const user = await this.prisma.user.findUnique({
            where: { id: result.id },
        });

        if (!user) throw new NotFoundException('User not found');

        const tokens = await this.issueTokens(user.id);

        return {
            user: this.returnUserFields(user),
            ...tokens,
        };
    }

    //--------------------------------------------------------------------------------------

    private async issueTokens(userId: number) {
        const data = { id: userId };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(data, { expiresIn: '1h' }),
            this.jwt.signAsync(data, { expiresIn: '7d' }),
        ]);

        return { accessToken, refreshToken };
    }

    private returnUserFields(user: User) {
        const { id, email, name } = user;
        return { id, email, name };
    }

    private async validateUser(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new NotFoundException('User not found');

        const isValid = await verify(user.password, dto.password);

        if (!isValid) throw new UnauthorizedException('Invalid password');

        return user;
    }
}