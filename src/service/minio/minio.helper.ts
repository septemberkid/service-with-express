import SourceAdapter from '@service/minio/source.adapter';
import MinioSourceAdapter from '@service/minio/minio-source.adapter';
import { isEmpty } from '@util/helpers';

export enum Media {
  TYPE_IMAGE = 'IMAGE',
  TYPE_IMAGE_VECTOR = 'IMAGE_VECTOR',
  TYPE_PDF = 'PDF',
  TYPE_AUDIO = 'AUDIO',
  TYPE_VIDEO = 'VIDEO',
  TYPE_ARCHIVE = 'ARCHIVE',
  TYPE_DOCUMENT = 'DOCUMENT',
  TYPE_SPREADSHEET = 'SPREADSHEET',
  TYPE_PRESENTATION = 'PRESENTATION',
  TYPE_OTHER = 'OTHER',
}

const aggregateTypes = {
  [Media.TYPE_IMAGE]: [
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  [Media.TYPE_IMAGE_VECTOR]: [
    'image/svg+xml',
  ],
  [Media.TYPE_PDF]: [
    'application/pdf',
  ],
  [Media.TYPE_AUDIO]: [
    'audio/aac',
    'audio/ogg',
    'audio/mpeg',
    'audio/mp3',
    'audio/mpeg',
    'audio/wav'
  ],
  [Media.TYPE_VIDEO]: [
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm'
  ],
  [Media.TYPE_ARCHIVE]: [
    'application/zip',
    'application/x-compressed-zip',
    'multipart/x-zip',
  ],
  [Media.TYPE_DOCUMENT]: [
    'text/plain',
    'application/plain',
    'text/xml',
    'text/json',
    'application/json',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  [Media.TYPE_SPREADSHEET]: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  [Media.TYPE_PRESENTATION]: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
  ]
}




export default class MinioHelper {
  static convertSource(file: Express.Multer.File): SourceAdapter {
    return new MinioSourceAdapter(file)
  }
  static isValidExtension = (source: SourceAdapter, allowedExtension: string) => {
    return source.extension() === allowedExtension;
  }
  private static possibleAggregateTypesForMimeType(mimeType: string): string[] {
    const types = [];
    Object.keys(aggregateTypes).forEach((key) => {
      if (aggregateTypes[key].includes(mimeType)) {
        types.push(key)
      }
    })
    return types;
  }
  static getAggregateType(mimeType: string): string {
    mimeType = mimeType.toLowerCase();
    const typesForMime = MinioHelper.possibleAggregateTypesForMimeType(mimeType)
    const intersections = Array.from(new Set([...typesForMime]));
    let type: string;
    if (intersections.length > 0) {
      type = intersections[0];
    } else if (isEmpty(typesForMime)) {
      type = Media.TYPE_OTHER;
    }
    return type;
  }
}