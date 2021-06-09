import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { CreateUserDTO } from './create-user-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  @Get()
  async findAll(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const usersService = new UsersService();

    const users = await usersService.findAll();

    return response.json(classToClass(users));
  }

  @Post()
  async create(
    @Body() { name, email, password }: CreateUserDTO,
    @Res() response: Response,
  ): Promise<Response> {
    const usersService = new UsersService();

    const user = await usersService.create({ name, email, password });

    return response.json(classToClass(user));
  }

  @Put('/:id')
  async update(
    @Body() { name, email, password }: CreateUserDTO,
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    const usersService = new UsersService();

    const user = await usersService.update(id, { name, email, password });

    return response.json(classToClass(user));
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    const usersService = new UsersService();

    await usersService.delete(id);

    return response.status(204).json();
  }
}
