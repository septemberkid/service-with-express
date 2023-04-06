import SourceAdapter from '@service/minio/source.adapter';

export default class MinioSourceAdapter implements SourceAdapter {
  constructor(private source: Express.Multer.File) {
  }
  extension(): string {
    const parts = this.filename().split('.');
    return parts[parts.length-1];
  }

  filename(): string {
    return this.getSource().originalname;
  }

  getSource() {
    return this.source;
  }

  getBufferSource(): Buffer {
    return this.getSource().buffer;
  }

  mimeType(): string {
    return this.getSource().mimetype;
  }

  path(): string {
    return this.getSource().path;
  }

  size(): number {
    return this.getSource().size;
  }
  
}