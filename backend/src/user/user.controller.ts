import {
  Controller,
  HttpStatus,
  HttpException,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NewUserInput } from '../dtos/newUserDTO';
import { BookmarkRequest, LoginUserRequest } from '../types';
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async postUser(@Body() userData: NewUserInput) {
    try {
      const user = await this.userService.postUser(userData);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        user: user,
      };
    } catch (error) {
      throw new HttpException(
        `Unable to create user: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('/login')
  public async loginUser(@Body() loginData: LoginUserRequest) {
    try {
      return await this.userService.loginUser(loginData);
    } catch (error) {
      throw new HttpException(
        `Unable to login user: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  public async getUsers() {
    try {
      return await this.userService.getUsers();
    } catch (error) {
      throw new HttpException(
        `Unable to get users: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('/bookmarks/:userId')
  public async getUserBookmarks(
    @Param('userId') userId: string,
    @Query('type') type: 'shelter' | 'event'
  ) {
    return await this.userService.getUserBookmarks(userId, type);
  }

  @Post('/bookmarks/:type')
  public async postUserBookmark(
    @Param('type') type: 'shelter' | 'event',
    @Body() bookmarkData: BookmarkRequest
  ) {
    const { userId, bookmarkId } = bookmarkData.body;

    return await this.userService.postOrDeleteBookmark(
      userId,
      bookmarkId,
      type
    );
  }
}
