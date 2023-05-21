export enum MINIO_OPERATION {
  OPERATION_EXISTENCE_CHECK = 'EXISTENCE_CHECK',
  OPERATION_WRITE = 'WRITE',
  OPERATION_TAGGING = 'TAGGING',
  OPERATION_READ = 'READ',
  OPERATION_RETRIEVE_STAT_OBJECT = 'RETRIEVE_STAT_OBJECT',
  GENERATE_TEMPORARY_URL = 'GENERATE_TEMPORARY_URL',

}
export default class MinioException extends Error {
  constructor(private path, private operation: MINIO_OPERATION, private reason: string, private httpCode: number) {
    super(`Unable to ${operation} operation for: ${path} cause: ${reason}`);
    this.name = 'MinioException'
    this.httpCode = httpCode;
  }
  static dueError(path: string, operation: MINIO_OPERATION, reason: string, httpCode = 500) {
    return new MinioException(path, operation, reason, httpCode);
  }
  getOperation(): MINIO_OPERATION {
    return this.operation;
  }
}