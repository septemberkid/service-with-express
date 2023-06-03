import DocumentService from '@service/document.service';
import {provide} from 'inversify-binding-decorators';
import TYPES from '@enums/types.enum';
import {UploadedObjectInfo} from 'minio';
import {DOCUMENT_ENUM} from '@enums/document.enum';
import {IUserPayload} from '@interface/request-user.interface';
import {Response} from 'express';
import ValidationException from '@exception/validation.exception';
import VALIDATION from '@enums/validation.enum';
import SourceAdapter from '@service/minio/source.adapter';
import MinioHelper from '@service/minio/minio.helper';
import {inject} from 'inversify';
import MinioService from '@service/minio/minio.service';
import {IDocument} from '@interface/submission-detail.interface';

const path = 'submission'
@provide(TYPES.DOCUMENT_SERVICE)
export default class DocumentServiceImpl implements DocumentService {

    
    @inject<MinioService>(TYPES.MINIO_SERVICE)
    private minioService: MinioService
    
    async upload(
        periodId: number,
        submissionId: number,
        file: Express.Multer.File, 
        document: DOCUMENT_ENUM,
        user: IUserPayload, 
        res: Response
    ): Promise<UploadedObjectInfo> {
        if (file == null)
            throw ValidationException.newError('file', VALIDATION.REQUIRED_FILE, res.__('validation.file_required'));
        const source: SourceAdapter = MinioHelper.convertSource(file);
        if (!MinioHelper.isValidExtension(source, 'pdf'))
            throw ValidationException.newError('file', VALIDATION.INVALID_EXTENSION, res.__('validation.file_invalid_extension'))
        const newFilename = document.toLowerCase() + '.' + source.extension();
        const objectName = this.getSubmissionPath(periodId, submissionId, user.additional_info.identifier_id, newFilename);
        return this.minioService.write(source, objectName, `student-${document}`, user.id)
    }

    async uploadRecommendation(periodId: number, submissionId: number, file: Express.Multer.File, nim: string, user: IUserPayload, res: Response): Promise<UploadedObjectInfo> {
        if (file == null)
            throw ValidationException.newError('file', VALIDATION.REQUIRED_FILE, res.__('validation.file_required'));
        const source: SourceAdapter = MinioHelper.convertSource(file);
        if (!MinioHelper.isValidExtension(source, 'pdf'))
            throw ValidationException.newError('file', VALIDATION.INVALID_EXTENSION, res.__('validation.file_invalid_extension'))
        const newFilename = DOCUMENT_ENUM.RECOMMENDATION_LETTER.toLowerCase() + '.' + source.extension();
        const objectName = this.getSubmissionPath(periodId, submissionId, nim, newFilename);
        return this.minioService.write(source, objectName, `student-${DOCUMENT_ENUM.RECOMMENDATION_LETTER}`, user.id)
    }

    private getPath(periodId: number, submissionId: number, nim: string) {
        return `${path}/period-${periodId}/${nim}/submission-${submissionId}`;
    }
    private getSubmissionPath(periodId: number, submissionId: number, nim: string, filename: string) {
        return `${this.getPath(periodId, submissionId, nim)}/${filename}`;
    }

    async getFiles(periodId: number, submissionId: number, nim: string): Promise<IDocument[]> {
        const result: IDocument[] = [];
        const files =  await this.minioService.listObjectWithTags(this.getPath(periodId, submissionId, nim));
        for (const file of files) {
            const contextTag = file.tags.find(value => value.Key === 'context')
            if (contextTag) {
                const tempUrl = await this.minioService.temporaryUrl(file.path)
                result.push({
                    name: file.name,
                    url: tempUrl,
                    path: file.path,
                    context: contextTag.Value,
                    etag: file.etag,
                    size: file.size,
                })
            }
        }
        return result;
    }
    
}