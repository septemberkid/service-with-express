import PageMetaInterface from '@interface/page-meta.interface';

export default interface ResponseInterface<T> {
  readonly message: string;
  readonly result: T;
  readonly meta?: PageMetaInterface;
}