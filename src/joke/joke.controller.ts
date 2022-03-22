/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JokeService } from './joke.service';
import { Joke } from './joke.entity';
import { GetJokeFilterDto } from './dto/get-joke-filter.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Sort } from './jokes-sort.enum';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VoteTypes } from '../vote/vote-type.enum';

@Controller('joke')
export class JokeController {
  constructor(private jokesService: JokeService) {}

  @Get()
  getJokes(@Query() payload: GetJokeFilterDto): Promise<Joke[]> {
    return this.jokesService.getAllJokes(payload);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/my')
  getAllMyJokes(
    @GetUser() user: User,
    @Query('search') search?: string,
    @Query('sort') sort?: Sort,
  ): Promise<Joke[]> {
    return this.jokesService.getJokesByUser({
      sort,
      userId: user.id,
      search,
    });
  }

  @UseGuards(JWTAuthGuard)
  @Get('/:id')
  getJokeById(@Param('id') jokeId: string): Promise<Joke> {
    return this.jokesService.getJoke({ jokeId });
  }

  @UseGuards(JWTAuthGuard)
  @Post('')
  createNewJoke(
    @Body('description') description: string,
    @Body('title') title: string,
    @GetUser() user: User,
  ): Promise<Joke> {
    return this.jokesService.createJoke({
      description,
      title,
      userId: user.id,
    });
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id/like')
  likeAJoke(@Param('id') jokeId: string, @GetUser() user: User): Promise<Joke> {
    return this.jokesService.updateVote({
      jokeId,
      userId: user.id,
      voteType: VoteTypes.UPVOTES,
    });
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id/dislike')
  dislikeAJoke(
    @Param('id') jokeId: string,
    @GetUser() user: User,
  ): Promise<Joke> {
    return this.jokesService.updateVote({
      jokeId,
      userId: user.id,
      voteType: VoteTypes.DOWNVOTES,
    });
  }

  @UseGuards(JWTAuthGuard)
  @Patch('/:id')
  updateJoke(
    @Param('id') jokeId: string,
    @GetUser() user: User,
    @Body('description') description?: string,
    @Body('title') title?: string,
  ): Promise<Joke> {
    return this.jokesService.updateJoke({
      description,
      jokeId,
      title,
      userId: user.id,
    });
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  deleteJoke(
    @Param('id') jokeId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.jokesService.deleteJoke({
      jokeId,
      userId: user.id,
    });
  }
}
