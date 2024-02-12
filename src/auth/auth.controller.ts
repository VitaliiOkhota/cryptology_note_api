import {Body, Controller, HttpCode, Post, UsePipes, ValidationPipe} from '@nestjs/common'
import {AuthService} from './auth.service';
import {AuthDto} from './dto/auth.dto'
import {RefreshTokenDto} from './dto/refresh-token.dto'
import {LoginDto} from './dto/login.dto'
import {Auth} from './decorators/auth.decorator'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse, ApiOperation, ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import {AuthResponse, ErrorsEntity} from "../entities";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @ApiBody({type: AuthDto})
  @ApiOkResponse({
    status: 200,
    description: 'Registration of a new user was successful.',
    type: AuthResponse
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorsEntity
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorsEntity,
  })
  @ApiOperation({summary: 'Register and create new user'})
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @ApiBody({type: LoginDto})
  @ApiOkResponse({
    status: 200,
    description: 'User login was successful.',
    type: AuthResponse
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorsEntity
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized / Invalid password',
    type: ErrorsEntity
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'User not found',
    type: ErrorsEntity
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorsEntity,
  })
  @ApiOperation({summary: 'Users login'})
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }


  @Post('login/access-token')
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Auth()
  @ApiBody({type: RefreshTokenDto})
  @ApiOkResponse({
    status: 200,
    description: 'Successfully generated new access and refresh tokens..',
    type: AuthResponse
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorsEntity
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized / Invalid bearer token',
    type: ErrorsEntity
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorsEntity,
  })
  @ApiOperation({summary: 'Generate new JWT access token'})
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokens(dto.refreshToken);
  }
}