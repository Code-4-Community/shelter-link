import {
  Controller,
  HttpStatus,
  HttpException,
  Post,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NewUserInput } from '../dtos/newUserDTO';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async postUser(@Body() userData: NewUserInput) {
    try {
      return await this.userService.postUser(userData);
    } catch (error) {
      throw new HttpException(
        `Unable to create user: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
