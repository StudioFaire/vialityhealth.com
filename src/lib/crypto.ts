import crypto from 'crypto';

const IV_LENGTH: number = 16;

function getEncryptionKey(): string {
  const key = process.env.SC_ENCRYPTION_KEY?.trim();
  if (!key) {
    throw new Error('SC_ENCRYPTION_KEY environment variable is not set');
  }
  if (key.length !== 64) {
    throw new Error(`SC_ENCRYPTION_KEY must be 64 hex characters (32 bytes). Got ${key.length} characters.`);
  }
  if (!/^[0-9a-fA-F]+$/.test(key)) {
    throw new Error('SC_ENCRYPTION_KEY must contain only hexadecimal characters (0-9, a-f, A-F)');
  }
  return key;
}

export function keyGen() {
  return crypto.randomBytes(32).toString('hex');
}

export function encrypt(plainText: string, keyHex?: string): string {
  const key = keyHex ?? getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function encryptAndReverse(text: string, keyHex?: string): string {
  let textReversed = text.split('').reverse().join('');
  const encrypted = encrypt(textReversed, keyHex);
  return encrypted;
}

export function decrypt(text: string, keyHex?: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid or corrupted cipher format');
  }

  const key = keyHex ?? getEncryptionKey();
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(ivHex, 'hex'));
  let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

  return decrypted.toString();
}

export function decryptAndReverse(text: string, keyHex?: string): string {
  const decrypted = decrypt(text, keyHex);
  return decrypted.split('').reverse().join('');
}