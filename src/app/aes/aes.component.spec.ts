import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AesComponent } from './aes.component';

describe('AesComponent', () => {
  let component: AesComponent;
  let fixture: ComponentFixture<AesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
