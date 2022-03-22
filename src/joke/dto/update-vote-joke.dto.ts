import { IsNotEmpty, IsNumber, IsUUID, IsEnum } from 'class-validator';
import { VoteTypes } from '../../vote/vote-type.enum';

export class UpdateVoteJokeDto {
  @IsUUID(4, { message: 'Invalid Joke Id' })
  @IsNotEmpty({ message: 'Joke id cannot be empty' })
  jokeId: string;

  @IsEnum(VoteTypes, { message: 'invalid vote' })
  @IsNotEmpty({ message: 'Invalid vote' })
  voteType: VoteTypes;

  @IsUUID(4, { message: 'Invalid user Id' })
  @IsNotEmpty({ message: 'user id cannot be empty' })
  userId: string;
}
