import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answers Comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentsRepository)
  })

  it('should be albe to fetch recents answer comments', async () => {
    const student = makeStudent({
      name: 'John Snow',
    })
    await inMemoryStudentRepository.create(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswersCommentsRepository.create(comment1)
    await inMemoryAnswersCommentsRepository.create(comment2)
    await inMemoryAnswersCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Snow',
          commentId: comment3.id,
        }),
        expect.objectContaining({
          author: 'John Snow',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Snow',
          commentId: comment2.id,
        }),
      ]),
    )
  })

  it('should be albe to fetch paginated recents answer comments', async () => {
    const student = makeStudent({
      name: 'John Snow',
    })
    await inMemoryStudentRepository.create(student)
    for (let index = 1; index <= 22; index++) {
      await inMemoryAnswersCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
