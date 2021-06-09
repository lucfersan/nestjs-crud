import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import { validate } from 'uuid';
import { User } from './user.entity';

type Request = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  async findAll(): Promise<User[]> {
    const usersRepository = getRepository(User);

    const users = await usersRepository.find();

    return users;
  }

  async create({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      throw new HttpException('User already exists.', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hash(password, 8);
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }

  async update(id: string, { name, email, password }: Request): Promise<User> {
    const validateId = validate(id);

    if (!validateId) {
      throw new HttpException('Invalid id', HttpStatus.NOT_ACCEPTABLE);
    }

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    if (user.email !== email) {
      const findUser = await usersRepository.findOne({ where: { email } });

      if (findUser) {
        throw new HttpException(
          'Another user already registered with this email.',
          HttpStatus.CONFLICT,
        );
      }
    }

    user.name = name;
    user.email = email;
    user.password = await hash(password, 8);

    await usersRepository.save(user);
    return user;
  }

  async delete(id: string): Promise<void> {
    const validateId = validate(id);

    if (!validateId) {
      throw new HttpException('Invalid id', HttpStatus.NOT_ACCEPTABLE);
    }

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    await usersRepository.delete(user.id);
  }
}
