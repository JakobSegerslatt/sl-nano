import { TestBed } from '@angular/core/testing';

import { SlApiService } from './sl-api.service';

describe('SlApiService', () => {
  let service: SlApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
