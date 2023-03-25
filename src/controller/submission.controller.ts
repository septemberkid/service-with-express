import BaseController from '@controller/base.controller';
import { controller, httpGet, httpPost, request, requestParam } from 'inversify-express-utils';
import MinioService from '@service/minio.service';
import { inject } from 'inversify';
import { Request } from 'express';
import multer from 'multer';
import { isValidExtension } from '@util/validation';
import ValidationException from '@exception/validation.exception';
import VALIDATION from '@enums/validation.enum';
import { DOCUMENT_ENUM } from '@enums/document.enum';
import { getExtension } from '@util/helpers';
import { UploadedObjectInfo } from 'minio';
import TYPES from '@enums/types.enum';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1Mb
});

@controller('/submission')export default class SubmissionController extends BaseController {
  @inject<MinioService>(TYPES.MINIO_SERVICE)
  private minioService: MinioService;
  
  @httpGet('/documents')
  async getDocuments() {
    try {
      const res = await this.minioService.readDocumentsByNIM('40621210004');
      return this.success(res);
    } catch (e) {
      return this.fail((e as Error).message);
    }
  }

  @httpPost('/upload/frs', upload.single('file'))
  async uploadFrs(@request() req: Request) {
    try {
      const uploadedFile = await this.uploadDocument('40621210004', DOCUMENT_ENUM.FRS, req.file);
      console.log(uploadedFile)
    } catch (e) {
      console.log(e)
    }
  }

  @httpPost('/upload/payment-history', upload.single('file'))
  async uploadPaymentHistory(@request() req: Request) {
    await this.uploadDocument('40621210004', DOCUMENT_ENUM.PAYMENT_HISTORY, req.file);
  }

  @httpPost('/upload/transcript', upload.single('file'))
  async uploadTranscript(@request() req: Request) {
    await this.uploadDocument('40621210004', DOCUMENT_ENUM.TRANSCRIPT, req.file);
  }

  private async uploadDocument(nim: string, document: DOCUMENT_ENUM, file: Express.Multer.File) : Promise<UploadedObjectInfo> {
    if (!isValidExtension(file.originalname, 'pdf')) {
      throw ValidationException.newError('file', VALIDATION.INVALID_EXTENSION, 'The file extension is invalid.')
    }
    const newFilename = document.toLowerCase() + '.' + getExtension(file.originalname);
    const objectName = this.minioService.getPrefix('submission', nim, newFilename)
    return await this.minioService.saveObject(objectName, file)
  }

  @httpGet('/document/:filename')
  async getDocument(@requestParam('filename') filename: string) {
    try {
      const object = this.minioService.getPrefix('submission','40621210004', filename);
      const res = await this.minioService.getPreSignedUrl(object);
      return this.success(res);
    } catch (e) {
      return this.fail((e as Error).message);
    }
  }
}