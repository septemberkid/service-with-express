import { BucketItem } from 'minio';

export default interface CustomBucketItemInterface extends Readonly<Omit<BucketItem, 'prefix'|'name'|'lastModified'>> {
  readonly filename: string;
  readonly url: string;
  readonly last_modified: Date;
}