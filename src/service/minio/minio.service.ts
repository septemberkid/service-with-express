import { provide } from 'inversify-binding-decorators';
import TYPES from '@enums/types.enum';
import { inject } from 'inversify';
import { BucketItem, BucketItemStat, BucketStream, Client, UploadedObjectInfo } from 'minio';
import PathPrefixer from '@service/minio/path-prefixer';
import MinioException, { MINIO_OPERATION } from '@service/minio/minio.exception';
import SourceAdapter from '@service/minio/source.adapter';
import MinioHelper from '@service/minio/minio.helper';
import { Configuration } from '@core/config';

@provide(TYPES.MINIO_SERVICE)
export default class MinioService {
  private pathPrefixer: PathPrefixer;
  private readonly bucketName: string;
  private readonly expired: number;
  constructor(
    @inject<Client>(TYPES.MINIO_INSTANCE)
    private s3Client: Client
  ) {
    this.pathPrefixer = new PathPrefixer('');
    const config = Configuration.instance();
    this.bucketName = config.get('MINIO_BUCKET_NAME');
    this.expired = config.get('MINIO_EXPIRED')
  }

  private getStreamOfListObjects(path: string): BucketStream<BucketItem> {
    return this.s3Client.listObjectsV2(this.bucketName, path, true)
  }
  fileExist(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      path = this.pathPrefixer.prefixPath(path);
      const stream = this.getStreamOfListObjects(path);
      let bucketItem: BucketItem;
      stream.on('error', (error) => {
        reject(MinioException.dueError(path, MINIO_OPERATION.OPERATION_EXISTENCE_CHECK, error.message))
      })
        .on('data', (item) => {
          bucketItem = item;
        })
        .on('end', () => {
          if (bucketItem) resolve(true);
          else resolve(false)
        })
    })
  }
  temporaryUrl(path: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      path = this.pathPrefixer.prefixPath(path)
      const isFileExist = await this.fileExist(path);
      if (!isFileExist) {
        reject(MinioException.dueError(path, MINIO_OPERATION.GENERATE_TEMPORARY_URL, 'File not found.'));
      } else {
        this.s3Client.presignedGetObject(this.bucketName, path, this.expired,(error, result) => {
          if (error)
            reject(MinioException.dueError(path, MINIO_OPERATION.GENERATE_TEMPORARY_URL, error.message));
          if (result)
            resolve(result);
        })
      }

    })
  }
  getStateObject(path: string): Promise<BucketItemStat> {
    return new Promise((resolve, reject) => {
      path = this.pathPrefixer.prefixPath(path);
      this.s3Client.statObject(this.bucketName, path, (error, result) => {
        if (error)
          reject(MinioException.dueError(path, MINIO_OPERATION.OPERATION_RETRIEVE_STAT_OBJECT, error.message))
        if (result) {
          resolve(result)
        }
      })
    })
  }
  private putObject(path: string, source: SourceAdapter, ): Promise<UploadedObjectInfo> {
    return new Promise((resolve, reject) => {
      this.s3Client.putObject(this.bucketName, path, source.getBufferSource(), source.size(), {
        'Content-Type': source.mimeType()
      }, (error, result) => {
        if (error)
          reject(MinioException.dueError(path, MINIO_OPERATION.OPERATION_WRITE, error.message))
        if (result)
          resolve(result)
      })
    })
  }
  tagging(path: string, tags: Record<string, string>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.s3Client.setObjectTagging(this.bucketName, path, tags,async (error) => {
        if (error) {
          reject(MinioException.dueError(path, MINIO_OPERATION.OPERATION_TAGGING, error.message ?? ''))
        } else {
          resolve()
        }
      })
    })
  }

  write(source: SourceAdapter, path: string, context: string, uploaderId?: number): Promise<UploadedObjectInfo> {
    return new Promise(async (resolve, reject) => {
      path = this.pathPrefixer.prefixPath(path);
      try {
        const result = await this.putObject(path, source)
        await this.tagging(path, {
          context: context.toLowerCase(),
          uploader_id: uploaderId.toString(),
          aggregate_type: MinioHelper.getAggregateType(source.mimeType())
        })
        resolve(result)
      } catch (e) {
        reject(e);
      }
    })
  }
  listObject(path): Promise<BucketItem[]> {
    return new Promise((resolve, reject) => {
      path = this.pathPrefixer.prefixDirectoryPath(path);
      const stream = this.getStreamOfListObjects(path);
      const bucketItems: BucketItem[] = [];
      stream.on('error', (error) => {
        reject(MinioException.dueError(path, MINIO_OPERATION.OPERATION_EXISTENCE_CHECK, error.message))
      })
        .on('data', (item) => {
          bucketItems.push(item);
        })
        .on('end', () => {
          resolve(bucketItems)
        })
    })
  }
}