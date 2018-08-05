import { TestBed, inject } from '@angular/core/testing';

import { WrapperService } from './wrapper.service';

describe('WrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WrapperService]
    });
  });

  it('should be created', inject([WrapperService], (service: WrapperService) => {
    expect(service).toBeTruthy();
  }));
});
