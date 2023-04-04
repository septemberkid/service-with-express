import PathPrefixer from '@service/minio/path-prefixer';

describe('path-prefixer-test', () => {
  it('path_prefixing_with_a_prefix', () => {
    const prefixer = new PathPrefixer('prefix');
    const prefixedPath = prefixer.prefixPath('some/path.txt');
    expect(prefixedPath).toEqual('prefix/some/path.txt')
  })
  it('path_stripping_with_a_prefix', () => {
    const prefixer = new PathPrefixer('prefix');
    const strippedPath = prefixer.stripPrefix('prefix/some/path.txt');
    expect(strippedPath).toEqual('some/path.txt')
  })
  it('path_stripping_is_reversable', () => {
    const prefixer = new PathPrefixer('prefix');
    const strippedPath = prefixer.stripPrefix('prefix/some/path.txt');
    expect(prefixer.prefixPath(strippedPath)).toEqual('prefix/some/path.txt');
    const prefixedPath = prefixer.prefixPath('some/path.txt');
    expect(prefixer.stripPrefix(prefixedPath)).toEqual('some/path.txt');
  })
  it('prefixing_without_a_prefix', () => {
    const prefixer = new PathPrefixer('');
    let path = prefixer.prefixPath('path/to/prefix.txt');
    expect(path).toEqual('path/to/prefix.txt');

    path = prefixer.prefixPath('/path/to/prefix.txt');
    expect(path).toEqual('path/to/prefix.txt');
  })
  it('prefixing_for_a_directory', () => {
    const prefixer = new PathPrefixer('/prefix');
    let path = prefixer.prefixDirectoryPath('something');
    expect(path).toEqual('/prefix/something/');

    path = prefixer.prefixDirectoryPath('');
    expect(path).toEqual('/prefix/');
  })
  it('prefixing_for_a_directory_without_a_prefix', () => {
    const prefixer = new PathPrefixer('');
    let path = prefixer.prefixDirectoryPath('something');
    expect(path).toEqual('something/');

    path = prefixer.prefixDirectoryPath('');
    expect(path).toEqual('');
  })
  it('stripping_a_directory_prefix', () => {
    const prefixer = new PathPrefixer('/something/');
    let path = prefixer.stripDirectoryPrefix('/something/this/');
    expect(path).toEqual('this');

    path = prefixer.stripDirectoryPrefix('/something/and-this\\');
    expect(path).toEqual('and-this');
  })
})