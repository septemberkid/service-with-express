import BaseController from '@controller/base.controller';
import { controller, httpGet, httpPost, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Response } from 'express';
import multer from 'multer';
import { DOCUMENT_ENUM } from '@enums/document.enum';
import TYPES from '@enums/types.enum';
import useAuthMiddleware from '@middleware/auth.middleware';
import { useRoles } from '@middleware/role.middleware';
import { ROLE_ENUM } from '@enums/role.enum';
import { RequestUserInterface } from '@interface/request-user.interface';
import { Req, Res } from 'routing-controllers';
import SubmissionService from '@service/submission.service';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1Mb
});

@controller('/submission', useAuthMiddleware, useRoles(ROLE_ENUM.STUDENT))
export default class SubmissionController extends BaseController {
  @inject<SubmissionService>(TYPES.SUBMISSION_SERVICE)
  private submissionService: SubmissionService  ;
  @httpGet('/documents')
  async getDocuments(@Req() req: RequestUserInterface, @Res() res: Response) {
    const result = await this.submissionService.getDocuments(req, res);
    return this.success(result);
  }
  @httpPost('/upload/frs', upload.single('file'))
  async uploadFrs(@Req() req: RequestUserInterface, @Res() res: Response) {
    const result = await this.submissionService.uploadDocument(req, res, req.file, DOCUMENT_ENUM.FRS);
    return this.success(result);
  }
  @httpPost('/upload/payment-history', upload.single('file'))
  async uploadPaymentHistory(@Req() req: RequestUserInterface, @Res() res: Response) {
    const result = await this.submissionService.uploadDocument(req, res, req.file, DOCUMENT_ENUM.PAYMENT_HISTORY);
    return this.success(result);
  }
  @httpPost('/upload/transcript', upload.single('file'))
  async uploadTranscript(@Req() req: RequestUserInterface, @Res() res: Response) {
    const result = await this.submissionService.uploadDocument(req, res, req.file, DOCUMENT_ENUM.TRANSCRIPT);
    return this.success(result);
  }
  @httpGet('/document/:filename')
  async getDocument(@requestParam('filename') filename: string, @Req() req: RequestUserInterface, @Res() res: Response) {
    const result = await this.submissionService.getDocument(req, filename, res);
    return this.success(result);
  }
  @httpGet('/document-info/:filename')
  async getDocumentInfo(@requestParam('filename') filename: string, @Req() req: RequestUserInterface, @Res() res: Response) {
    const result = await this.submissionService.getDocumentInfo(req, filename, res);
    return this.success(result);
  }
}