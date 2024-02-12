import {Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe,} from '@nestjs/common';
import {NotesService} from './notes.service';
import {NotesDto} from './dto/notes.dto';
import {Auth} from '../auth/decorators/auth.decorator';
import {CurrentUser} from '../auth/decorators/user.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import {ErrorsEntity, NoteEntity} from "../entities";

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @Auth()
  @ApiOkResponse({
    status: 200,
    description: 'New note created successfully.',
    type: NoteEntity
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
  @ApiOperation({summary: 'Create new note'})
  createNote(@Body() dto: NotesDto, @CurrentUser() user) {
    const { id: userId } = user;
    return this.notesService.createNote(dto, userId);
  }

  @Get()
  @Auth()
  @ApiOkResponse({
    status: 200,
    description: 'Successfully retrieved all notes of the current user',
    type: [NoteEntity]
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized / Invalid bearer token',
    type: ErrorsEntity
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
    type: ErrorsEntity
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorsEntity,
  })
  @ApiOperation({summary: 'Get all notes of the current user'})
  getUserNotes(@CurrentUser() user) {
    const { id: userId } = user;
    return this.notesService.getAllUserNotes(userId);
  }

  @Get(':id')
  @Auth()
  @ApiOkResponse({
    status: 200,
    description: 'Successfully retrieved the note by its id.',
    type: NoteEntity
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized / Invalid bearer token',
    type: ErrorsEntity
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
    type: ErrorsEntity
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorsEntity,
  })
  @ApiOperation({summary: 'Get the note of the current user by note_id'})
  @ApiParam({ name: 'id', description: 'Note ID' })
  getNoteById(@Param('id') id: string, @CurrentUser() user) {
    const { id: userId } = user;
    return this.notesService.getById(+id, userId);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @Auth()
  @ApiBody({type: NotesDto})
  @ApiOkResponse({
    status: 200,
    description: 'Note successfully updated.',
    type: NoteEntity
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
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
    type: ErrorsEntity
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorsEntity,
  })
  @ApiOperation({summary: 'Change the note of the current user by note_id'})
  @ApiParam({ name: 'id', description: 'Note ID' })
  updateNote(@Param('id') id: string, @Body() dto: NotesDto, @CurrentUser() user) {
    const { id: userId } = user;
    return this.notesService.updateNote(+id, dto, userId);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @Auth()
  @ApiOkResponse({
    status: 200,
    description: 'Note successfully updated.',
    type: NoteEntity
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized / Invalid bearer token',
    type: ErrorsEntity
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
    type: ErrorsEntity
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorsEntity,
  })
  @ApiOperation({summary: 'Delete the note of the current user by note_id'})
  @ApiParam({ name: 'id', description: 'Note ID' })
  deleteNote(@Param('id') id: string, @CurrentUser() user) {
    const { id: userId } = user;
    return this.notesService.deleteNote(+id, userId);
  }
}