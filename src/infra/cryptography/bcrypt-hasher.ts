import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generate'
import { compare, hash } from 'bcryptjs'

export class BcryptHashert implements HashGenerator, HashCompare {
  private HASH_SALT_LENGTH = 8 // number of rounds

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
