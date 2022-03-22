import { IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { VoteTypes } from '../vote-type.enum';

export class PutVoteDto {
  @IsNotEmpty()
  @IsUUID()
  jokeId: string;

  @IsNotEmpty()
  @IsUUID(4, { message: 'User id is not valid' })
  userId: string;

  @IsNotEmpty()
  @IsEnum(VoteTypes)
  type: VoteTypes;
}
