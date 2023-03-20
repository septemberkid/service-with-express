export interface IPageMeta {
  readonly limit: number;
  readonly offset: number;
  readonly page: number;
  readonly pages: number;
  readonly total: number;
}

interface IResponse<T> {
  readonly message: string;
  readonly result: T;
  readonly meta?: IPageMeta;
}

export default class ResponseDto {
  static fail(message: string): IResponse<unknown> {
    return {
      message,
      result: null,
      meta: null,
    };
  }

  static success<T>(result: T, message: string = null): IResponse<T> {
    return {
      message: message,
      result: result,
      meta: null,
    };
  }

  static paginated<T>(result: T[], meta: IPageMeta, message: string = null): IResponse<T[]> {
    return {
      message: message,
      result: result,
      meta,
    };
  }
}
