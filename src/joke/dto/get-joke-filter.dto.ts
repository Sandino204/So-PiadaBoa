import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Sort } from '../jokes-sort.enum';

export class GetJokeFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Sort)
  sort: Sort;
}
