import { TestBed } from '@angular/core/testing';

import { VideoUploadService } from './video-upload.service';

describe('VideoUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoUploadService = TestBed.get(VideoUploadService);
    expect(service).toBeTruthy();
  });
});
