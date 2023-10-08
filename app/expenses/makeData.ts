import { faker } from '@faker-js/faker'
import { Payment } from './columns'


const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Payment => {
  return {
    id: faker.number.int().toString(),
    amount: faker.finance.amount({min: 1, max: 100}),
    owner: faker.helpers.shuffle<Payment['owner']>([
      'Jessie',
      'Mark',
      'Ettore',
      'Carl',
      'Tiffany',
    ])[0]!,
    description: faker.lorem.sentence(),
    type: faker.helpers.shuffle<Payment['type']>([
      'general',
      'personal',
      'house',
      'transport',
    ])[0]!,
    date: faker.helpers.shuffle<Date>([
      new Date('2023-01-01'),
      new Date('2023-02-01'),
      new Date('2023-03-01'),
      new Date('2023-03-01'),
      new Date('2023-04-01'),
      new Date('2023-05-01'),
      new Date('2023-06-01'),
      new Date('2023-07-01'),
      new Date('2023-08-01'),
      new Date('2023-09-01'),
      new Date('2023-10-07'),
      new Date('2023-11-07'),
      new Date('2023-12-07'),
    ])[0]!,
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Payment[] => {
    const len = lens[depth]!
    return range(len).map((d): Payment => {
      return {
        ...newPerson()
      }
    })
  }
  return makeDataLevel()
}
