import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import ECB from 'crypto-js/mode-ecb'
import Pkcs7 from 'crypto-js/pad-pkcs7'

const key = Utf8.parse('cqbroadtechquery')

export function encrypt(words: string): string {
  const cryWord = Utf8.parse(words)
  const encrypted = AES.encrypt(cryWord, key, {
    mode: ECB,
    padding: Pkcs7,
  })

  return encrypted.toString()
}

export function decrypt(encrypted: string): string {
  const decrypted = AES.decrypt(encrypted, key, {
    mode: ECB,
    padding: Pkcs7,
  })

  return decrypted.toString(Utf8)
}
