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
    amount: faker.finance.amount(),
    owner: faker.helpers.shuffle<Payment['owner']>([
      'Ray',
      'Micia',
    ])[0]!,
    description: faker.lorem.sentence(),
    type: faker.helpers.shuffle<Payment['type']>([
      'general',
      'personal',
      'house',
      'transport',
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
