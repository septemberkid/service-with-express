interface IPageMeta {
  readonly limit: number;
  readonly offset: number;
  readonly page: number;
  readonly pages: number;
  readonly total: number;
}

interface IResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly result: T;
  readonly meta?: IPageMeta;
}

export default class ResponseDto {
  static fail(message: string): IResponse<unknown> {
    return {
      success: false,
      message,
      result: null,
      meta: null,
    };
  }

  static success<T>(result: T): IResponse<T> {
    return {
      success: true,
      message: null,
      result: result,
      meta: null,
    };
  }

  static paginated<T>(result: T[], meta: IPageMeta): IResponse<T[]> {
    return {
      success: true,
      message: null,
      result: result,
      meta,
    };
  }
}
