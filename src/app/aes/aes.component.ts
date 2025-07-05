import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-aes',
  standalone: false,
  templateUrl: './aes.component.html',
  styleUrl: './aes.component.css',
})
export class AesComponent {
  plainText = '';
  secretKey = '';
  encryptedText = '';
  decryptedText = '';
  showTooltip = {
    encrypted: false,
    decrypted: false,
  };

  encrypt() {
    this.decryptedText = '';
    this.encryptedText = '';
    if (!this.secretKey || !this.plainText) return;
    this.encryptedText = CryptoJS.AES.encrypt(
      this.plainText,
      this.secretKey
    ).toString();
  }

  decrypt() {
    this.decryptedText = '';
    this.encryptedText = '';
    if (!this.secretKey || !this.plainText) return;
    const bytes = CryptoJS.AES.decrypt(this.plainText, this.secretKey);
    this.decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  }
  copyText(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value.trim();
    if (!value) return;

    textarea.select();
    document.execCommand('copy');

    const isEncrypted = textarea.value === this.encryptedText;
    const isDecrypted = textarea.value === this.decryptedText;

    if (isEncrypted) {
      this.showTooltip.encrypted = true;
      setTimeout(() => (this.showTooltip.encrypted = false), 1000);
    }

    if (isDecrypted) {
      this.showTooltip.decrypted = true;
      setTimeout(() => (this.showTooltip.decrypted = false), 1000);
    }
  }
}
