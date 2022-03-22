/*
https://docs.nestjs.com/providers#services
*/

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Joke } from './joke.entity';
import { JokeRepository } from './joke.repository';
import { CreateJokeDto } from './dto/create-joke.dto';
import { UpdateJokeDto } from './dto/update-joke.dto';
import { GetJokeFilterDto } from './dto/get-joke-filter.dto';
import { GetJokeDto } from './dto/get-joke.dto';
import { GetJokeByUserFilterDto } from './dto/get-joke-filter-user.dto';
import { Connection } from 'typeorm';
import { VoteRepository } from '../vote/vote.repository';
import { UpdateVoteJokeDto } from './dto/update-vote-joke.dto';

@Injectable()
export class JokeService {
  constructor(
    private jokesRepository: JokeRepository,
    private voteRepository: VoteRepository,
    private connection: Connection,
  ) {}

  async getAllJokes(payload: GetJokeFilterDto): Promise<Joke[]> {
    return await this.jokesRepository.getJokes(payload);
  }

  async getJokesByUser(payload: GetJokeByUserFilterDto): Promise<Joke[]> {
    return await this.jokesRepository.getJokesByUser(payload);
  }

  async getJoke(payload: GetJokeDto): Promise<Joke> {
    const { jokeId, userId } = payload;

    const joke = await this.jokesRepository.getJokeById({
      jokeId,
      userId,
    });

    if (joke === null) {
      throw new NotFoundException(`Joke not found`);
    }

    return joke;
  }

  async createJoke(payload: CreateJokeDto): Promise<Joke> {
    return this.jokesRepository.createJoke(payload);
  }

  async updateJoke(payload: UpdateJokeDto): Promise<Joke> {
    const { jokeId, userId, description, title } = payload;

    const joke = await this.getJoke({
      userId,
      jokeId,
    });

    const newValues = {
      userId,
      jokeId,
      description: description !== undefined ? description : joke.description,
      title: title !== undefined ? title : joke.title,
    };

    return this.jokesRepository.updateJoke(newValues);
  }

  async updateVote(input: UpdateVoteJokeDto): Promise<Joke> {
    const { jokeId, userId, voteType } = input;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const found = await this.voteRepository.getVote({
        userId,
        jokeId,
      });

      if (found && found.type === voteType) {
        throw new ConflictException(`Interaction already exists`);
      }

      if (found) {
        await this.jokesRepository.updateVote({
          jokeId,
          value: -1,
          vote: found.type,
        });
      }

      await this.voteRepository.putVote({
        jokeId,
        userId,
        type: voteType,
      });

      const updatedJoke = await this.jokesRepository.updateVote({
        jokeId,
        value: +1,
        vote: voteType,
      });

      await queryRunner.commitTransaction();

      return updatedJoke;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(`Something was wrong`);
    }
  }

  async deleteJoke(payload: { jokeId: string; userId: string }): Promise<void> {
    const { jokeId } = payload;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.getJoke(payload);

      await this.voteRepository.deleteVoteByJokeId(jokeId);

      await this.jokesRepository.deleteJoke(jokeId);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(`Something was wrong`);
    }
  }
}
