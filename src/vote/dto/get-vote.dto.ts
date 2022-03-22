import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetVoteDto {
  @IsNotEmpty()
  @IsUUID()
  jokeId: string;

  @IsNotEmpty()
  @IsUUID(4, { message: 'User id is not valid' })
  userId: string;
}
