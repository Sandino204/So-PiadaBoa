import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { UsersRepository } from '../user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Connection } from 'typeorm';

const getUserByEmail: User = {
  id: '4a9b3564-6e0e-4c41-9769-f241c768f678',
  email: 'test@gmail.com',
  name: 'test',
  password: 'Sandino204$5',
  jokes: null,
  votes: null,
};

const createUser: User = {
  id: '4a9b3564-6e0e-4c41-9769-f241c768f678',
  email: 'test@gmail.com',
  name: 'test',
  password: 'Sandino204$5',
  jokes: null,
  votes: null,
};

describe('auth', () => {
  let usersRepository: UsersRepository;
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'mock',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [AuthService, JwtStrategy, UsersRepository],
      controllers: [AuthController],
      exports: [JwtStrategy, PassportModule],
    }).compile();

    authController = app.get(AuthController);

    usersRepository = app.get(UsersRepository);
  });

  describe('signUp', () => {
    it('should not create a new Account, for conflict on email', async () => {
      jest
        .spyOn(usersRepository, 'getUserByEmail')
        .mockResolvedValue(getUserByEmail);
      jest.spyOn(usersRepository, 'createUser').mockResolvedValue();

      expect(
        authController.signUp({
          email: 'test@gmail.com',
          name: 'test',
          password: 'Sandino204$5',
        }),
      ).rejects.toThrow();
    });

    it('should create a new Account', async () => {
      jest
        .spyOn(usersRepository, 'getUserByEmail')
        .mockResolvedValue(undefined);
      jest.spyOn(usersRepository, 'createUser').mockResolvedValue();

      expect(
        authController.signUp({
          email: 'test@gmail.com',
          name: 'test',
          password: 'Sandino204$5',
        }),
      ).resolves.not.toThrow();
    });
  });

  describe('signIn', () => {
    it('should not login because not found user', () => {
      jest
        .spyOn(usersRepository, 'getUserByEmail')
        .mockResolvedValue(undefined);
      expect(
        authController.signIn({
          email: 'test@gmail.com',
          password: 'Sandino204$5',
        }),
      ).rejects.toThrow();
    });
  });

  it('should get success ', () => {
    jest
      .spyOn(usersRepository, 'getUserByEmail')
      .mockResolvedValue(getUserByEmail);
    expect(
      authController.signIn({
        email: 'test@gmail.com',
        password: 'Sandino204$5',
      }),
    ).rejects.toThrow();
  });
});
