import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';

type OutputField = 'encrypted' | 'decrypted';

@Component({
  selector: 'app-aes',
  standalone: false,
  templateUrl: './aes.component.html',
  styleUrl: './aes.component.css',
})
export class AesComponent {
  inputText = '';
  secretKey = '';
  encryptedText = '';
  decryptedText = '';
  errorMessage = '';
  showTooltip = {
    encrypted: false,
    decrypted: false,
  };

  onInputChange(value: string) {
    this.inputText = value;
    this.clearOutputs();
  }

  onKeyChange(value: string) {
    this.secretKey = value;
    this.clearOutputs();
  }

  encrypt() {
    this.clearOutputs();
    if (!this.secretKey || !this.inputText) return;
    this.encryptedText = CryptoJS.AES.encrypt(
      this.inputText,
      this.secretKey
    ).toString();
  }

  decrypt() {
    // Decrypt what we just produced, or the raw input when nothing has been
    // encrypted yet (i.e. the user pasted an encrypted string in).
    const cipherText = this.encryptedText || this.inputText;
    this.decryptedText = '';
    this.errorMessage = '';
    if (!this.secretKey || !cipherText) return;

    let plain = '';
    try {
      plain = CryptoJS.AES.decrypt(cipherText, this.secretKey).toString(
        CryptoJS.enc.Utf8
      );
    } catch {
      // crypto-js throws "Malformed UTF-8 data" on a wrong key; other keys
      // just yield an empty string, so both cases fall through to the error.
      plain = '';
    }

    if (!plain) {
      this.errorMessage =
        'Could not decrypt — check the secret key and the encrypted text.';
      return;
    }
    this.decryptedText = plain;
  }

  async copyText(field: OutputField) {
    const value = (
      field === 'encrypted' ? this.encryptedText : this.decryptedText
    ).trim();
    if (!value) return;
    if (!(await this.writeToClipboard(value))) return;

    this.showTooltip[field] = true;
    setTimeout(() => (this.showTooltip[field] = false), 1000);
  }

  private clearOutputs() {
    this.encryptedText = '';
    this.decryptedText = '';
    this.errorMessage = '';
  }

  private async writeToClipboard(value: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // navigator.clipboard is unavailable outside a secure context (plain
      // http), so fall back to the legacy path before giving up.
      return this.legacyCopy(value);
    }
  }

  private legacyCopy(value: string): boolean {
    const scratch = document.createElement('textarea');
    scratch.value = value;
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.appendChild(scratch);
    scratch.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      document.body.removeChild(scratch);
    }
  }
}
