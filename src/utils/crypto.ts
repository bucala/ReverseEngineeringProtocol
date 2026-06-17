/**
 * AES-256-GCM encryption/decryption via the Web Crypto API.
 *
 * Key derivation: PBKDF2 with SHA-256, 310 000 iterations (OWASP 2023 recommendation).
 * Stored layout (concatenated bytes):
 *   [4 bytes magic] [1 byte version] [16 bytes salt] [12 bytes IV] [ciphertext + 16-byte auth tag]
 */

const MAGIC = new Uint8Array([0x52, 0x45, 0x50, 0x4a]) // "REPJ"
const FILE_VERSION = 1
const SALT_LENGTH = 16
const IV_LENGTH = 12
const PBKDF2_ITERATIONS = 310_000
const KEY_LENGTH = 256

async function deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encrypt(plaintext: string, password: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder()
  const saltArr = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const ivArr = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const salt = saltArr.buffer as ArrayBuffer
  const iv = ivArr.buffer as ArrayBuffer
  const key = await deriveKey(password, salt)

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  )

  // Assemble: magic (4) + version (1) + salt (16) + iv (12) + ciphertext
  const header = new Uint8Array(4 + 1 + SALT_LENGTH + IV_LENGTH)
  header.set(MAGIC, 0)
  header[4] = FILE_VERSION
  header.set(saltArr, 5)
  header.set(ivArr, 5 + SALT_LENGTH)

  const result = new Uint8Array(header.length + ciphertext.byteLength)
  result.set(header, 0)
  result.set(new Uint8Array(ciphertext), header.length)
  return result.buffer as ArrayBuffer
}

export async function decrypt(data: ArrayBuffer, password: string): Promise<string> {
  const bytes = new Uint8Array(data)

  // Validate magic
  for (let i = 0; i < MAGIC.length; i++) {
    if (bytes[i] !== MAGIC[i]) throw new Error('Invalid file format')
  }

  const version = bytes[4]
  if (version !== FILE_VERSION) throw new Error(`Unsupported file version: ${version}`)

  const saltBuf = bytes.buffer.slice(5, 5 + SALT_LENGTH)
  const ivBuf = bytes.buffer.slice(5 + SALT_LENGTH, 5 + SALT_LENGTH + IV_LENGTH)
  const ciphertext = bytes.buffer.slice(5 + SALT_LENGTH + IV_LENGTH)

  const key = await deriveKey(password, saltBuf)

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBuf },
      key,
      ciphertext
    )
    return new TextDecoder().decode(plaintext)
  } catch {
    throw new Error('Decryption failed: incorrect password or corrupted file')
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}
