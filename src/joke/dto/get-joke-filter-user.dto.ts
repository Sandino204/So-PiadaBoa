import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Sort } from '../jokes-sort.enum';

export class GetJokeByUserFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Sort)
  sort: Sort;

  @IsUUID(4, { message: 'userId invalid' })
  userId;
}
