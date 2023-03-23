import ResponseInterface from '@interface/response.interface';
import PageMetaInterface from '@interface/page-meta.interface';

export default class ResponseDto {
  static fail(message: string): ResponseInterface<unknown> {
    return {
      message,
      result: null,
      meta: null,
    };
  }

  static validator(errors: {[key: string] : string[]}): ResponseInterface<unknown> {
    return {
      message: 'Please check your input',
      result: errors,
      meta: null,
    };
  }

  static success<T>(result: T, message: string = null): ResponseInterface<T> {
    return {
      message: message,
      result: result,
      meta: null,
    };
  }

  static paginated<T>(result: T[], meta: PageMetaInterface, message: string = null): ResponseInterface<T[]> {
    return {
      message: message,
      result: result,
      meta,
    };
  }
}
