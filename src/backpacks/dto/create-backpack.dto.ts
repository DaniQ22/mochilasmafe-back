import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBackpackDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(600)
  description?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    return Number(value);
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;
}
