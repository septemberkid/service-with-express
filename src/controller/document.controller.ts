import BaseController from '@controller/base.controller';
import {controller, httpGet, httpPost} from 'inversify-express-utils';
import multer from 'multer';
import {Req, Res} from 'routing-controllers';
import {RequestUserInterface} from '@interface/request-user.interface';
import {useRoles} from '@middleware/role.middleware';
import {ROLE_ENUM} from '@enums/role.enum';
import {inject} from 'inversify';
import TYPES from '@enums/types.enum';
import DocumentServiceImpl from '@service/impl/document.service-impl';
import {Response} from 'express';
import useRequestMiddleware from '@middleware/request.middleware';
import UploadRequestDto from '@dto/trx/document/upload-request.dto';
import {requestBody} from 'inversify-express-utils/lib/decorators';
import {DOCUMENT_ENUM} from '@enums/document.enum';
import useAuthMiddleware from '@middleware/auth.middleware';
import {plainToInstance} from 'class-transformer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1Mb
});
@controller(
    '/documents',
    useAuthMiddleware
)
export default class DocumentController extends BaseController {
    @inject<DocumentServiceImpl>(TYPES.DOCUMENT_SERVICE)
    private documentService: DocumentServiceImpl;
    @httpPost(
        '/upload-frs',
        upload.single('file'),
        useRoles(ROLE_ENUM.STUDENT),
        useRequestMiddleware(UploadRequestDto, 'body')
    )
    async uploadFrs(
        @requestBody() dto: UploadRequestDto,
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        dto = plainToInstance(UploadRequestDto, dto);
        const result = await this.documentService.upload(dto.period_id, req.file, DOCUMENT_ENUM.FRS, req.user, res);
        return this.success(result);
    }
    @httpPost(
        '/upload-transcript',
        upload.single('file'),
        useRoles(ROLE_ENUM.STUDENT),
        useRequestMiddleware(UploadRequestDto, 'body')
    )
    async uploadTranscript(
        @requestBody() dto: UploadRequestDto,
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        dto = plainToInstance(UploadRequestDto, dto);
        const result = await this.documentService.upload(dto.period_id, req.file, DOCUMENT_ENUM.TRANSCRIPT, req.user, res);
        return this.success(result);
    }

    @httpGet('/generate-temp-url')
    async generateTempUrl() {
        return this.success(null);
    }
}