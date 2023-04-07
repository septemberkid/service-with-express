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
import MasterStudyProgramEntity from '@entity/master/master-study-program.entity';
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
import { StudentInfoInterface } from '@interface/jwt-payload.interface';

@provide(TYPES.AUTH_SERVICE)
export default class AuthService {
  @inject(TYPES.LOGGER)
  private readonly logger: Logger;

  @inject(TYPES.ENTITY_MANAGER)
  private readonly em: SqlEntityManager<PostgreSqlDriver>;

  public async authorize(loginRequestDto: LoginRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
    const { email, password } = loginRequestDto;
    const user: AppUserEntity = await this.getUserByEmail(email, res);
    await this.verifyPassword(password, user.password, res);
    await this.checkActiveUser(user, res);
    // get roles
    const roles: string[] = await this.getRolesByUserId(user.id);
    const studentInfo = await this.getStudentInfo(user.user_type, email, res);
    // generate token
    const client = getClientName(req);
    const token = await Encryptor.generateJWT({
      xid: user.xid,
      full_name: user.name,
      user_type: user.user_type,
      student_info: studentInfo,
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
      const user: AppUserEntity = await this.getUserByUserId(userId, res);
      await this.checkActiveUser(user, res)
      const studentInfo = await this.getStudentInfo(user.user_type, user.email, res);
      const roles: string[] = await this.getRolesByUserId(userId);
      const client = getClientName(req);
      const token: string = await Encryptor.generateJWT({
        xid: user.xid,
        user_type: user.user_type,
        full_name: user.name,
        student_info: studentInfo,
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
    await this.suspectDuplicateEmail(registerRequestDto.email, res);
    // check if faculty is valid
    const faculty: MasterFacultyEntity = await this.getFaculty(registerRequestDto.faculty_xid);
    if (!faculty) throw new HttpException(400, 'The selected faculty is invalid.');

    // check if program study is valid
    const studyProgram: MasterStudyProgramEntity = await this.getProgramStudy(faculty.id, registerRequestDto.study_program_xid);
    if (!studyProgram) throw new HttpException(400, 'The selected program study is invalid');

    await this.em.begin();
    try {
      // create account
      const { email, password, nim, full_name } = registerRequestDto;
      const hashPassword: string = await this.generatePassword(password);
      const user: AppUserEntity = await this.createUser(email,full_name, hashPassword);
      // assign role
      await this.assignRole(user.id, faculty.id, studyProgram.id, ROLE_ENUM.STUDENT);
      // insert into student table
      const student = await this.assignToStudent(nim, full_name, email,faculty.id, studyProgram.id);
      const studentInfo: StudentInfoInterface = {
        xid: student.xid,
        name: student.name,
        nim: student.nim,
        faculty: {
          xid: faculty.xid,
          name: faculty.name
        },
        study_program: {
          xid: studyProgram.xid,
          name: studyProgram.name,
        }
      }
      const client = getClientName(req);
      const token = await Encryptor.generateJWT({
        xid: user.xid,
        full_name,
        user_type: user.user_type,
        student_info: studentInfo,
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
  private async checkActiveUser(user: AppUserEntity, res: Response): Promise<AppUserEntity> {
    // check if user is active
    if (user.status === USER_STATUS.INACTIVE)
      throw new HttpException(401, res.__('user.user_inactive'));
    return user;
  }
  private async generatePassword(md5Password: string): Promise<string> {
    return await Encryptor.hashBcrypt(md5Password);
  }
  private async verifyPassword(md5Password: string, hashPassword: string, res: Response): Promise<void> {
    const isMatch = await Encryptor.compareBcrypt(md5Password, hashPassword);
    if (!isMatch) throw new HttpException(401, res.__('user.invalid_email_or_password'));
  }
  private async getRolesByUserId(userId: number): Promise<string[]> {
    const roles = await this.em.find(AppUserRoleEntity,{
      user_id: userId
    });
    return roles.map((role) => role.role_code);
  }
  private async suspectDuplicateEmail(email: string, res: Response) {
    const user = await this.em.findOne(AppUserEntity, {
      email
    })
    if (user) throw new HttpException(400, res.__('user.duplicate_email'));
  }
  private async getUserByEmail(email: string, res: Response): Promise<AppUserEntity> {
    const user = await this.em.findOne(AppUserEntity, {
      email
    })
    if (!user) throw new HttpException(401, res.__('user.invalid_email_or_password'));
    return user;
  }
  private async getUserByUserId(userId: number, res: Response): Promise<AppUserEntity> {
    const user = await this.em.findOne(AppUserEntity, {
      id: userId
    })
    if (!user) throw new HttpException(401, res.__('user.invalid_email_or_password'));
    return user;
  }
  private async getFaculty(xid: string): Promise<MasterFacultyEntity> {
    return this.em.findOne(MasterFacultyEntity, {
      xid
    })
  }
  private async getProgramStudy(facultyId: number, programStudyXid: string): Promise<MasterStudyProgramEntity> {
    return this.em.findOne(MasterStudyProgramEntity, {
      faculty_id: facultyId,
      xid: programStudyXid
    })
  }
  private async createUser(email: string, name: string, password: string): Promise<AppUserEntity> {
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
  private async assignRole(userId: number, faculty_id: number, study_program_id: number, ...roles: ROLE_ENUM[]): Promise<void> {
    for (const r of roles) {
      const role: AppUserRoleEntity = this.em.create(AppUserRoleEntity, {
        user_id: userId,
        role_code: r,
        faculty_id,
        study_program_id
      });
      await this.em.persistAndFlush(role);
    }
  }
  private async assignToStudent(nim: string, fullName: string, email: string, facultyId: number, studyProgramId: number): Promise<MasterStudentEntity> {
    const alreadyExistByEmail: MasterStudentEntity = await this.em.findOne(MasterStudentEntity, {
      email
    });
    if (alreadyExistByEmail)
      await this.em.remove(alreadyExistByEmail);

    const student: MasterStudentEntity = this.em.create(MasterStudentEntity,{
      xid: generateUUID(nim),
      nim,
      name: fullName,
      email,
      faculty_id: facultyId,
      study_program_id: studyProgramId,
      version: 1
    });
    await this.em.persistAndFlush(student);
    return student;
  }
  private async generateRefreshToken(userId: number): Promise<string> {
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
  private async validateRefreshToken(refreshToken: string, res: Response): Promise<number> {
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
  private async getStudentInfo(userType: string, email: string, res: Response): Promise<StudentInfoInterface> {
    if (userType == USER_TYPE.LECTURE)
      return null;
    const student = await this.em.findOne(MasterStudentEntity, {
      email
    }, {
      populate: ['faculty', 'studyProgram']
    })
    if (!student)
      throw new HttpException(400, res.__('submission.student_not_found'))
    let faculty: {xid: string, name: string} = null;
    let studyProgram: {xid: string, name: string} = null;
    if (student.faculty.xid && student.faculty.name) {
      faculty = {
        xid: student.faculty.xid,
        name: student.faculty.name,
      }
    }
    if (student.studyProgram.xid && student.studyProgram.name) {
      studyProgram = {
        xid: student.studyProgram.xid,
        name: student.studyProgram.name,
      }
    }
    return {
      xid: student.xid,
      nim: student.nim,
      name: student.name,
      faculty,
      study_program: studyProgram,
    }
  }
}