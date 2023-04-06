import { ltrim, rtrim } from '@util/helpers';

export default class PathPrefixer {
  constructor(private readonly _prefix: string, private _separator = '/') {
    this._prefix = rtrim(_prefix, '\\/')
    if (this._prefix !== '' || this._prefix === _separator) {
      this._prefix += _separator;
    }
  }

  public prefixPath(path: string): string {
    return this._prefix + ltrim(path, '\\/');
  }
  public stripPrefix(path: string): string {
    return path.substring(this._prefix.length);
  }
  public stripDirectoryPrefix(path: string): string {
    return rtrim(this.stripPrefix(path), '\\/');
  }
  public prefixDirectoryPath(path: string): string {
    const prefixedPath = this.prefixPath(rtrim(path, '\\/'));
    if (prefixedPath === '' || prefixedPath.substring(prefixedPath.length-1) === this._separator) {
      return prefixedPath;
    }
    return prefixedPath + this._separator;
  }
}