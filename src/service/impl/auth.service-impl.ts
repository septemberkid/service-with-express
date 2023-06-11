import AuthService from '@service/auth.service';
import {provide} from 'inversify-binding-decorators';
import TYPES from '@enums/types.enum';
import {Request, Response} from 'express';
import LoginRequestDto from '@dto/auth/login-request.dto';
import AppUserEntity from '@entity/app/app-user.entity';
import RegisterRequestDto from '@dto/auth/register-request.dto';
import {inject} from 'inversify';
import {PostgreSqlDriver, SqlEntityManager} from '@mikro-orm/postgresql';
import HttpException from '@exception/http.exception';
import Encryptor from '@util/encryptor';
import USER_STATUS from '@enums/user-status.enum';
import RelUserRoleEntity from '@entity/rel/rel-user-role.entity';
import USER_TYPE from '@enums/user-type.enum';
import MstLectureEntity from '@entity/master/mst-lecture.entity';
import {IAdditionalInfo} from '@interface/jwt-payload.interface';
import MstStudentEntity from '@entity/master/mst-student.entity';
import {generateUUID, getClientName} from '@util/helpers';
import AppRefreshTokenEntity from '@entity/app/app-refresh-token.entity';
import {generateRefreshTokenExpired, isExpired, nowAsTimestamp} from '@util/date-time';
import AuthResponseDto from '@dto/auth/auth-response.dto';
import RefreshTokenRequestDto from '@dto/auth/refresh-token-request.dto';
import {Logger} from '@util/logger';
import MstFacultyEntity from '@entity/master/mst-faculty.entity';
import MstStudyProgramEntity from '@entity/master/mst-study-program.entity';
import {ROLE_ENUM} from '@enums/role.enum';

@provide(TYPES.AUTH_SERVICE)
export default class AuthServiceImpl implements AuthService {
    @inject<SqlEntityManager<PostgreSqlDriver>>(TYPES.ENTITY_MANAGER)
    private readonly em: SqlEntityManager<PostgreSqlDriver>
    
    @inject<Logger>(TYPES.LOGGER)
    private readonly logger: Logger
    async authorize(dto: LoginRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
        const {email, password} = dto;
        const user = await this.getUserByEmail(email, res);
        await this.validatePassword(user, password, res);
        this.validateActiveUser(user, res);
        const roles = await this.getRoles(user.id)
        const additionalInfo = await this.getAdditionalInfo(user.user_type, email);
        const clientName = getClientName(req);
        const token = await Encryptor.generateJWT({
            payload: {
                id: user.id,
                name: user.name,
                email: user.email,
                user_type: user.user_type,
                additional_info: additionalInfo,
                roles
            },
            audience: clientName
        })
        const {refresh_token, refresh_token_lifetime} = await this.generateRefreshToken(user.id);
        user.last_logged_in_at = nowAsTimestamp();
        await this.em.persistAndFlush(user);
        return new AuthResponseDto({
            token,
            refresh_token,
            refresh_token_lifetime
        })
    }

    async getUserByEmail(email: string, res: Response): Promise<AppUserEntity> {
        const user = await this.em.findOne(AppUserEntity, {
            email
        })
        if (!user)
            throw new HttpException(401, res.__('user.invalid_email_or_password'))
        return user;
    }

    async getUserById(userId: number, res: Response): Promise<AppUserEntity> {
        const user = await this.em.findOne(AppUserEntity, {
            id: userId
        })
        if (!user)
            throw new HttpException(401, res.__('user.invalid_email_or_password'));
        return user;
    }

    async register(dto: RegisterRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
        const {email, nim,full_name, faculty_id, study_program_id, password} = dto;
        await this.suspectDuplicateEmail(email, res);
        const faculty: MstFacultyEntity = await this.getFaculty(faculty_id);
        if (!faculty)
            throw new HttpException(400, 'The selected faculty is invalid.');
        const studyProgram: MstStudyProgramEntity = await this.getProgramStudy(faculty.id, study_program_id);
        await this.em.begin();
        try {
            const hashPassword: string = await Encryptor.hashBcrypt(password);
            const user: AppUserEntity = await this.createNewUser(full_name, email, hashPassword);
            await this.assignRole(user.id, ROLE_ENUM.STUDENT);
            const student = await this.assignToStudent(nim, full_name, email, study_program_id);
            const additionalInfo: IAdditionalInfo = {
                id: student.id,
                identifier_id: student.nim,
                faculty: {
                    id: faculty.id,
                    name: faculty.name
                },
                study_program: {
                    id: studyProgram.id,
                    name: studyProgram.name,
                }
            }
            const client = getClientName(req);
            const token = await Encryptor.generateJWT({
                payload: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    user_type: user.user_type,
                    additional_info: additionalInfo,
                    roles: [
                        ROLE_ENUM.STUDENT
                    ]
                },
                audience: client
            });
            const {refresh_token, refresh_token_lifetime} = await this.generateRefreshToken(user.id);
            await this.em.commit();
            return new AuthResponseDto({
                token: token,
                refresh_token,
                refresh_token_lifetime
            });
        } catch (e) {
            await this.em.rollback();
            this.logger.log(e, 'error');
            throw new HttpException(500, res.__('error.general'));
        }
    }

    validateActiveUser(user: AppUserEntity, res: Response) {
        if (user.status === USER_STATUS.INACTIVE)
            throw new HttpException(401, res.__('user.user_inactive'));
        return user;
    }

    async validatePassword(user: AppUserEntity, password: string, res: Response) {
        const isMatch = await Encryptor.compareBcrypt(password, user.password);
        if (!isMatch) throw new HttpException(401, res.__('user.invalid_email_or_password'));
    }

    async getRoles(userId: number): Promise<string[]> {
        const roles = await this.em.find(RelUserRoleEntity,{
            user_id: userId
        });
        return roles.map((role) => role.role_code);
    }

    private async getAdditionalInfo(userType: string, email: string): Promise<IAdditionalInfo> {
        if (userType == USER_TYPE.LECTURE) {
            return await this.getLectureAdditionalInfo(email);
        }
        return await this.getStudentAdditionalInfo(email);
    }

    private async getLectureAdditionalInfo(email: string): Promise<IAdditionalInfo> {
        const lecture = await this.em.findOne(MstLectureEntity, {
            email
        }, {
            populate: [
                'studyProgram',
                'studyProgram.faculty',
            ],
        })
        if (!lecture)
            throw new HttpException(404, 'Lecture not found.')
        const prodi = lecture.studyProgram.getEntity();
        const faculty = prodi.faculty.getEntity();
        return {
            id: lecture.id,
            identifier_id: lecture.nip,
            faculty: {
                id: faculty.id,
                name: faculty.name
            },
            study_program: {
                id: prodi.id,
                name: prodi.name
            }
        }
    }

    private async getStudentAdditionalInfo(email: string): Promise<IAdditionalInfo> {
        const student = await this.em.findOne(MstStudentEntity, {
            email
        }, {
            populate: [
                'studyProgram',
                'studyProgram.faculty',
            ],
        })
        if (!student)
            throw new HttpException(404, 'Student not found.')
        const prodi = student.studyProgram.getEntity();
        const faculty = prodi.faculty.getEntity();
        return {
            id: student.id,
            identifier_id: student.nim,
            faculty: {
                id: faculty.id,
                name: faculty.name
            },
            study_program: {
                id: prodi.id,
                name: prodi.name
            }
        }
    }

    private async generateRefreshToken(userId: number) {
        const refreshTokens = await this.em.find(AppRefreshTokenEntity, {
            user_id: userId
        })
        await this.em.remove(refreshTokens);
        const randToken = generateUUID(userId + nowAsTimestamp());
        const {text, seconds} = generateRefreshTokenExpired();
        const refreshToken: AppRefreshTokenEntity = this.em.create(AppRefreshTokenEntity, {
            id: randToken,
            user_id: userId,
            expired_at: text
        });
        await this.em.persistAndFlush(refreshToken);
        return {
            refresh_token: randToken,
            refresh_token_lifetime: seconds
        };
    }

    async refreshToken(dto: RefreshTokenRequestDto, req: Request, res: Response): Promise<AuthResponseDto> {
        await this.em.begin();
        try {
            const userId: number = await this.validateRefreshToken(dto.refresh_token, res);
            const {refresh_token, refresh_token_lifetime} = await this.generateRefreshToken(userId);
            const user: AppUserEntity = await this.getUserById(userId, res);
            this.validateActiveUser(user, res)
            const additionalInfo = await this.getAdditionalInfo(user.user_type, user.email);
            const roles: string[] = await this.getRoles(userId);
            const clientName = getClientName(req);
            const token: string = await Encryptor.generateJWT({
                payload: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    user_type: user.user_type,
                    additional_info: additionalInfo,
                    roles
                },
                audience: clientName
            });
            await this.em.commit();
            return new AuthResponseDto({
                token: token,
                refresh_token,
                refresh_token_lifetime
            })
        } catch (e) {
            this.logger.log(e, 'error');
            await this.em.rollback();
            throw new HttpException(500, res.__('error.general'));
        }
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

    private async suspectDuplicateEmail(email: string, res: Response) {
        const user = await this.em.findOne(AppUserEntity, {
            email
        })
        if (user)
            throw new HttpException(400, res.__('user.duplicate_email'));
    }

    private async getFaculty(facultyId: number): Promise<MstFacultyEntity> {
        return await this.em.findOne(MstFacultyEntity, {
            id: facultyId,
            is_active: true
        })
    }

    private async getProgramStudy(facultyId: number, studyProgramId): Promise<MstStudyProgramEntity> {
        return await this.em.findOne(MstStudyProgramEntity, {
            faculty_id: facultyId,
            id: studyProgramId,
            is_active: true
        })
    }

    private async createNewUser(full_name: string, email: string, hashPassword: string): Promise<AppUserEntity> {
        const user = this.em.create(AppUserEntity, {
            email,
            name: full_name,
            password: hashPassword,
            status: USER_STATUS.ACTIVE,
            user_type: USER_TYPE.STUDENT
        });
        await this.em.persistAndFlush(user);
        return user;
    }

    private async assignRole(userId: number, ...roles: ROLE_ENUM[]) {
        for (const r of roles) {
            const role: RelUserRoleEntity = this.em.create(RelUserRoleEntity, {
                user_id: userId,
                role_code: r,
            });
            await this.em.persistAndFlush(role);
        }
    }

    private async assignToStudent(nim: string, fullName: string, email: string, studyProgramId: number): Promise<MstStudentEntity> {
        const alreadyExistByEmail: MstStudentEntity = await this.em.findOne(MstStudentEntity, {
            email
        });
        if (alreadyExistByEmail)
            await this.em.remove(alreadyExistByEmail);

        const student: MstStudentEntity = this.em.create(MstStudentEntity,{
            nim,
            name: fullName,
            email,
            study_program_id: studyProgramId,
        });
        await this.em.persistAndFlush(student);
        return student;
    }
}