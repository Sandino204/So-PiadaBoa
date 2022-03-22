import { JokeService } from './joke.service';
import { JokeController } from './joke.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JokeRepository } from './joke.repository';
import { VoteRepository } from '../vote/vote.repository';

import { AuthModule } from '../auth/auth.module';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([JokeRepository, VoteRepository]),
    AuthModule,
  ],
  controllers: [JokeController],
  providers: [JokeService],
})
export class JokeModule {}
