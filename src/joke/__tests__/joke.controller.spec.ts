import { Test, TestingModule } from '@nestjs/testing';
import { VoteRepository } from '../../vote/vote.repository';
import { JokeRepository } from '../joke.repository';
import { UsersRepository } from '../../auth/user.repository';
import { JokeController } from '../joke.controller';
import { AuthModule } from '../../auth/auth.module';
import { JokeService } from '../joke.service';
import { Joke } from '../joke.entity';
import { User } from '../../auth/user.entity';
import { Connection } from 'typeorm';
import { Vote } from '../../vote/vote.entity';
import { VoteTypes } from '../../vote/vote-type.enum';

const getJokes: Joke[] = [
  {
    id: 'b3da897d-87c4-456d-82de-ae2d0f75cea9',
    created_at: new Date(),
    title: 'test',
    downvotes: 0,
    upvotes: 0,
    description: 'teste 123',
    user: null,
    votes: null,
  },
];

const getJokeById: Joke = {
  id: 'b3da897d-87c4-456d-82de-ae2d0f75cea9',
  created_at: new Date(),
  title: 'test',
  downvotes: 0,
  upvotes: 0,
  description: 'teste 123',
  user: null,
  votes: null,
};

const updateJoke: Joke = {
  id: 'b3da897d-87c4-456d-82de-ae2d0f75cea9',
  created_at: new Date(),
  title: 'test 123',
  downvotes: 0,
  upvotes: 0,
  description: 'teste 123',
  user: null,
  votes: null,
};

const updateJokeLike: Joke = {
  id: 'b3da897d-87c4-456d-82de-ae2d0f75cea9',
  created_at: new Date(),
  title: 'test 123',
  downvotes: 0,
  upvotes: 1,
  description: 'teste 123',
  user: null,
  votes: null,
};

const getUserByEmail: User = {
  id: '4a9b3564-6e0e-4c41-9769-f241c768f678',
  email: 'test@gmail.com',
  name: 'test',
  password: 'Sandino204$5',
  jokes: null,
  votes: null,
};

const voteLike: Vote = {
  user: null,
  joke: null,
  id: '4a9b3564-6e0e-4c41-9769-f241c768f678',
  type: VoteTypes.UPVOTES,
};

const voteDislike: Vote = {
  user: null,
  joke: null,
  id: '4a9b3564-6e0e-4c41-9769-f241c768f678',
  type: VoteTypes.DOWNVOTES,
};

describe('joke controller', () => {
  let voteRepository: VoteRepository;
  let jokeRepository: JokeRepository;
  let connection: any;
  let jokeController: JokeController;
  const mockConnection = () => ({
    transaction: jest.fn(),
  });
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        JokeService,
        JokeRepository,
        VoteRepository,
        {
          provide: Connection,
          useFactory: mockConnection,
        },
      ],
      controllers: [JokeController],
    }).compile();

    jokeController = app.get(JokeController);
    connection = app.get(Connection);
    jokeRepository = app.get(JokeRepository);
    voteRepository = app.get(VoteRepository);
  });

  describe('get all jokes', () => {
    it('should return all jokes', async () => {
      jest.spyOn(jokeRepository, 'getJokes').mockResolvedValue(getJokes);
      await expect(
        jokeController.getJokes({
          search: undefined,
          sort: undefined,
        }),
      ).resolves.toStrictEqual(getJokes);
    });
  });

  describe('get all my jokes', () => {
    it('should return', async () => {
      jest.spyOn(jokeRepository, 'getJokesByUser').mockResolvedValue([]);

      await expect(
        jokeController.getAllMyJokes(getUserByEmail, undefined, undefined),
      ).resolves.toStrictEqual([]);
    });

    it('should return', async () => {
      jest.spyOn(jokeRepository, 'getJokesByUser').mockResolvedValue(getJokes);

      await expect(
        jokeController.getAllMyJokes(getUserByEmail, undefined, undefined),
      ).resolves.toStrictEqual(getJokes);
    });
  });

  describe('get joke by Id', () => {
    it('should return', async () => {
      jest.spyOn(jokeRepository, 'getJokeById').mockResolvedValue(getJokeById);

      await expect(
        jokeRepository.getJokeById({
          jokeId: '4a9b3564-6e0e-4c41-9769-f241c768f678',
        }),
      ).resolves.toStrictEqual(getJokeById);
    });
  });

  describe('create new joke', () => {
    it('should create a new joke', async () => {
      jest.spyOn(jokeRepository, 'createJoke').mockResolvedValue(getJokeById);

      await expect(
        jokeRepository.createJoke({
          description: 'test',
          title: 'test',
          userId: '4a9b3564-6e0e-4c41-9769-f241c768f678',
        }),
      ).resolves.toStrictEqual(getJokeById);
    });
  });

  describe('update Joke', () => {
    it('should update because not found', async () => {
      jest.spyOn(jokeRepository, 'getJokeById').mockResolvedValue(getJokeById);
      jest.spyOn(jokeRepository, 'updateJoke').mockResolvedValue(updateJoke);

      await expect(
        jokeRepository.updateJoke({
          description: undefined,
          title: 'test 123',
          jokeId: '4a9b3564-6e0e-4c41-9769-f241c768f678',
          userId: '4a9b3564-6e0e-4c41-9769-f241c768f678',
        }),
      ).resolves.toStrictEqual(updateJoke);
    });
  });
});
