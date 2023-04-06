export default interface SourceAdapter {
  getSource();
  path(): string;
  filename(): string;
  extension(): string;
  mimeType(): string;
  getBufferSource(): Buffer;
  size(): number;
}