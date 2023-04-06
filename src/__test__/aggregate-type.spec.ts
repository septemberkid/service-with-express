import MinioHelper, { Media } from '@service/minio/minio.helper';

describe('Define aggregate type by mime type', () => {
  it('should eq ' + Media.TYPE_IMAGE, function() {
    expect(MinioHelper.getAggregateType('image/jpeg')).toEqual(Media.TYPE_IMAGE)
    expect(MinioHelper.getAggregateType('image/png')).toEqual(Media.TYPE_IMAGE)
    expect(MinioHelper.getAggregateType('image/gif')).toEqual(Media.TYPE_IMAGE)
  });
  it('should eq ' + Media.TYPE_IMAGE_VECTOR, function() {
    expect(MinioHelper.getAggregateType('image/svg+xml')).toEqual(Media.TYPE_IMAGE_VECTOR)
  });
  it('should eq ' + Media.TYPE_PDF, function() {
    expect(MinioHelper.getAggregateType('application/pdf')).toEqual(Media.TYPE_PDF)
  });
  it('should eq ' + Media.TYPE_AUDIO, function() {
    expect(MinioHelper.getAggregateType('audio/aac')).toEqual(Media.TYPE_AUDIO)
    expect(MinioHelper.getAggregateType('audio/ogg')).toEqual(Media.TYPE_AUDIO)
    expect(MinioHelper.getAggregateType('audio/mpeg')).toEqual(Media.TYPE_AUDIO)
    expect(MinioHelper.getAggregateType('audio/mp3')).toEqual(Media.TYPE_AUDIO)
    expect(MinioHelper.getAggregateType('audio/mpeg')).toEqual(Media.TYPE_AUDIO)
    expect(MinioHelper.getAggregateType('audio/wav')).toEqual(Media.TYPE_AUDIO)
  });
  it('should eq ' + Media.TYPE_VIDEO, function() {
    expect(MinioHelper.getAggregateType('video/mp4')).toEqual(Media.TYPE_VIDEO)
    expect(MinioHelper.getAggregateType('video/mpeg')).toEqual(Media.TYPE_VIDEO)
    expect(MinioHelper.getAggregateType('video/ogg')).toEqual(Media.TYPE_VIDEO)
    expect(MinioHelper.getAggregateType('video/webm')).toEqual(Media.TYPE_VIDEO)
  });
  it('should eq ' + Media.TYPE_ARCHIVE, function() {
    expect(MinioHelper.getAggregateType('application/zip')).toEqual(Media.TYPE_ARCHIVE)
    expect(MinioHelper.getAggregateType('application/x-compressed-zip')).toEqual(Media.TYPE_ARCHIVE)
    expect(MinioHelper.getAggregateType('multipart/x-zip')).toEqual(Media.TYPE_ARCHIVE)
  });
  it('should eq ' + Media.TYPE_DOCUMENT, function() {
    expect(MinioHelper.getAggregateType('text/plain')).toEqual(Media.TYPE_DOCUMENT)
    expect(MinioHelper.getAggregateType('application/plain')).toEqual(Media.TYPE_DOCUMENT)
    expect(MinioHelper.getAggregateType('text/xml')).toEqual(Media.TYPE_DOCUMENT)
    expect(MinioHelper.getAggregateType('text/json')).toEqual(Media.TYPE_DOCUMENT)
    expect(MinioHelper.getAggregateType('application/json')).toEqual(Media.TYPE_DOCUMENT)
    expect(MinioHelper.getAggregateType('application/msword')).toEqual(Media.TYPE_DOCUMENT)
    expect(MinioHelper.getAggregateType('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toEqual(Media.TYPE_DOCUMENT)
  });
  it('should eq ' + Media.TYPE_SPREADSHEET, function() {
    expect(MinioHelper.getAggregateType('application/vnd.ms-excel')).toEqual(Media.TYPE_SPREADSHEET)
    expect(MinioHelper.getAggregateType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')).toEqual(Media.TYPE_SPREADSHEET)
  });
  it('should eq ' + Media.TYPE_PRESENTATION, function() {
    expect(MinioHelper.getAggregateType('application/vnd.ms-powerpoint')).toEqual(Media.TYPE_PRESENTATION)
    expect(MinioHelper.getAggregateType('application/vnd.openxmlformats-officedocument.presentationml.presentation')).toEqual(Media.TYPE_PRESENTATION)
    expect(MinioHelper.getAggregateType('application/vnd.openxmlformats-officedocument.presentationml.slideshow')).toEqual(Media.TYPE_PRESENTATION)
  });
  it('should eq ' + Media.TYPE_OTHER, function() {
    expect(MinioHelper.getAggregateType('other-mime-type')).toEqual(Media.TYPE_OTHER)
  });
})