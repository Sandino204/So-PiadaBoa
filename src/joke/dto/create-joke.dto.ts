import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateJokeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsUUID(4, { message: 'User id is not valid' })
  userId: string;
}
