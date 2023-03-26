import RegisterRequestDto from '@dto/auth/register-request.dto';
import LoginRequestDto from '@dto/auth/login-request.dto';
import HttpException from '@exception/http.exception';
import { Request, Response } from 'express';
import TYPES from '@enums/types.enum';
import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';
import AppUserEntity from '@entity/app/app-user.entity';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import MasterFacultyEntity from '@entity/master/master-faculty.entity';
import MasterProgramStudyEntity from '@entity/master/master-program-study.entity';
import { generateUUID, getClientName } from '@util/helpers';
import USER_STATUS from '@enums/user-status.enum';
import AuthResponseDto from '@dto/auth/auth-response.dto';
import AppUserRoleEntity from '@entity/app/app-user-role.entity';
import { ROLE_ENUM } from '@enums/role.enum';
import { Logger } from '@util/logger';
import MasterStudentEntity from '@entity/master/master-student.entity';
import Encryptor from '@util/encryptor';
import USER_TYPE from '@enums/user-type.enum';
import { generateRefreshToken, isExpired, nowAsTimestamp } from '@util/date-time';
import AppRefreshTokenEntity from '@entity/app/app-refresh-token.entity';
import RefreshTokenRequestDto from '@dto/auth/refresh-token-request.dto';

@provide(TYPES.AUTH_SERVICE)
export default class AuthService {
  @inject(TYPES.LOGGER)
  private readonly logger: Logger;

  @inject(TYPES.ENTITY_MANAGER)
  private readonly em: SqlEntityManager<PostgreSqlDriver>;

  public async authorize(loginRequestDto: LoginRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
    const { email, password } = loginRequestDto;
    const user: AppUserEntity = await this.validateUser(email, res);
    await this.verifyPassword(password, user.password, res);
    // get roles
    const roles: string[] = await this.getRolesByUserId(user.id);
    // generate token
    const client = getClientName(req);
    const token = await Encryptor.generateJWT({
      xid: user.xid,
      full_name: user.name,
      user_type: user.user_type,
      roles
    }, client);
    const refreshToken = await this.generateRefreshToken(user.id);
    // update last login
    user.last_logged_in_at = nowAsTimestamp();
    await this.em.persistAndFlush(user);
    return new AuthResponseDto({
      token: token,
      refresh_token: refreshToken
    });
  }
  public async refreshToken(dto: RefreshTokenRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
    await this.em.begin();
    try {
      const userId: number = await this.validateRefreshToken(dto.refresh_token, res);
      const refreshToken: string = await this.generateRefreshToken(userId);
      const user: AppUserEntity = await this.getUserByUserId(userId);
      // check if user is active
      if (user.status === USER_STATUS.INACTIVE)
        throw new HttpException(401, res.__('user.user_inactive'));
      const roles: string[] = await this.getRolesByUserId(userId);
      const client = getClientName(req);
      const token: string = await Encryptor.generateJWT({
        xid: user.xid,
        user_type: user.user_type,
        full_name: user.name,
        roles: roles
      }, client);
      await this.em.commit();
      return new AuthResponseDto({
        token: token,
        refresh_token: refreshToken
      })
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }
  public async register(registerRequestDto: RegisterRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
    // check if email not yet registered
    const registeredUser: AppUserEntity = await this.getUserByEmail(registerRequestDto.email);
    if (registeredUser) throw new HttpException(400, res.__('user.duplicate_email'));

    // check if faculty is valid
    const faculty: MasterFacultyEntity = await this.getFaculty(registerRequestDto.faculty_xid);
    if (!faculty) throw new HttpException(400, 'The selected faculty is invalid.');

    // check if program study is valid
    const programStudy: MasterProgramStudyEntity = await this.getProgramStudy(faculty.id, registerRequestDto.study_program_xid);
    if (!programStudy) throw new HttpException(400, 'The selected program study is invalid');

    await this.em.begin();
    try {
      // create account
      const { email, password, nim, full_name } = registerRequestDto;
      const hashPassword: string = await this.generatePassword(password);
      const user: AppUserEntity = await this.createUser(email,full_name, hashPassword);
      // assign role
      await this.assignRole(user.id,  ROLE_ENUM.STUDENT);
      // insert into student table
      await this.assignToStudent(nim,full_name,email,faculty.id,programStudy.id);
      const client = getClientName(req);
      const token = await Encryptor.generateJWT({
        xid: user.xid,
        full_name,
        user_type: user.user_type,
        roles: [
          ROLE_ENUM.STUDENT
        ]
      }, client);
      const refreshToken = await this.generateRefreshToken(user.id);
      await this.em.commit();
      return new AuthResponseDto({
        token: token,
        refresh_token: refreshToken
      });
    } catch (e) {
      await this.em.rollback();
      this.logger.log(e, 'error');
      throw new HttpException(500, res.__('error.general'));
    }
  }
  private validateUser = async (email: string, res: Response) : Promise<AppUserEntity> => {
    const user = await this.getUserByEmail(email);
    // check user
    if (!user) throw new HttpException(401, res.__('user.invalid_email_or_password'));
    // check if user is active
    if (user.status === USER_STATUS.INACTIVE)
      throw new HttpException(401, res.__('user.user_inactive'));
    return user;
  }
  private generatePassword = async (base64Password: string): Promise<string> => {
    const plainPassword = Encryptor.base64Decode(base64Password);
    return await Encryptor.hashBcrypt(plainPassword);
  }
  private verifyPassword = async (password: string, hashPassword: string, res: Response) : Promise<void> => {
    const plainPassword = Encryptor.base64Decode(password);
    const isMatch = await Encryptor.compareBcrypt(plainPassword, hashPassword);
    if (!isMatch) throw new HttpException(401, res.__('user.invalid_email_or_password'));
  }
  private getRolesByUserId = async (userId: number): Promise<string[]> => {
    const roles = await this.em.find(AppUserRoleEntity,{
      user_id: userId
    });
    return roles.map((role) => role.role_code);
  }
  private getUserByEmail = async (email: string): Promise<AppUserEntity> => {
    return this.em.findOne(AppUserEntity, {
      email
    })
  }
  private getUserByUserId = async (userId: number): Promise<AppUserEntity> => {
    return this.em.findOne(AppUserEntity, {
      id: userId
    })
  }
  private getFaculty = async (xid: string): Promise<MasterFacultyEntity> => {
    return this.em.findOne(MasterFacultyEntity, {
      xid
    })
  }
  private getProgramStudy = async (facultyId: number, programStudyXid: string): Promise<MasterProgramStudyEntity> => {
    return this.em.findOne(MasterProgramStudyEntity, {
      faculty_id: facultyId,
      xid: programStudyXid
    })
  }
  private createUser = async (email: string, name: string, password: string): Promise<AppUserEntity> => {
    const user = this.em.create(AppUserEntity, {
      email,
      name,
      password,
      xid: generateUUID(email),
      status: USER_STATUS.ACTIVE,
      version: 1,
      user_type: USER_TYPE.STUDENT
    });
    await this.em.persistAndFlush(user);
    return user;
  }
  private assignRole = async (userId: number, ...roles: ROLE_ENUM[]): Promise<void> => {
    for (const r of roles) {
      const role: AppUserRoleEntity = this.em.create(AppUserRoleEntity, {
        user_id: userId,
        role_code: r
      });
      await this.em.persistAndFlush(role);
    }
  }
  private assignToStudent = async (nim: string, fullName: string, email: string, facultyId: number, programStudyId: number): Promise<MasterStudentEntity> => {
    const student: MasterStudentEntity = this.em.create(MasterStudentEntity,{
      xid: generateUUID(nim),
      nim,
      name: fullName,
      email,
      faculty_id: facultyId,
      program_study_id: programStudyId,
      version: 1
    });
    await this.em.persistAndFlush(student);
    return student;
  }
  private generateRefreshToken = async (userId: number): Promise<string> => {
    // remove old refresh token by user id
    const refreshTokens = await this.em.find(AppRefreshTokenEntity, {
      user_id: userId
    })
    await this.em.remove(refreshTokens);
    // create new
    const randToken = generateUUID(userId + nowAsTimestamp());
    const refreshToken: AppRefreshTokenEntity = this.em.create(AppRefreshTokenEntity, {
      id: randToken,
      user_id: userId,
      expired_at: generateRefreshToken()
    });
    await this.em.persistAndFlush(refreshToken);
    return randToken;
  }
  private validateRefreshToken = async (refreshToken: string, res: Response): Promise<number> => {
    const ref: AppRefreshTokenEntity = await this.em.findOne(AppRefreshTokenEntity, {
      id: refreshToken
    });
    if (!ref) throw new HttpException(400, res.__('refresh_token.invalid'));
    if (isExpired(ref.expired_at)) {
      await this.em.removeAndFlush(ref);
      throw new HttpException(401, res.__('refresh_token.expired'));
    }
    return ref.user_id;
  }
}