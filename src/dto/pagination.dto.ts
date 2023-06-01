import {IsNumber, IsOptional, IsString} from 'class-validator';
import {Transform} from 'class-transformer';

export default class PaginationDto {
    @IsOptional()
    @IsString()
    order?: string;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => value ? parseInt(value) : 0)
    offset?: number = 0;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => value ? parseInt(value) : 20)
    limit?: number = 20;
}