import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

let inMemoryStudentsRepository: InMemoryStudentRepository
let sut: RegisterStudentUseCase
let fakeHasher: FakeHasher

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be albe to create a student', async () => {
    const result = await sut.execute({
      name: 'John Dow',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Dow',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const hashPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashPassword)
  })

  it('should not be albe to create a student with duplicate email', async () => {
    await sut.execute({
      name: 'John Dow',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Dow',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  })
})
