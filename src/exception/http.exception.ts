import { HttpError } from 'routing-controllers';

export default class HttpException extends HttpError {
  constructor(
    public readonly httpCode: number,
    public readonly message: string
  ) {
    super(httpCode, message);
  }
}
