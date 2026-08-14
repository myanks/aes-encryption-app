import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AesComponent } from './aes.component';

describe('AesComponent', () => {
  let component: AesComponent;
  let fixture: ComponentFixture<AesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AesComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('round-trips text through encrypt then decrypt', () => {
    component.onInputChange('hello world');
    component.onKeyChange('s3cret');

    component.encrypt();
    expect(component.encryptedText).toBeTruthy();
    expect(component.encryptedText).not.toBe('hello world');

    component.decrypt();
    expect(component.decryptedText).toBe('hello world');
    expect(component.errorMessage).toBe('');
  });

  it('decrypts an encrypted string pasted into the input', () => {
    component.onInputChange('hello world');
    component.onKeyChange('s3cret');
    component.encrypt();
    const cipherText = component.encryptedText;

    component.onInputChange(cipherText);
    component.decrypt();

    expect(component.decryptedText).toBe('hello world');
  });

  it('reports an error instead of throwing on a wrong key', () => {
    component.onInputChange('hello world');
    component.onKeyChange('s3cret');
    component.encrypt();
    const cipherText = component.encryptedText;

    component.onInputChange(cipherText);
    component.onKeyChange('wrong-key');
    component.decrypt();

    expect(component.decryptedText).toBe('');
    expect(component.errorMessage).toBeTruthy();
  });

  it('clears stale output when the input changes', () => {
    component.onInputChange('hello world');
    component.onKeyChange('s3cret');
    component.encrypt();
    expect(component.encryptedText).toBeTruthy();

    component.onInputChange('something else');

    expect(component.encryptedText).toBe('');
    expect(component.decryptedText).toBe('');
  });

  it('does nothing without a secret key', () => {
    component.onInputChange('hello world');
    component.encrypt();

    expect(component.encryptedText).toBe('');
  });
});
