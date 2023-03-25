import { inject } from 'inversify';
import { BucketItem, Client as MinioClient, UploadedObjectInfo } from 'minio';
import TYPES from '@enums/types.enum';
import { provide } from 'inversify-binding-decorators';

const BUCKET_NAME = 'spk-mbkm';
const EXPIRED = 2*60*60; // 24 hours

@provide(TYPES.MINIO_SERVICE)
export default class MinioService {
  @inject<MinioClient>(TYPES.MINIO_INSTANCE)
  private _minioInstance: MinioClient
  
  


  private getPathByNIM(nim: string) : string {
    return `submission/${nim}`
  }

  public async saveObject(objectName: string, file: Express.Multer.File) : Promise<UploadedObjectInfo> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this._minioInstance.putObject(BUCKET_NAME,objectName,file.buffer,{
          'Content-Type': file.mimetype
        });
        resolve(res);
      } catch (e) {
        reject(e);
      }
    })
  }
  public getPrefix(...prefixes: string[]): string {
    return prefixes.join('/');
  }

  public async getPreSignedUrl(object: string) : Promise<string> {
    return this._minioInstance.presignedUrl('GET', BUCKET_NAME, object, EXPIRED);
  }

  public readDocumentsByNIM(nim: string): Promise<BucketItem[]> {
    const prefix = this.getPrefix('submission', nim);
    const stream = this._minioInstance.listObjectsV2(BUCKET_NAME, prefix, true);
    return new Promise((resolve, reject) => {
      const items: BucketItem[] = [];
      stream.on('data', (item: BucketItem) => {
        items.push(item);
      });
      stream.on('error', err => reject(err));
      stream.on('end', () => {
        resolve(items);
      });
    });
  }
}