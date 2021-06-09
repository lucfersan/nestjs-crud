import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [TypeOrmModule.forRoot()],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
