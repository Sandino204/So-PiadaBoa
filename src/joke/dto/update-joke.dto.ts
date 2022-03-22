import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateJokeDto {
  @IsUUID(4, { message: 'invalid Id' })
  @IsNotEmpty({ message: 'Id invalid' })
  jokeId: string;

  @IsOptional()
  @IsString({ message: 'Title invalid' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description Invalid' })
  description: string;

  @IsUUID(4)
  userId: string;
}
