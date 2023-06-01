import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {Transform} from 'class-transformer';

export default class SubmissionGradeDataRequestDto {
    @IsNotEmpty()
    @Transform(({value}) => value ? parseInt(value) : null)
    id: number;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseFloat(value))
    ipk = 0.0;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    sks= 0;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseFloat(value))
    rpl= 0.0;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseFloat(value))
    jarkom= 0.0;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseFloat(value))
    sistem_operasi= 0.0;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseFloat(value))
    basis_data= 0.0;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseFloat(value))
    web= 0.0;

    @IsOptional()
    @IsString()
    learning_achievement = '';
}