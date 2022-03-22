import { IsOptional, IsUUID } from 'class-validator';

export class GetJokeDto {
  @IsUUID(4, { message: 'Joke id not valid' })
  jokeId: string;

  @IsOptional()
  @IsUUID(4)
  userId?: string;
}
