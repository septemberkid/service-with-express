import {DOCUMENT_ENUM} from '@enums/document.enum';
import {UploadedObjectInfo} from 'minio';
import {IUserPayload} from '@interface/request-user.interface';
import {Response} from 'express';
import {IDocument} from '@interface/submission-detail.interface';

export default interface DocumentService {
    upload(periodId: number, submissionId: number, file: Express.Multer.File, document: DOCUMENT_ENUM, user: IUserPayload, res: Response): Promise<UploadedObjectInfo>
    uploadRecommendation(periodId: number, submissionId: number, file: Express.Multer.File, nim: string, user: IUserPayload, res: Response): Promise<UploadedObjectInfo>
    getFiles(periodId: number, submissionId: number, nim: string): Promise<IDocument[]>
}