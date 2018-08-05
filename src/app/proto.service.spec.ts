import { TestBed, inject } from '@angular/core/testing';

import { ProtoService } from './proto.service';

describe('ProtoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProtoService]
    });
  });

  it('should be created', inject([ProtoService], (service: ProtoService) => {
    expect(service).toBeTruthy();
  }));
});
