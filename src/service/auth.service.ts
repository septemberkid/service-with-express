import RegisterRequestDto from '@dto/auth/register-request.dto';
import AppUserEntity from '@entity/app/app-user.entity';
import LoginRequestDto from '@dto/auth/login-request.dto';
import {Request, Response} from 'express';
import RefreshTokenRequestDto from '@dto/auth/refresh-token-request.dto';
import AuthResponseDto from '@dto/auth/auth-response.dto';

export default interface AuthService {
    authorize(dto: LoginRequestDto, req: Request, res: Response): Promise<AuthResponseDto>;
    register(dto: RegisterRequestDto, req: Request, res: Response): Promise<AuthResponseDto>;
    refreshToken(dto: RefreshTokenRequestDto,  req: Request, res: Response): Promise<AuthResponseDto>;
    getUserById(id: number, res: Response): Promise<AppUserEntity>;
    getUserByEmail(email: string, res: Response): Promise<AppUserEntity>;
    getRoles(userId: number): Promise<string[]>;
    validateActiveUser(user: AppUserEntity, res: Response);
    validatePassword(user: AppUserEntity, password: string, res: Response);
}