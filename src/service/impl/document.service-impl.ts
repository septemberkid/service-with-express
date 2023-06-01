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
        const objectName = this.getSubmissionPath(periodId, user.additional_info.identifier_id, newFilename);
        return this.minioService.write(source, objectName, `student-${document}`, user.id)
    }

    private getPath(periodId: number, nim: string) {
        return `${path}/${periodId}/${nim}`;
    }
    private getSubmissionPath(periodId: number, nim: string, filename: string) {
        return `${this.getPath(periodId, nim)}/${filename}`;
    }

    async getFiles(periodId: number, nim: string): Promise<IDocument[]> {
        const result: IDocument[] = [];
        const files =  await this.minioService.listObjectWithTags(this.getPath(periodId, nim));
        for (const file of files) {
            const contextTag = file.tags.find(value => value.Key === 'context')
            if (contextTag) {
                result.push({
                    name: file.name,
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