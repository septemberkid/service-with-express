import RegisterRequestDto from '@dto/auth/register-request.dto';
import LoginRequestDto from '@dto/auth/login-request.dto';
import HttpException from '@exception/http.exception';
import { Request, Response } from 'express';
import TYPES from '@enums/types.enum';
import { EntityRepository, PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';
import AppUserEntity from '@entity/app/app-user.entity';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import MasterFacultyEntity from '@entity/master/master-faculty.entity';
import MasterProgramStudyEntity from '@entity/master/master-program-study.entity';
import { generateUUID, getClientName } from '@util/helpers';
import USER_STATUS from '@enums/user-status.enum';
import AuthResponseDto from '@dto/auth/auth-response.dto';
import AppUserRoleEntity from '@entity/app/app-user-role.entity';
import ROLE from '@enums/role.enum';
import { Logger } from '@util/logger';
import MasterStudentEntity from '@entity/master/master-student.entity';
import Encryptor from '@util/encryptor';
import USER_TYPE, { USER_TYPE_ENUM } from '@enums/user-type.enum';
import MasterLectureEntity from '@entity/master/master-lecture.entity';
import { nowAsTimestamp } from '@util/date-time';

@provide(TYPES.AUTH_SERVICE)
export default class AuthService {
  constructor(
    @inject(TYPES.LOGGER)
    private readonly logger: Logger,
    @inject(TYPES.ENTITY_MANAGER)
    private readonly em: SqlEntityManager<PostgreSqlDriver>,
    @inject('AppUserEntityRepository')
    private readonly appUserRepo: EntityRepository<AppUserEntity>,
    @inject('AppUserRoleEntityRepository')
    private readonly appUserRoleRepo: EntityRepository<AppUserRoleEntity>,
    @inject('MasterStudentEntityRepository')
    private readonly studentRepo: EntityRepository<MasterStudentEntity>,
    @inject('MasterLectureEntityRepository')
    private readonly lectureRepo: EntityRepository<MasterLectureEntity>,
    @inject('MasterFacultyEntityRepository')
    private readonly facultyRepo: EntityRepository<MasterFacultyEntity>,
    @inject('MasterProgramStudyEntityRepository')
    private readonly programStudyRepo: EntityRepository<MasterProgramStudyEntity>
  ) {
  }

  
  public async login(loginRequestDto: LoginRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
    // check account
    const { email, password } = loginRequestDto;
    const user = await this.appUserRepo.findOne({
      email,
    });
    if (!user) throw new HttpException(401, res.__('user.invalid_email_or_password'));
    // check if user is active
    if (user.status === USER_STATUS.INACTIVE)
      throw new HttpException(401, res.__('user.user_inactive'));
    // check password
    const plainPassword = Encryptor.base64Decode(password);
    const isMatch = await Encryptor.compareBcrypt(plainPassword, user.password);
    if (!isMatch) throw new HttpException(401, res.__('user.invalid_email_or_password'));
    // get data student or lecture
    let person: MasterStudentEntity | MasterLectureEntity;
    if (user.user_type == USER_TYPE.STUDENT) {
      person = await this.studentRepo.findOne({
        email: user.email
      });
    } else {
      person = await this.lectureRepo.findOne({
        email: user.email
      });
    }
    if (person == null) throw new HttpException(401, res.__('user.invalid_type_of_user'));
    const fullName = person.name;
    // get roles
    const roles = await this.appUserRoleRepo.find({
      user_id: user.id
    });
    const rolesAsArray = roles.map((role) => role.role_code);

    // generate token
    const client = getClientName(req);
    const token = await Encryptor.generateJWT({
      xid: user.xid,
      full_name: fullName,
      user_type: user.user_type,
      roles: rolesAsArray
    }, client);
    // update last login
    user.last_logged_in_at = nowAsTimestamp();
    await this.appUserRepo.persistAndFlush(user);

    return new AuthResponseDto({
      token: token,
      user: user,
      roles: rolesAsArray
    });
  }

  public async register(registerRequestDto: RegisterRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
    // check if email not yet registered
    const registeredUser = await this.appUserRepo.findOne({ email: registerRequestDto.email });
    if (registeredUser) throw new HttpException(400, res.__('user.duplicate_email'));

    // check if faculty is valid
    const faculty = await this.facultyRepo.findOne({
      xid: registerRequestDto.faculty_xid
    });
    if (!faculty) throw new HttpException(400, 'The selected faculty is invalid.');

    // check if program study is valid
    const programStudy = await this.programStudyRepo.findOne({
      xid: registerRequestDto.study_program_xid,
      faculty_id: faculty.id
    });
    if (!programStudy) throw new HttpException(400, 'The selected program study is invalid');

    await this.em.begin();
    try {
      // create account
      const { email, password } = registerRequestDto;
      const plainPassword = Encryptor.base64Decode(password);
      const hashPassword = await Encryptor.hashBcrypt(plainPassword);
      const user = this.appUserRepo.create({
        email,
        password: hashPassword,
        xid: generateUUID(email),
        status: USER_STATUS.ACTIVE,
        version: 1,
        user_type: USER_TYPE.STUDENT
      });
      await this.appUserRepo.persistAndFlush(user);

      // assign role
      const role = this.appUserRoleRepo.create({
        user_id: user.id,
        role_code: ROLE.STUDENT
      });
      await this.appUserRoleRepo.persistAndFlush(role);

      // insert into student table
      const student = this.studentRepo.create({
        xid: generateUUID(registerRequestDto.nim),
        nim: registerRequestDto.nim,
        name: registerRequestDto.full_name,
        email: user.email,
        faculty_id: faculty.id,
        program_study_id: programStudy.id,
        version: 1
      });
      await this.studentRepo.persistAndFlush(student);

      const client = getClientName(req);
      const token = await Encryptor.generateJWT({
        xid: user.xid,
        full_name: registerRequestDto.full_name,
        user_type: USER_TYPE_ENUM.STUDENT,
        roles: [
          role.role_code
        ]
      }, client);
      await this.em.commit();
      return new AuthResponseDto({
        token: token,
        user,
        roles: [role.role_code]
      });
    } catch (e) {
      await this.em.rollback();
      this.logger.log(e, 'error');
      throw new HttpException(500, res.__('error.general'));
    }
  }
}