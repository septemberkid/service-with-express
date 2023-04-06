import { provide } from 'inversify-binding-decorators';
import TYPES from '@enums/types.enum';
import MasterStudentEntity from '@entity/master/master-student.entity';
import { inject } from 'inversify';
import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';
import HttpException from '@exception/http.exception';
import { Response } from 'express';
import MinioService from '@service/minio/minio.service';
import { RequestUserInterface } from '@interface/request-user.interface';
import SourceAdapter from '@service/minio/source.adapter';
import { BucketItem, BucketItemStat, UploadedObjectInfo } from 'minio';
import { DOCUMENT_ENUM } from '@enums/document.enum';
import ValidationException from '@exception/validation.exception';
import VALIDATION from '@enums/validation.enum';
import MinioHelper from '@service/minio/minio.helper';
import AppUserEntity from '@entity/app/app-user.entity';

const path = 'submission'
@provide(TYPES.SUBMISSION_SERVICE)
export default class SubmissionService {
  @inject<MinioService>(TYPES.MINIO_SERVICE)
  private minioService: MinioService;
  @inject(TYPES.ENTITY_MANAGER)
  private readonly em: SqlEntityManager<PostgreSqlDriver>;
  private async getStudentByEmail(email: string): Promise<MasterStudentEntity> {
    return this.em.findOne(MasterStudentEntity, {
      email
    })
  }
  private async validateUser(xid: string, res: Response): Promise<AppUserEntity> {
    const user = await this.em.findOne(AppUserEntity, {
      xid
    });
    if (!user)
      throw new HttpException(400, res.__('user.not_found'));
    return user;
  }
  private async validateStudent(xid: string, res: Response): Promise<MasterStudentEntity> {
    const user = await this.validateUser(xid, res);
    const student = await this.getStudentByEmail(user.email);
    if (!student) throw new HttpException(400, res.__('submission.student_not_found'));
    return student;
  }
  private getStudentDocumentsPath(nim: string): string {
    return `${path}/${nim}`
  }
  private getStudentSubmissionPath(nim: string, filename: string): string {
    return `${path}/${nim}/${filename}`;
  }
  public async getDocuments(req: RequestUserInterface, res: Response): Promise<BucketItem[]> {
    const student: MasterStudentEntity = await this.validateStudent(req.user.xid, res)
    const path = this.getStudentDocumentsPath(student.nim)
    return this.minioService.listObject(path)
  }
  public async getDocument(req: RequestUserInterface, filename: string, res: Response): Promise<string> {
    const student: MasterStudentEntity = await this.validateStudent(req.user.xid, res)
    const path = this.getStudentSubmissionPath(student.nim, filename)
    return this.minioService.temporaryUrl(path)
  }
  public async getDocumentInfo(req: RequestUserInterface, filename: string, res: Response): Promise<BucketItemStat> {
    const student: MasterStudentEntity = await this.validateStudent(req.user.xid, res)
    const path = this.getStudentSubmissionPath(student.nim, filename)
    return this.minioService.getStateObject(path)
  }
  public async uploadDocument(req: RequestUserInterface, res: Response, file: Express.Multer.File, document: DOCUMENT_ENUM): Promise<UploadedObjectInfo> {
    if (file == null)
      throw ValidationException.newError('file', VALIDATION.REQUIRED_FILE, res.__('validation.file_required'))
    const source: SourceAdapter = MinioHelper.convertSource(file);
    if (!MinioHelper.isValidExtension(source, 'pdf'))
      throw ValidationException.newError('file', VALIDATION.INVALID_EXTENSION, res.__('validation.file_invalid_extension'))
    const newFilename = document.toLowerCase() + '.' + source.extension();
    const student: MasterStudentEntity = await this.validateStudent(req.user.xid, res)
    const user: AppUserEntity = await this.validateUser(req.user.xid, res);
    const objectName = this.getStudentSubmissionPath(student.nim, newFilename);
    return this.minioService.write(source, objectName, `student-${document}`, user.id)
  }
}